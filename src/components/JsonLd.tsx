import { siteConfig } from '@/lib/site';

export default function JsonLd({ locale }: { locale: string }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.tagline,
    foundingDate: '2024',
    knowsAbout: [
      'Desarrollo de software empresarial',
      'Inteligencia Artificial',
      'Arquitectura de microservicios',
      'DevOps',
      'Transformación Digital',
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'MX',
    },
    sameAs: [
      'https://twitter.com/lumeraq',
      'https://linkedin.com/company/lumeraq',
    ],
    alternateName: locale === 'es' ? undefined : 'LUMERAQ Technology',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
