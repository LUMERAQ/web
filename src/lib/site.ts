export const siteConfig = {
  name: 'LUMERAQ',
  tagline: 'Tecnología que transforma negocios',
  url: 'https://lumeraq.com',
  defaultLocale: 'es' as const,
  locales: ['es', 'en'] as const,
  social: {
    twitter: '@lumeraq',
  },
  author: 'LUMERAQ',
};

export type Locale = (typeof siteConfig.locales)[number];
