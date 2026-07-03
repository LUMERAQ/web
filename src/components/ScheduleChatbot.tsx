'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import MaterialIcon from './MaterialIcon';

interface ChatMessage {
  id: string;
  role: 'bot' | 'user';
  text: string;
  type?: 'text' | 'timeSlots';
  timeSlots?: { start: string; end: string; label: string }[];
}

interface StepData {
  description?: string;
  date?: string;
  time?: string;
  name?: string;
  email?: string;
  phone?: string;
  timeSlots?: { start: string; end: string; label: string }[];
}

type ChatStep = 'greeting' | 'collect_description' | 'collect_date' | 'select_time' | 'collect_info' | 'confirmed';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ScheduleChatbot({ open, onClose }: Props) {
  const t = useTranslations('chatbot');
  const locale = useLocale();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [step, setStep] = useState<ChatStep>('greeting');
  const [stepData, setStepData] = useState<StepData>({});
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const idCounter = useRef(0);
  const nextId = useCallback(() => {
    idCounter.current += 1;
    return idCounter.current;
  }, []);

  const resetChat = useCallback(() => {
    setMessages([]);
    setStep('greeting');
    setStepData({});
    setInput('');
    setLoading(false);
    setSelectedDate('');

    const greeting: ChatMessage = {
      id: `bot-${nextId()}`,
      role: 'bot',
      text: locale === 'es'
        ? '¡Hola! 👋 Soy el asistente virtual de LUMERAQ. Puedo ayudarte a agendar una consultoría gratuita. ¿Te gustaría contarme sobre tu proyecto o necesidades?'
        : 'Hello! 👋 I am LUMERAQ\'s virtual assistant. I can help you schedule a free consultation. Would you like to tell me about your project or needs?',
    };
    setMessages([greeting]);
  }, [locale, nextId]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        resetChat();
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [open, resetChat]);

  async function sendMessage(text: string) {
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${nextId()}`,
      role: 'user',
      text: text.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: step,
          data: { ...stepData, text, locale },
        }),
      });

      const data = await res.json();

      const botMsg: ChatMessage = {
        id: `bot-${nextId()}`,
        role: 'bot',
        text: data.reply,
        type: data.actionData?.timeSlots ? 'timeSlots' : 'text',
        timeSlots: data.actionData?.timeSlots,
      };
      setMessages((prev) => [...prev, botMsg]);

      if (data.action) {
        setStep(data.action as ChatStep);
        if (data.actionData) {
          setStepData((prev) => ({ ...prev, ...data.actionData }));
        }
      }
    } catch {
      const errorMsg: ChatMessage = {
        id: `bot-error-${nextId()}`,
        role: 'bot',
        text: locale === 'es'
          ? 'Lo siento, hubo un error. Por favor intenta de nuevo.'
          : 'Sorry, there was an error. Please try again.',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  }

  function handleSend() {
    if (!input.trim() || loading) return;

    if (step === 'collect_info') {
      const nameMatch = input.match(/(?:me llamo|soy|name:?|nombre:?)\s*([A-Za-zÁáÉéÍíÓóÚúÑñ\s]+)/i);
      const emailMatch = input.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);

      if (!nameMatch && !emailMatch) {
        const msg: ChatMessage = {
          id: `bot-hint-${nextId()}`,
          role: 'bot',
          text: locale === 'es'
            ? 'Por favor incluye tu nombre y correo electrónico. Ejemplo: "Me llamo Juan Pérez, mi correo es juan@ejemplo.com"'
            : 'Please include your name and email. Example: "My name is John Doe, my email is john@example.com"',
        };
        setMessages((prev) => [...prev, msg]);
        setInput('');
        return;
      }

      const extractedName = nameMatch ? nameMatch[1].trim() : input.split(/[,@]/)[0].trim();
      const extractedEmail = emailMatch ? emailMatch[1] : '';

      setStepData((prev) => ({ ...prev, name: extractedName, email: extractedEmail }));
      sendMessage(input.trim());
      return;
    }

    sendMessage(input.trim());
  }

  function handleDateSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const date = e.target.value;
    setSelectedDate(date);
    setStepData((prev) => ({ ...prev, date }));
  }

  async function confirmDate() {
    if (!selectedDate || loading) return;

    const userMsg: ChatMessage = {
      id: `user-date-${nextId()}`,
      role: 'user',
      text: selectedDate,
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'select_time', data: { date: selectedDate, locale } }),
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `bot-slots-${nextId()}`,
        role: 'bot',
        text: data.reply,
        type: 'timeSlots',
        timeSlots: data.actionData?.timeSlots,
      };
      setMessages((prev) => [...prev, botMsg]);

      if (data.action) {
        setStep(data.action as ChatStep);
        if (data.actionData) {
          setStepData((prev) => ({ ...prev, ...data.actionData }));
        }
      }
    } catch {
      const errorMsg: ChatMessage = {
        id: `bot-error-${nextId()}`,
        role: 'bot',
        text: locale === 'es'
          ? 'Lo siento, no pude consultar la disponibilidad. Intenta de nuevo.'
          : 'Sorry, I couldn\'t check availability. Please try again.',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  }

  async function selectTimeSlot(slot: { start: string; end: string; label: string }) {
    if (loading) return;

    const userMsg: ChatMessage = {
      id: `user-time-${nextId()}`,
      role: 'user',
      text: slot.label,
    };
    setMessages((prev) => [...prev, userMsg]);
    setStepData((prev) => ({ ...prev, time: slot.start.split('T')[1]?.split(':').slice(0, 2).join(':') || '09:00' }));
    setLoading(true);
    setStep('collect_info');

    const botMsg: ChatMessage = {
      id: `bot-info-${nextId()}`,
      role: 'bot',
      text: locale === 'es'
        ? '¡Excelente elección! Para confirmar, por favor ingresa tu nombre y correo electrónico.\n\nEjemplo: "Me llamo Juan Pérez, mi correo es juan@ejemplo.com"'
        : 'Great choice! To confirm, please enter your name and email.\n\nExample: "My name is John Doe, my email is john@example.com"',
    };
    setMessages((prev) => [...prev, botMsg]);
    setLoading(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const today = new Date().toISOString().split('T')[0];

  if (!open) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="fixed right-0 z-50 flex w-[400px] max-w-full flex-col border-l border-white/10 bg-surface shadow-2xl shadow-primary/10"
        style={{ top: 80, bottom: 0 }}
      >
        <div className="corporate-gradient flex shrink-0 items-center gap-3 px-5 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
            <MaterialIcon name="smart_toy" className="text-lg text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="truncate text-sm font-semibold text-white">{t('title')}</h3>
            <p className="truncate text-xs text-white/70">{t('subtitle')}</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <MaterialIcon name="close" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          <div className="flex flex-col gap-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'bot' && (
                  <div className="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-container/20">
                    <MaterialIcon name="smart_toy" className="text-sm text-primary" />
                  </div>
                )}
                <div className="max-w-[85%]">
                      <div className={`rounded-2xl px-5 py-3 text-base leading-relaxed ${msg.role === 'user' ? 'corporate-gradient rounded-tr-sm text-white' : 'rounded-tl-sm bg-surface-container-high text-on-surface'}`}>
                    {msg.text.split('\n').map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < msg.text.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </div>

                  {msg.type === 'timeSlots' && msg.timeSlots && msg.timeSlots.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {msg.timeSlots.map((slot) => (
                        <button
                          key={slot.label}
                          onClick={() => selectTimeSlot(slot)}
                          disabled={loading}
                          className="rounded-lg border border-secondary/30 bg-secondary/10 px-3 py-1.5 text-xs font-medium text-secondary transition-all hover:bg-secondary/20 active:scale-95 disabled:opacity-50"
                        >
                          {slot.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {msg.type === 'timeSlots' && msg.timeSlots?.length === 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-on-surface-variant">
                        {locale === 'es'
                          ? 'No hay horarios disponibles para esta fecha. Por favor selecciona otra.'
                          : 'No available slots for this date. Please select another.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-container/20">
                  <MaterialIcon name="smart_toy" className="text-sm text-primary" />
                </div>
                <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm bg-surface-container-high px-5 py-4">
                  <span className="h-3 w-3 animate-bounce rounded-full bg-on-surface/40" style={{ animationDelay: '0ms' }} />
                  <span className="h-3 w-3 animate-bounce rounded-full bg-on-surface/40" style={{ animationDelay: '150ms' }} />
                  <span className="h-3 w-3 animate-bounce rounded-full bg-on-surface/40" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="border-t border-white/5 px-4 py-3 shrink-0">
          {step === 'collect_date' ? (
            <div className="flex gap-2">
              <input
                type="date"
                value={selectedDate}
                min={today}
                onChange={handleDateSelect}
                className="flex-1 rounded-xl border border-white/10 bg-surface-container-high px-4 py-2.5 text-sm text-on-surface outline-none transition-colors focus:border-secondary/50"
              />
              <button
                onClick={confirmDate}
                disabled={!selectedDate || loading}
                className="corporate-gradient rounded-xl px-4 py-2.5 text-sm font-medium text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
              >
                <MaterialIcon name="check" className="text-lg" />
              </button>
            </div>
          ) : step === 'confirmed' ? (
            <button
              onClick={onClose}
              className="corporate-gradient w-full rounded-xl py-3 text-sm font-medium text-white transition-all hover:scale-[1.02] active:scale-98"
            >
              {locale === 'es' ? 'Cerrar' : 'Close'}
            </button>
          ) : (
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('placeholder')}
                disabled={loading}
                className="flex-1 rounded-xl border border-white/10 bg-surface-container-high px-4 py-2.5 text-sm text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/50 focus:border-secondary/50 disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="corporate-gradient flex items-center justify-center rounded-xl px-4 text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
              >
                <MaterialIcon name="send" className="text-lg" />
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
