'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import MaterialIcon from './MaterialIcon';

export default function CTA() {
  const t = useTranslations('cta');

  return (
    <section className="relative overflow-hidden py-24">
      <div className="corporate-gradient absolute inset-0 opacity-10" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mx-auto max-w-4xl px-gutter text-center"
      >
        <div className="mb-8 inline-block animate-bounce rounded-full border border-secondary/20 bg-secondary/10 p-4">
          <MaterialIcon name="rocket_launch" fill className="text-4xl text-secondary" />
        </div>
        <h2 className="font-hero-display text-hero-display-mobile mb-6 text-white md:text-headline-lg">
          {t('title')}
        </h2>
        <p className="text-body-lg mb-12 text-on-surface-variant">
          {t('subtitle')}
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <a
            href="#contacto"
            className="corporate-gradient inline-block scale-105 rounded-xl px-10 py-5 text-lg font-button-text text-button-text text-white shadow-xl transition-all hover:shadow-primary/30 active:scale-95"
          >
            {t('buttonPrimary')}
          </a>
          <a
            href="#servicios"
            className="inline-block rounded-xl border border-white/20 px-10 py-5 text-lg font-button-text text-button-text text-white transition-all hover:bg-white/5"
          >
            {t('buttonSecondary')}
          </a>
        </div>
      </motion.div>
    </section>
  );
}
