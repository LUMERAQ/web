const repoName = process.env.REPO_NAME || '';
const basePath = repoName ? `/${repoName}` : '';

export const siteConfig = {
  name: 'LUMERAQ',
  tagline: 'Tecnología que transforma negocios',
  url: process.env.SITE_URL || `https://lumeraq.github.io`,
  basePath,
  defaultLocale: 'es' as const,
  locales: ['es', 'en'] as const,
  social: {
    twitter: '@lumeraq',
  },
  author: 'LUMERAQ',
};

export type Locale = (typeof siteConfig.locales)[number];
