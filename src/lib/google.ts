import crypto from 'crypto';

const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/dialogflow',
];

function getConfig() {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const projectId = process.env.DIALOGFLOW_PROJECT_ID;
  const calendarId = process.env.CALENDAR_ID;
  const timeZone = process.env.CALENDAR_TIMEZONE || 'America/Mexico_City';
  const durationMinutes = parseInt(process.env.CONSULTATION_DURATION_MINUTES || '60', 10);

  if (!privateKey || !clientEmail) {
    return null;
  }

  return {
    privateKey: privateKey.replace(/\\n/g, '\n'),
    clientEmail,
    projectId,
    calendarId: calendarId || 'primary',
    timeZone,
    durationMinutes,
  };
}

function createJWT(clientEmail: string, privateKey: string): string {
  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: clientEmail,
    scope: SCOPES.join(' '),
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const base64Encode = (obj: object) =>
    Buffer.from(JSON.stringify(obj)).toString('base64url');

  const signatureInput = `${base64Encode(header)}.${base64Encode(payload)}`;
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(signatureInput);
  const signature = sign.sign(privateKey, 'base64url');

  return `${signatureInput}.${signature}`;
}

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 300000) {
    return cachedToken.token;
  }

  const config = getConfig();
  if (!config) {
    throw new Error('Google credentials not configured');
  }

  const jwt = createJWT(config.clientEmail, config.privateKey);
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to get access token: ${err}`);
  }

  const data = await res.json();
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
  return data.access_token;
}

export interface TimeSlot {
  start: string;
  end: string;
  label: string;
}

export async function getAvailability(date: string): Promise<TimeSlot[]> {
  const config = getConfig();
  if (!config) {
    return generateFallbackSlots(date);
  }

  const token = await getAccessToken();
  const timeMin = `${date}T00:00:00Z`;
  const timeMax = `${date}T23:59:59Z`;

  const res = await fetch('https://www.googleapis.com/calendar/v3/freeBusy', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      timeMin,
      timeMax,
      timeZone: config.timeZone,
      items: [{ id: config.calendarId }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error('Calendar freeBusy error:', err);
    return generateFallbackSlots(date);
  }

  const data = await res.json();
  const busyRanges = data.calendars?.[config.calendarId]?.busy || [];

  return generateAvailableSlots(date, busyRanges);
}

export async function createCalendarEvent(params: {
  date: string;
  time: string;
  name: string;
  email: string;
  phone?: string;
  description?: string;
}): Promise<{ success: boolean; eventUrl?: string; error?: string }> {
  const config = getConfig();
  if (!config) {
    return { success: false, error: 'Google Calendar not configured' };
  }

  const token = await getAccessToken();
  const startDateTime = `${params.date}T${params.time}:00`;
  const start = new Date(`${startDateTime}`);
  const end = new Date(start.getTime() + config.durationMinutes * 60000);

  const event = {
    summary: `Consultoría LUMERAQ - ${params.name}`,
    description: `Cliente: ${params.name}\nEmail: ${params.email}${params.phone ? `\nTeléfono: ${params.phone}` : ''}${params.description ? `\n\nNotas:\n${params.description}` : ''}`,
    start: {
      dateTime: start.toISOString(),
      timeZone: config.timeZone,
    },
    end: {
      dateTime: end.toISOString(),
      timeZone: config.timeZone,
    },
    attendees: [{ email: params.email }],
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 1440 },
        { method: 'popup', minutes: 30 },
      ],
    },
  };

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(config.calendarId)}/events?sendNotifications=true`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    return { success: false, error: err };
  }

  const data = await res.json();
  return { success: true, eventUrl: data.htmlLink };
}

export function isCalendarConfigured(): boolean {
  return !!(process.env.GOOGLE_PRIVATE_KEY && process.env.GOOGLE_CLIENT_EMAIL);
}

function generateFallbackSlots(date: string): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const businessHours = [
    { start: 9, end: 13 },
    { start: 14, end: 18 },
  ];

  for (const period of businessHours) {
    for (let hour = period.start; hour < period.end; hour++) {
      const pad = (n: number) => String(n).padStart(2, '0');
      const startStr = `${date}T${pad(hour)}:00:00`;
      const endStr = `${date}T${pad(hour + 1)}:00:00`;
      slots.push({
        start: startStr,
        end: endStr,
        label: `${pad(hour)}:00 - ${pad(hour + 1)}:00`,
      });
    }
  }
  return slots;
}

function generateAvailableSlots(
  date: string,
  busyRanges: { start: string; end: string }[]
): TimeSlot[] {
  const allSlots = generateFallbackSlots(date);
  const available = allSlots.filter((slot) => {
    const slotStart = new Date(slot.start).getTime();
    const slotEnd = new Date(slot.end).getTime();
    return !busyRanges.some((busy) => {
      const busyStart = new Date(busy.start).getTime();
      const busyEnd = new Date(busy.end).getTime();
      return slotStart < busyEnd && slotEnd > busyStart;
    });
  });
  return available;
}
