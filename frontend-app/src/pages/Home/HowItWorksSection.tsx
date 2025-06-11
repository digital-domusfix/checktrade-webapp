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
      className="grid gap-6 sm:grid-cols-3 pt-6"
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
          className="bg-white text-center p-6 rounded-xl shadow-md hover:shadow-xl transition"
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <div className="flex justify-center mb-4">
            <Icon className="h-10 w-10 text-primary" />
          </div>
          <h4 className="font-semibold text-xl text-gray-900 mb-1">{title}</h4>
          <p className="text-gray-600 text-sm">{description}</p>
        </motion.div>
      ))}
    </motion.div>

    {onGetStartedClick && (
      <div className="text-center mt-10">
        <button
          onClick={onGetStartedClick}
          className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-full font-semibold text-lg shadow-md"
        >
          Get Free Quotes
        </button>
        <p className="text-sm text-gray-500 mt-2">It only takes 30 seconds</p>
      </div>
    )}
  </SectionWrapper>
);

export default HowItWorksSection;
