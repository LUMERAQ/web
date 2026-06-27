import { routing } from '../../i18n/routing';
import { siteConfig } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap() {
  const siteUrl = `${siteConfig.url}${siteConfig.basePath}`;
  const urls = [];

  for (const locale of routing.locales) {
    const prefix = locale === siteConfig.defaultLocale ? '' : `/${locale}`;
    urls.push({
      url: `${siteUrl}${prefix}/`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 1.0,
    });
  }

  return urls;
}
