'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import MaterialIcon from './MaterialIcon';

export default function CoreFocus() {
  const t = useTranslations('coreFocus');
  const items = t.raw('items') as Array<{
    title: string;
    description: string;
    icon: string;
    colSpan: string;
    theme: string;
  }>;

  return (
    <section className="bg-surface py-24">
      <div className="mx-auto max-w-container-max px-gutter">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <h2 className="font-headline-lg text-headline-lg mb-4 text-white">{t('title')}</h2>
          <p className="text-on-surface-variant">{t('subtitle')}</p>
        </motion.div>

        <div className="auto-rows-[240px] grid grid-cols-1 gap-6 md:grid-cols-12">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`glass-card group relative overflow-hidden rounded-2xl p-8 ${item.colSpan} ${
                item.theme === 'center'
                  ? 'flex flex-col items-center justify-center text-center border-primary/10 bg-primary-container/5'
                  : item.theme === 'flex'
                    ? 'flex items-center'
                    : 'flex flex-col justify-end'
              }`}
            >
              {item.theme === 'end' && (
                <div className="absolute right-0 top-0 p-8">
                  <MaterialIcon
                    name={item.icon}
                    className="text-8xl text-secondary opacity-20 transition-opacity group-hover:opacity-100"
                  />
                </div>
              )}
              {item.theme === 'center' && (
                <MaterialIcon
                  name={item.icon}
                  fill
                  className="mb-4 text-8xl text-primary"
                />
              )}
              {item.theme === 'default' && (
                <MaterialIcon
                  name={item.icon}
                  fill
                  className="text-8xl text-secondary opacity-20 transition-opacity group-hover:opacity-100"
                />
              )}
              <div className={item.theme === 'flex' ? 'grid w-full grid-cols-1 items-center gap-8 md:grid-cols-2' : 'z-10'}>
                <div>
                  <h3 className="mb-2 text-2xl font-bold text-white">{item.title}</h3>
                  <p className="max-w-lg text-on-surface-variant">{item.description}</p>
                </div>
                {item.theme === 'flex' && (
                  <div className="hidden justify-end md:flex">
                    <div className="flex h-32 w-32 animate-pulse items-center justify-center rounded-full border-4 border-primary/20">
                      <MaterialIcon name={item.icon} fill className="text-7xl text-primary" />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
