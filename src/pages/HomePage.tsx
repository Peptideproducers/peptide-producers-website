import HeroSection from '../sections/HeroSection';
import MadeInUSASection from '../sections/MadeInUSASection';
import ProductGridSection from '../sections/ProductGridSection';
import LabQualitySection from '../sections/LabQualitySection';
import COASection from '../sections/COASection';
import HowItWorksSection from '../sections/HowItWorksSection';
import SupportSection from '../sections/SupportSection';
import FAQSection from '../sections/FAQSection';
import FinalCTASection from '../sections/FinalCTASection';
import FooterSection from '../sections/FooterSection';

export default function HomePage() {
  return (
    <main className="relative">
      <HeroSection />
      <MadeInUSASection />
      <ProductGridSection />
      <LabQualitySection />
      <COASection />
      <HowItWorksSection />
      <SupportSection />
      <FAQSection />
      <FinalCTASection />
      <FooterSection />
    </main>
  );
}
