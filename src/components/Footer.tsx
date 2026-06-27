'use client';

import { useTranslations } from 'next-intl';
import MaterialIcon from './MaterialIcon';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="border-t border-white/10 bg-surface-container-lowest">
      <div className="mx-auto grid max-w-container-max grid-cols-1 gap-unit-lg px-gutter py-unit-xl md:grid-cols-4">
        <div className="space-y-6">
          <div className="font-subtitle-xl font-bold text-on-surface">LUMERAQ</div>
          <p className="font-body-md text-body-md text-on-surface-variant">{t('description')}</p>
          <div className="flex gap-4">
            <MaterialIcon name="public" className="cursor-pointer text-secondary transition-colors hover:text-primary" />
            <MaterialIcon name="hub" className="cursor-pointer text-secondary transition-colors hover:text-primary" />
            <MaterialIcon name="terminal" className="cursor-pointer text-secondary transition-colors hover:text-primary" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="font-bold text-white">{t('company')}</div>
          <ul className="space-y-2">
            {t.raw('companyLinks').map((link: string) => (
              <li key={link}>
                <a href="#" className="font-label-sm text-label-sm text-on-surface-variant transition-colors hover:text-primary">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <div className="font-bold text-white">{t('legal')}</div>
          <ul className="space-y-2">
            {t.raw('legalLinks').map((link: string) => (
              <li key={link}>
                <a href="#" className="font-label-sm text-label-sm text-on-surface-variant transition-colors hover:text-primary">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <div className="font-bold text-white">{t('newsletter')}</div>
          <p className="text-xs text-on-surface-variant">{t('newsletterDesc')}</p>
          <div className="flex">
            <input
              type="email"
              placeholder={t('emailPlaceholder')}
              className="w-full rounded-l-lg border border-white/10 bg-surface px-4 py-2 focus:border-secondary focus:outline-none"
            />
            <button className="rounded-r-lg bg-secondary p-2 text-surface" aria-label="Subscribe">
              <MaterialIcon name="send" />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-container-max border-t border-white/5 px-gutter py-8 text-center md:text-left">
        <p className="font-label-sm text-label-sm text-on-surface-variant">
          &copy; 2024 LUMERAQ. {t('rights')}
        </p>
      </div>
    </footer>
  );
}
