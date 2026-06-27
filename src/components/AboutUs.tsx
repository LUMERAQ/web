'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Lightbulb, Award, Expand, Shield, Brain, Rocket } from 'lucide-react';

const valueIcons = [Lightbulb, Award, Expand, Shield, Brain, Rocket];

export default function AboutUs() {
  const t = useTranslations('about');
  const values = t.raw('values') as string[];

  return (
    <section id="nosotros" className="section-padding">
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

        <div className="grid gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-lg leading-relaxed text-lumeraq-gray">
              {t('description')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            {values.map((value, i) => {
              const Icon = valueIcons[i] || Lightbulb;
              return (
                <div
                  key={value}
                  className="glass-card flex items-center gap-3 rounded-xl p-4"
                >
                  <Icon className="h-5 w-5 shrink-0 text-lumeraq-blue" />
                  <span className="text-sm font-medium">{value}</span>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
