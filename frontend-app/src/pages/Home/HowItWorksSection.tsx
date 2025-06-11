import { CheckCircleIcon } from 'lucide-react';
import { SectionWrapper } from '../../components/SectionWrapper';

interface Props {
  onGetStartedClick?: () => void;
}

const steps = [
  { title: 'Tell us what you need', description: 'Quick form — no account required.' },
  { title: 'Get local quotes', description: 'From trusted, verified contractors.' },
  { title: 'Hire with confidence', description: 'Chat, compare, and confirm easily.' },
];

const HowItWorksSection: React.FC<Props> = ({ onGetStartedClick }) => (
  <SectionWrapper id="how-it-works" title="How It Works" className="bg-cream-muted">
    <div className="grid gap-8 sm:grid-cols-3 pt-4">
      {steps.map((step, i) => (
        <div
          key={i}
          className="text-center bg-white rounded-xl p-6 shadow-md transition hover:shadow-lg"
        >
          <div className="flex justify-center mb-4">
            <CheckCircleIcon className="w-10 h-10 text-green-accent" />
          </div>
          <h4 className="font-semibold text-xl text-gray-800 mb-1">{step.title}</h4>
          <p className="text-gray-600 text-sm">{step.description}</p>
        </div>
      ))}
    </div>

    {onGetStartedClick && (
      <div className="text-center mt-10">
        <button
          onClick={onGetStartedClick}
          className="bg-green-accent hover:bg-green-accent-dark text-white px-6 py-3 rounded-full font-semibold text-lg"
        >
          Get Started
        </button>
      </div>
    )}
  </SectionWrapper>
);

export default HowItWorksSection;
