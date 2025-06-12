import React from 'react';
import HeroSection from './HeroSection';
import HowItWorksSection from './HowItWorksSection';
import CategoriesSection from './CategoriesSection';
import TestimonialsSection from './TestimonialsSection';
import ContractorHighlights from './ContractorHighlights';
import WhyCheckTradeSection from './WhyCheckTradeSection';
import LocationsGrid from './LocationsGrid';
import NewsletterSection from './NewsletterSection';
import StickyFooterCTA from './StickyFooterCTA';
import { useModal } from '../../components/ModalManager';

const HomePage: React.FC = () => {
  const { openWizard } = useModal();

  return (
    <main>
      <HeroSection />
      <HowItWorksSection onGetStartedClick={() => openWizard('howItWorks')} />
      <CategoriesSection />
      <LocationsGrid />
      <TestimonialsSection />
      <ContractorHighlights />
      <WhyCheckTradeSection />
      <NewsletterSection onGetStartedClick={() => openWizard('footer')} />
      <StickyFooterCTA onClick={() => openWizard('footer')} />
    </main>
  );
};

export default HomePage;
