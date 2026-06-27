'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Search, Building2, Code, CheckCircle, Rocket, Headphones } from 'lucide-react';

const iconMap: Record<number, React.ElementType> = {
  0: Search, 1: Building2, 2: Code, 3: CheckCircle, 4: Rocket, 5: Headphones,
};

export default function Methodology() {
  const t = useTranslations('methodology');
  const steps = t.raw('steps') as Array<{ title: string; description: string }>;

  return (
    <section id="metodologia" className="section-padding">
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

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 hidden w-px bg-gradient-to-b from-lumeraq-blue via-lumeraq-cyan to-lumeraq-purple md:block" />

          <div className="flex flex-col gap-12">
            {steps.map((step, i) => {
              const Icon = iconMap[i] || Search;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="relative pl-0 md:pl-20"
                >
                  <div className="absolute left-0 top-0 hidden h-16 w-16 items-center justify-center rounded-full bg-gradient-brand p-0.5 md:flex">
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-[#0A0F1F]">
                      <Icon className="h-6 w-6 text-lumeraq-white" />
                    </div>
                  </div>
                  <div className="glass-card rounded-2xl p-6 md:p-8">
                    <div className="mb-1 text-sm font-semibold text-lumeraq-blue">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <h3 className="mb-2 text-xl font-semibold">{step.title}</h3>
                    <p className="text-lumeraq-gray">{step.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
