'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import MaterialIcon from './MaterialIcon';

export default function SuccessCases() {
  const t = useTranslations('successCases');
  const cases = t.raw('cases') as Array<{
    industry: string;
    title: string;
    problem: string;
    solution: string;
    result: string;
  }>;

  return (
    <section id="casos" className="bg-surface-container-low py-24">
      <div className="mx-auto max-w-container-max px-gutter">
        <div className="mb-16 flex flex-col items-end justify-between gap-6 md:flex-row">
          <div className="max-w-2xl">
            <h2 className="font-headline-lg text-headline-lg mb-4 text-white">{t('title')}</h2>
            <p className="text-on-surface-variant">{t('subtitle')}</p>
          </div>
          <button className="rounded-lg border border-secondary/50 px-6 py-3 font-button-text text-button-text text-secondary transition-colors hover:bg-secondary/10">
            {t('viewAll')}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {cases.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card group flex h-full flex-col overflow-hidden rounded-2xl"
            >
              <div className="relative h-48 overflow-hidden">
                <div className="flex h-full w-full items-center justify-center bg-surface-container-high p-8">
                  <div className="grid grid-cols-2 gap-4 w-full">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="rounded-lg bg-white/5 p-3 h-12 flex items-center justify-center">
                        <div className="h-2 w-3/4 rounded-full bg-white/10" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute left-4 top-4 rounded bg-surface/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-secondary backdrop-blur-md">
                  {item.industry}
                </div>
              </div>
              <div className="flex flex-grow flex-col p-8">
                <h3 className="mb-4 text-xl font-bold text-white">{item.title}</h3>
                <div className="mb-8 space-y-4 text-sm">
                  <div>
                    <span className="block text-[10px] font-semibold uppercase text-secondary">
                      {t('problemLabel')}
                    </span>
                    <p className="text-on-surface-variant">{item.problem}</p>
                  </div>
                  <div>
                    <span className="block text-[10px] font-semibold uppercase text-secondary">
                      {t('solutionLabel')}
                    </span>
                    <p className="text-on-surface-variant">{item.solution}</p>
                  </div>
                  <div className="border-t border-white/5 pt-4">
                    <span className="font-bold text-white">{t('resultLabel')}</span>
                    <p className="text-white">{item.result}</p>
                  </div>
                </div>
                <button className="mt-auto flex w-full items-center justify-center gap-2 rounded-lg bg-surface-container-high py-3 font-button-text text-button-text text-white transition-all hover:bg-secondary hover:text-surface">
                  {t('viewCase')} <MaterialIcon name="open_in_new" className="text-sm" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
