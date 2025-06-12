import React from 'react';
import { useModal } from '../../components/ModalManager';
import HeroSection from './HeroSection';
import HowItWorksSection from './HowItWorksSection';
import CategoriesSection from './CategoriesSection';
import LocationsGrid from './LocationsGrid';
import TestimonialsSection from './TestimonialsSection';
import WhyCheckTradeSection from './WhyCheckTradeSection';
import ContractorHighlights from './ContractorHighlights';
import StickyFooterCTA from './StickyFooterCTA';

// Consolidated HomePage
const HomePage: React.FC = () => {
  const { openWizard } = useModal();

  return (
    <main className="flex flex-col items-center bg-base text-primary">
      {/* Hero: dual CTA for homeowners and pros */}
      <HeroSection
        onPostJob={() => openWizard('quickWizard')}
        onJoinPro={() => openWizard('contractorWizard')}
      />

      {/* How It Works: simplified three-step process */}
      <div className="w-full max-w-7xl px-4 py-16 space-y-20">
        <HowItWorksSection onGetStartedClick={() => openWizard('quickWizard')} />

        {/* Service Categories */}
        <CategoriesSection />

        {/* Trusted Locations */}
        <LocationsGrid />

        {/* Homeowner Testimonials */}
        <TestimonialsSection />

        {/* Why Choose Us */}
        <WhyCheckTradeSection />

        {/* Contractor Highlights for pros */}
        <ContractorHighlights />
      </div>

      {/* Sticky CTA on mobile */}
      <StickyFooterCTA onClick={() => openWizard('quickWizard')} />
    </main>
  );
};

export default HomePage;
