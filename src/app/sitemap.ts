import { routing } from '../../i18n/routing';
import { siteConfig } from '@/lib/site';

export const dynamic = 'force-static';

function toDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function sitemap() {
  const siteUrl = `${siteConfig.url}${siteConfig.basePath}`;
  const urls = [];

  for (const locale of routing.locales) {
    const prefix = locale === siteConfig.defaultLocale ? '' : `/${locale}`;
    urls.push({
      url: `${siteUrl}${prefix}/`,
      lastModified: toDateString(),
      changeFrequency: 'weekly' as const,
      priority: 1.0 as const,
    });
  }

  return urls;
}
