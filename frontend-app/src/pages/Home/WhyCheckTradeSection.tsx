import { SectionWrapper } from '../../components/SectionWrapper';
import { Button } from '../../components/Button';
import { ShieldCheck, Home, DollarSign, Smile } from 'lucide-react';

import { motion } from 'framer-motion';

const benefits = [
  {
    icon: ShieldCheck,
    title: 'Verified Pros Only',
    description:
      'No amateurs. Only vetted, licensed, and insured contractors make the cut.',
  },
  {
    icon: Home,
    title: 'Built for Nova Scotia',
    description:
      'We know the climate, codes, and quirks of Atlantic Canadian homes.',
  },
  {
    icon: DollarSign,
    title: 'Fair & Direct Pricing',
    description:
      'No platform fees or middlemen. You deal direct, with full transparency.',
  },
  {
    icon: Smile,
    title: 'Real Human Help',
    description:
      'Stuck or confused? Our local support team is a call away — no bots.',
  },
];

const WhyCheckTradeSection = () => (
  <SectionWrapper
    id="why-us"
    title="Why Homeowners Trust CheckTrade"
    className="bg-white"
  >
    <p className="mx-auto mb-10 max-w-2xl text-center text-gray-600">
      We’re more than just a job board — we’re your partner for stress-free home
      projects. Here’s what makes CheckTrade the trusted choice in Nova Scotia:
    </p>

    <div className="grid gap-8 sm:grid-cols-2">
      {benefits.map(({ icon: Icon, title, description }, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15 }}
          className="flex items-start gap-4 rounded-xl bg-base p-6 shadow-sm transition hover:shadow-md"
        >
          <Icon className="size-6 text-primary" />
          <div>
            <h4 className="text-lg font-semibold text-gray-800">{title}</h4>
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          </div>
        </motion.div>
      ))}
    </div>

    <div className="mt-10 text-center">
      <Button variant="primary" className="text-sm">
        Post a Job — It’s Free
      </Button>
      <p className="mt-2 text-xs text-gray-500">
        No cost. No obligation. Just trusted help.
      </p>
    </div>
  </SectionWrapper>
);

export default WhyCheckTradeSection;
