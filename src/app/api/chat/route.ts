import { NextResponse } from 'next/server';
import { getAvailability, createCalendarEvent, isCalendarConfigured } from '@/lib/google';

interface RequestBody {
  action: string;
  data: Record<string, unknown>;
}

interface ResponseData {
  reply: string;
  action?: string;
  actionData?: Record<string, unknown>;
}

const GREETING_MESSAGE = 'greeting';
const COLLECT_DESCRIPTION = 'collect_description';
const COLLECT_DATE = 'collect_date';
const SELECT_TIME = 'select_time';
const COLLECT_INFO = 'collect_info';
const CONFIRMED = 'confirmed';

function getGreeting(locale: string): ResponseData {
  if (locale === 'en') {
    return {
      reply: 'Hello! 👋 I am LUMERAQ\'s virtual assistant. I can help you schedule a free consultation. Would you like to tell me about your project or needs?',
      action: COLLECT_DESCRIPTION,
    };
  }
  return {
    reply: '¡Hola! 👋 Soy el asistente virtual de LUMERAQ. Puedo ayudarte a agendar una consultoría gratuita. ¿Te gustaría contarme sobre tu proyecto o necesidades?',
    action: COLLECT_DESCRIPTION,
  };
}

function handleDescription(description: string, locale: string): ResponseData {
  const desc = description.toLowerCase();
  const hasKeywords = /consultor|asesor|agend|program|quiero|necesit/i.test(desc);

  if (locale === 'en') {
    return {
      reply: hasKeywords
        ? 'Great! Let\'s find the best day for your consultation. What date works best for you?'
        : 'Thank you for sharing! I\'ll note that down. Now, what date would you like to schedule the consultation?',
      action: COLLECT_DATE,
      actionData: { description },
    };
  }

  return {
    reply: hasKeywords
      ? '¡Excelente! Busquemos el mejor día para tu consultoría. ¿Qué fecha te queda mejor?'
      : '¡Gracias por compartir! Lo tendré en cuenta. Ahora, ¿qué fecha te gustaría para agendar la consultoría?',
    action: COLLECT_DATE,
    actionData: { description },
  };
}

function handleDate(date: string, locale: string): ResponseData {
  if (locale === 'en') {
    return {
      reply: `Perfect! Let me check available times for ${date}...`,
      action: SELECT_TIME,
      actionData: { date },
    };
  }
  return {
    reply: `Perfecto! Déjame consultar los horarios disponibles para el ${date}...`,
    action: SELECT_TIME,
    actionData: { date },
  };
}

function handleTimeSelection(time: string, date: string, locale: string): ResponseData {
  if (locale === 'en') {
    return {
      reply: `Great choice! To confirm, please provide your name and email address.`,
      action: COLLECT_INFO,
      actionData: { date, time },
    };
  }
  return {
    reply: '¡Excelente elección! Para confirmar, por favor proporciona tu nombre y correo electrónico.',
    action: COLLECT_INFO,
    actionData: { date, time },
  };
}

function handleConfirmation(locale: string): ResponseData {
  if (locale === 'en') {
    return {
      reply: 'Your consultation has been scheduled successfully! 🎉 We\'ll send you a confirmation email with all the details. If you need to reschedule, feel free to contact us.',
      action: CONFIRMED,
    };
  }
  return {
    reply: '¡Tu consultoría ha sido agendada exitosamente! 🎉 Te enviaremos un correo de confirmación con todos los detalles. Si necesitas reprogramar, no dudes en contactarnos.',
    action: CONFIRMED,
  };
}

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();
    const { action, data } = body;
    const locale = (data?.locale as string) || 'es';

    switch (action) {
      case GREETING_MESSAGE:
        return NextResponse.json(getGreeting(locale));

      case COLLECT_DESCRIPTION: {
        const description = (data?.text as string) || '';
        return NextResponse.json(handleDescription(description, locale));
      }

      case COLLECT_DATE: {
        const date = (data?.date as string) || '';
        if (!date) {
          return NextResponse.json({
            reply: locale === 'en' ? 'Please select a valid date.' : 'Por favor selecciona una fecha válida.',
            action: COLLECT_DATE,
          });
        }
        return NextResponse.json(handleDate(date, locale));
      }

      case SELECT_TIME: {
        const date = (data?.date as string) || '';
        const timeSlots = await getAvailability(date);
        const nextStep = data?.time
          ? handleTimeSelection(data.time as string, date, locale)
          : {
              reply: locale === 'en'
                ? 'Here are the available times:'
                : 'Estos son los horarios disponibles:',
              action: SELECT_TIME,
              actionData: { date, timeSlots },
            };
        return NextResponse.json(nextStep);
      }

      case COLLECT_INFO: {
        const { name, email, phone, description } = data || {};
        if (!name || !email) {
          return NextResponse.json({
            reply: locale === 'en'
              ? 'Please provide your name and email to confirm.'
              : 'Por favor proporciona tu nombre y correo para confirmar.',
            action: COLLECT_INFO,
          });
        }

        if (!isCalendarConfigured()) {
          return NextResponse.json(handleConfirmation(locale));
        }

        const date = (data?.date as string) || '';
        const time = (data?.time as string) || '';
        const result = await createCalendarEvent({
          date,
          time,
          name: name as string,
          email: email as string,
          phone: (phone as string) || undefined,
          description: (description as string) || undefined,
        });

        if (result.success) {
          return NextResponse.json(handleConfirmation(locale));
        }

        return NextResponse.json({
          reply: locale === 'en'
            ? `There was an error scheduling your appointment. Please try again or contact us directly.`
            : `Hubo un error al agendar tu cita. Por favor intenta de nuevo o contáctanos directamente.`,
          action: COLLECT_INFO,
        });
      }

      default:
        return NextResponse.json(getGreeting(locale));
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      {
        reply: 'Lo siento, hubo un error inesperado. Por favor intenta de nuevo.',
        action: 'error',
      },
      { status: 500 }
    );
  }
}
