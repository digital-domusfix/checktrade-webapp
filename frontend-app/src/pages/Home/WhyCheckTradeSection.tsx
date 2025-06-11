import { ShieldCheck, Home, DollarSign, Smile } from 'lucide-react';
import { Button } from '../../components/Button';
import { SectionWrapper } from '../../components/SectionWrapper';

const benefits = [
  {
    icon: ShieldCheck,
    title: 'Verified Professionals',
    description: 'Only licensed and background-checked contractors get listed.',
  },
  {
    icon: Home,
    title: 'Built for Nova Scotia',
    description: 'We understand your homes, climate, and community needs.',
  },
  {
    icon: DollarSign,
    title: 'No Hidden Fees',
    description: 'You connect directly. No surprise markups or platform cuts.',
  },
  {
    icon: Smile,
    title: 'Real Human Support',
    description: 'Need help? Our friendly team is a message away.',
  },
];

const WhyCheckTradeSection = () => (
  <SectionWrapper
    id="why-us"
    className="bg-white"
    title="Why 3,000+ Homeowners Trust CheckTrade"
  >
    <p className="text-center max-w-2xl mx-auto text-gray-600 mb-10">
      CheckTrade was built for Atlantic Canada from the ground up — with transparency, trust, and simplicity at its core. Here’s what makes us different:
    </p>

    <div className="grid sm:grid-cols-2 gap-8">
      {benefits.map(({ icon: Icon, title, description }, i) => (
        <div
          key={i}
          className="flex gap-4 items-start bg-cream-muted p-5 rounded-lg border border-green-muted shadow-sm hover:shadow-md transition"
        >
          <div className="p-2 bg-green-muted rounded-full">
            <Icon className="w-6 h-6 text-green-accent" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-800">{title}</h4>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
        </div>
      ))}
    </div>

    <div className="mt-10 text-center">
      <Button variant="primary" className="text-sm">
        Post a Job — It’s Free
      </Button>
    </div>
  </SectionWrapper>
);

export default WhyCheckTradeSection;
