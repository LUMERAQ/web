'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
  Code2, Globe, Layout, Boxes, Container, Brain,
  MessageSquare, Bell, Shield, ShoppingCart, RefreshCw,
  LineChart, Headphones
} from 'lucide-react';

const iconMap: Record<number, React.ElementType> = {
  0: Code2, 1: Globe, 2: Layout, 3: Boxes, 4: Container,
  5: Brain, 6: MessageSquare, 7: Bell, 8: Shield,
  9: ShoppingCart, 10: RefreshCw, 11: LineChart, 12: Headphones,
};

export default function Services() {
  const t = useTranslations('services');
  const items = t.raw('items') as Array<{ title: string; description: string }>;

  return (
    <section id="servicios" className="section-padding">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">{t('title')}</h2>
          <p className="mt-4 text-lg text-lumeraq-gray">{t('subtitle')}</p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item, i) => {
            const Icon = iconMap[i] || Code2;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="glass-card group rounded-2xl p-6"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-brand/10">
                  <Icon className="h-6 w-6 text-lumeraq-blue" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                <p className="text-sm leading-relaxed text-lumeraq-gray">
                  {item.description}
                </p>
                <a
                  href="#contacto"
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-lumeraq-blue transition-colors hover:text-lumeraq-cyan"
                >
                  {t('learnMore')} &rarr;
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
