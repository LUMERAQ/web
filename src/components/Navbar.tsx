'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import MaterialIcon from './MaterialIcon';

const navLinks = [
  { key: 'services', href: '#servicios' },
  { key: 'solutions', href: '#soluciones' },
  { key: 'about', href: '#nosotros' },
  { key: 'technology', href: '#tecnologia' },
  { key: 'cases', href: '#casos' },
  { key: 'contact', href: '#contacto' },
];

export default function Navbar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const otherLocale = locale === 'es' ? 'en' : 'es';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 z-50 w-full border-b border-white/5 backdrop-blur-md transition-all duration-300 ${
        scrolled
          ? 'bg-surface/80 shadow-lg shadow-primary/5'
          : 'bg-surface/80'
      }`}
    >
      <div className="mx-auto flex h-20 max-w-container-max items-center justify-between px-gutter">
        <Link href="/" className="flex items-center gap-2 font-headline-lg text-headline-lg font-bold tracking-tighter text-on-surface">
          <img src="/icon/icono-removebg-preview.png" alt="Lumeraq Logo" className="h-8 w-auto" />
          LUMERAQ
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.key}
              href={link.href}
              className="font-button-text text-button-text text-on-surface/80 transition-all duration-300 hover:text-secondary"
            >
              {t(link.key)}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link
            href={`/${otherLocale}`}
            className="text-on-surface/80 cursor-pointer transition-colors hover:text-secondary"
            aria-label="Switch language"
          >
            <MaterialIcon name="language" />
          </Link>
          <a
            href="#contacto"
            className="hidden rounded-lg corporate-gradient px-6 py-2 font-button-text text-button-text text-white transition-transform hover:scale-105 active:scale-95 lg:block"
          >
            {t('cta')}
          </a>
          <button
            className="text-on-surface md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <MaterialIcon name={mobileOpen ? 'close' : 'menu'} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/5 bg-surface/95 backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-4 px-gutter py-6">
            {navLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="font-button-text text-button-text text-on-surface/80 transition-colors hover:text-secondary"
              >
                {t(link.key)}
              </a>
            ))}
            <div className="flex items-center gap-4 pt-4 border-t border-white/10">
              <Link href={`/${otherLocale}`} className="text-sm text-on-surface-variant">
                {otherLocale.toUpperCase()}
              </Link>
              <a
                href="#contacto"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg corporate-gradient px-6 py-2.5 font-button-text text-button-text text-white"
              >
                {t('cta')}
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
