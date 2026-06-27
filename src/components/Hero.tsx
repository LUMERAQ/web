'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function Hero() {
  const t = useTranslations('hero');

  return (
    <header className="relative min-h-[70vh] overflow-hidden">
      <div className="relative mx-auto flex max-w-container-max items-center px-gutter py-28 md:py-40">
        <div className="relative z-10 w-full max-w-2xl space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-6"
          > 
            <h1
              className="text-[40px] font-bold leading-[1.15] tracking-tight text-white md:text-[76px] md:leading-[1.05] md:tracking-[-0.02em]"
              dangerouslySetInnerHTML={{ __html: t.raw('title') }}
            />
            <p className="text-body-md text-on-surface-variant max-w-xl leading-relaxed">
              {t('subtitle')}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-y-0 right-[0%] w-full md:w-[60%]">
        <img
          src="/img/banner.jpg"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-surface via-surface/50 to-transparent" />
      </div>
    </header>
  );
}
