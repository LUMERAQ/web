import { getLocale } from 'next-intl/server';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import CoreFocus from '@/components/CoreFocus';
import SuccessCases from '@/components/SuccessCases';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';

export default async function HomePage() {
  const locale = await getLocale();

  return (
    <main>
      <JsonLd locale={locale} />
      <Navbar />
      <Hero />
      <Stats />
      <CoreFocus />
      <SuccessCases />
      <CTA />
      <Footer />
    </main>
  );
}
