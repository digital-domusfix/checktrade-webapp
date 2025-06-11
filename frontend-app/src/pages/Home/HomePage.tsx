import React, { useState } from 'react';
import HeroSection from './HeroSection';
import HowItWorksSection from './HowItWorksSection';
import CategoriesSection from './CategoriesSection';
import TestimonialsSection from './TestimonialsSection';
import ContractorHighlights from './ContractorHighlights';
import WhyCheckTradeSection from './WhyCheckTradeSection';
import NewsletterSection from './NewsletterSection';
import { RegisterModal } from '../../components/auth/RegisterModal';
import StickyFooterCTA from './StickyFooterCTA';

const HomePage: React.FC = () => {
  const [showRegister, setShowRegister] = useState(false);

  const handleOpenRegister = () => setShowRegister(true);
  const handleCloseRegister = () => setShowRegister(false);

  return (
    <main>
      <HeroSection  />
      <HowItWorksSection onGetStartedClick={handleOpenRegister} />
      <CategoriesSection />
      <TestimonialsSection />
      <ContractorHighlights />
      <WhyCheckTradeSection />
      <NewsletterSection onGetStartedClick={handleOpenRegister} />
      <RegisterModal open={showRegister} onClose={handleCloseRegister} />
      <StickyFooterCTA onClick={handleOpenRegister} />
    </main>
  );
};

export default HomePage;
