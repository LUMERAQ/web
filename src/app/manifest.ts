import { siteConfig } from '@/lib/site';

export const dynamic = 'force-static';

export default function manifest() {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.tagline,
    start_url: '/',
    display: 'standalone',
    background_color: '#0c1322',
    theme_color: '#2563eb',
    icons: [
      { src: '/img/icono-removebg-preview.png', sizes: 'any', type: 'image/png' },
    ],
  };
}
