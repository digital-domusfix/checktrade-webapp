import { CheckCircleIcon } from 'lucide-react';
import { SectionWrapper } from '../../components/SectionWrapper';
import { useEffect, useState } from 'react';

interface Props {
  onGetStartedClick?: () => void;
}

const steps = [
  { title: 'Tell us what you need', description: 'Quick form — no account required.' },
  { title: 'Get local quotes', description: 'From trusted, verified contractors.' },
  { title: 'Hire with confidence', description: 'Chat, compare, and confirm easily.' },
];

const HowItWorksSection: React.FC<Props> = ({ onGetStartedClick }) => {
  const [motionDiv, setMotionDiv] = useState<React.ComponentType<any> | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(query.matches);
    import('framer-motion').then((mod) => {
      setMotionDiv(() => mod.motion.div);
    });
  }, []);

  const Container = motionDiv || 'div';
  const Item = motionDiv || 'div';

  const containerProps = reduceMotion
    ? {}
    : {
        initial: 'hidden',
        whileInView: 'visible',
        viewport: { once: true },
        variants: {
          hidden: {},
          visible: { transition: { staggerChildren: 0.2 } },
        },
      };

  const itemVariants = reduceMotion
    ? undefined
    : {
        hidden: { x: -20, opacity: 0 },
        visible: { x: 0, opacity: 1 },
      };

  const hoverProps = reduceMotion ? {} : { whileHover: { scale: 1.03 } };

  return (
    <SectionWrapper id="how-it-works" title="How It Works" className="bg-base">
      <Container className="grid gap-8 sm:grid-cols-3 pt-4" {...containerProps}>
        {steps.map((step, i) => (
          <Item
            key={i}
            className="text-center bg-white rounded-xl p-6 shadow-md transition hover:shadow-lg"
            variants={itemVariants}
            {...hoverProps}
          >
            <div className="flex justify-center mb-4">
              <CheckCircleIcon className="w-10 h-10 text-primary" />
            </div>
            <h4 className="font-semibold text-xl text-gray-800 mb-1">{step.title}</h4>
            <p className="text-gray-600 text-sm">{step.description}</p>
          </Item>
        ))}
      </Container>

      {onGetStartedClick && (
        <div className="text-center mt-10">
          <button
            onClick={onGetStartedClick}
            className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-full font-semibold text-lg"
          >
            Get Started
          </button>
        </div>
      )}
    </SectionWrapper>
  );
};

export default HowItWorksSection;
