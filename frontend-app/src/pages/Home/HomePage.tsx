import React, { useState } from 'react';
import HeroSection from './HeroSection';
import HowItWorksSection from './HowItWorksSection';
import CategoriesSection from './CategoriesSection';
import TestimonialsSection from './TestimonialsSection';
import ContractorHighlights from './ContractorHighlights';
import WhyCheckTradeSection from './WhyCheckTradeSection';
import LocationsGrid from './LocationsGrid';
import NewsletterSection from './NewsletterSection';
import StickyFooterCTA from './StickyFooterCTA';

const HomePage: React.FC = () => {
  const [showWizard, setShowWizard] = useState(false);

  const toggleWizard = () => setShowWizard((s) => !s);

  return (
    <main>
      <HeroSection showWizard={showWizard} onToggleWizard={toggleWizard} />
      <HowItWorksSection onGetStartedClick={toggleWizard} />
      <CategoriesSection />
      <LocationsGrid />
      <TestimonialsSection />
      <ContractorHighlights />
      <WhyCheckTradeSection />
      <NewsletterSection onGetStartedClick={toggleWizard} />
      <StickyFooterCTA onClick={toggleWizard} />
    </main>
  );
};

export default HomePage;
