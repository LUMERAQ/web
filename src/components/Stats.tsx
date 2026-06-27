'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

function AnimatedCounter({ value, type, color }: { value: string; type: 'number' | 'percent' | 'hours'; color: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) setHasAnimated(true);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  const num = parseInt(value.replace(/[^0-9.]/g, ''));
  const prefix = value.replace(/[0-9.]/g, '');
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!hasAnimated) return;
    const duration = 2000;
    const steps = 60;
    const target = type === 'percent' ? num : num;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [hasAnimated, num, type]);

  const displayValue = () => {
    if (!hasAnimated) return value;
    if (type === 'percent') return `${prefix}${count.toFixed(1)}%`;
    if (type === 'hours') return `${prefix}${count}/7`;
    return `${prefix}${count}`;
  };

  return (
    <div ref={ref} className={`text-4xl font-bold transition-transform duration-300 group-hover:scale-110 md:text-5xl ${color}`}>
      {displayValue()}
    </div>
  );
}

export default function Stats() {
  const t = useTranslations('stats');
  const statsData = t.raw('items') as Array<{ value: string; label: string; type: string }>;

  return (
    <section className="bg-surface-container-lowest py-20">
      <div className="mx-auto max-w-container-max px-gutter">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {statsData.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group space-y-2 text-center"
            >
              <AnimatedCounter value={stat.value} type={stat.type as 'number' | 'percent' | 'hours'} color={i % 2 === 0 ? 'text-secondary' : 'text-primary'} />
              <div className="font-label-sm text-label-sm uppercase tracking-tighter text-on-surface-variant">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
