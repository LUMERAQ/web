import { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '../../../i18n/routing';
import { siteConfig } from '@/lib/site';
import SetHtmlLang from './SetHtmlLang';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'hero' });
  const title = `LUMERAQ — ${t('subtitle')}`;
  const description = t('subtitle');
  const siteUrl = `${siteConfig.url}${siteConfig.basePath}`;
  const path = locale === siteConfig.defaultLocale ? '' : `/${locale}`;
  const canonical = `${siteUrl}${path}`;

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical,
      languages: Object.fromEntries(
        routing.locales.map((l) => [
          l,
          l === siteConfig.defaultLocale ? siteUrl : `${siteUrl}/${l}`,
        ])
      ),
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteConfig.name,
      locale: locale === 'es' ? 'es_MX' : 'en_US',
      type: 'website',
      images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.social.twitter,
      title,
      description,
      images: ['/og-image.png'],
    },
    icons: {
      icon: `${siteConfig.basePath}/favicon.ico`,
      apple: `${siteConfig.basePath}/icon/icono-removebg-preview.png`,
    },
  };
}

async function loadMessages(locale: string) {
  try {
    return (await import(`../../../messages/${locale}.json`)).default;
  } catch {
    return (await import(`../../../messages/${routing.defaultLocale}.json`)).default;
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'es' | 'en')) {
    notFound();
  }

  const messages = await loadMessages(locale);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <SetHtmlLang locale={locale} />
      {children}
    </NextIntlClientProvider>
  );
}
