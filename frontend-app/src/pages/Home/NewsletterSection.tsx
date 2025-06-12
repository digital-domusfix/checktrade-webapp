import React from 'react';
import { SectionWrapper } from '../../components/SectionWrapper';

interface NewsletterSectionProps {
  onGetStartedClick?: () => void;
}

const NewsletterSection: React.FC<NewsletterSectionProps> = ({
  onGetStartedClick,
}) => (
  <SectionWrapper id="newsletter" title="Ready to Get Started?">
    {onGetStartedClick ? (
      <div className="mt-4 text-center">
        <button
          onClick={onGetStartedClick}
          className="rounded-full bg-primary px-6 py-3 text-lg font-semibold text-white hover:bg-primary-hover"
        >
          Create Your Free Account
        </button>
      </div>
    ) : (
      <form className="mx-auto mt-4 flex max-w-xl flex-col gap-4 sm:flex-row">
        <input
          type="email"
          required
          className="flex-1 rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter your email"
        />
        <button
          type="submit"
          className="rounded bg-primary px-4 py-2 text-white hover:bg-primary-hover"
        >
          Subscribe
        </button>
      </form>
    )}
  </SectionWrapper>
);

export default NewsletterSection;
