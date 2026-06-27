import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Stats from '@/components/Stats';
import CoreFocus from '@/components/CoreFocus';
import SuccessCases from '@/components/SuccessCases';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <main>
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
