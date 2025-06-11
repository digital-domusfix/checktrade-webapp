import React from 'react';
import { SectionWrapper } from '../../components/SectionWrapper';

interface NewsletterSectionProps {
  onGetStartedClick?: () => void;
}

const NewsletterSection: React.FC<NewsletterSectionProps> = ({ onGetStartedClick }) => (
  <SectionWrapper id="newsletter" title="Ready to Get Started?">
    {onGetStartedClick ? (
      <div className="text-center mt-4">
        <button
          onClick={onGetStartedClick}
          className="bg-green-accent hover:bg-green-accent-dark text-white text-lg px-6 py-3 rounded-full font-semibold"
        >
          Create Your Free Account
        </button>
      </div>
    ) : (
      <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto mt-4">
        <input
          type="email"
          required
          className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-accent"
          placeholder="Enter your email"
        />
        <button
          type="submit"
          className="bg-green-accent text-white px-4 py-2 rounded hover:bg-green-accent-dark"
        >
          Subscribe
        </button>
      </form>
    )}
  </SectionWrapper>
);

export default NewsletterSection;
