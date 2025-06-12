import { SectionWrapper } from '../../components/SectionWrapper';
import { motion } from 'framer-motion';
import { ClipboardCheck, Users, MessageSquareHeart } from 'lucide-react';

interface Props {
  onGetStartedClick?: () => void;
}

const steps = [
  {
    title: '1. Tell us what you need',
    description: 'Post a quick job — no sign-up required.',
    icon: ClipboardCheck,
  },
  {
    title: '2. See local pros respond',
    description: 'Verified contractors reach out with quotes.',
    icon: Users,
  },
  {
    title: '3. Chat & hire when ready',
    description: 'Compare, message, and book confidently.',
    icon: MessageSquareHeart,
  },
];

const HowItWorksSection: React.FC<Props> = ({ onGetStartedClick }) => (
  <SectionWrapper id="how-it-works" title="How It Works" className="bg-base">
    <motion.div
      className="grid gap-6 pt-6 sm:grid-cols-3"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.2 },
        },
      }}
    >
      {steps.map(({ icon: Icon, title, description }, i) => (
        <motion.div
          key={i}
          className="rounded-xl bg-white p-6 text-center shadow-md transition hover:shadow-xl"
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <div className="mb-4 flex justify-center">
            <Icon className="size-10 text-primary" />
          </div>
          <h4 className="mb-1 text-xl font-semibold text-gray-900">{title}</h4>
          <p className="text-sm text-gray-600">{description}</p>
        </motion.div>
      ))}
    </motion.div>

    {onGetStartedClick && (
      <div className="mt-10 text-center">
        <button
          onClick={onGetStartedClick}
          className="rounded-full bg-primary px-6 py-3 text-lg font-semibold text-white shadow-md hover:bg-primary-hover"
        >
          Get Free Quotes
        </button>
        <p className="mt-2 text-sm text-gray-500">It only takes 30 seconds</p>
      </div>
    )}
  </SectionWrapper>
);

export default HowItWorksSection;
