import { SectionWrapper } from '../../components/SectionWrapper';
import {
  WrenchIcon,
  PlugIcon,
  FlameIcon,
  HomeIcon,
  SunIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useModal } from '../../components/ModalManager';

const categories = [
  {
    name: 'Plumbing',
    icon: WrenchIcon,
    topTask: 'Fix leaks & install fixtures',
  },
  {
    name: 'Electrical',
    icon: PlugIcon,
    topTask: 'Lighting, sockets & safety',
  },
  {
    name: 'HVAC',
    icon: FlameIcon,
    topTask: 'Heating, cooling, maintenance',
  },
  {
    name: 'Renovation',
    icon: HomeIcon,
    topTask: 'Kitchen, bath & basement renos',
  },
  {
    name: 'Solar',
    icon: SunIcon,
    topTask: 'Panels & energy consultation',
  },
];

const CategoriesSection = () => {
  const { openWizard } = useModal();

  return (
    <SectionWrapper id="categories" title="What do you need done today?" className="bg-white">
      <p className="text-center text-gray-600 mb-6">
        Choose a service to get started with fast, free quotes.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5 text-center">
        {categories.map(({ name, icon: Icon, topTask }) => (
          <motion.div
            key={name}
            whileHover={{ scale: 1.05 }}
            className="bg-base rounded-xl p-5 cursor-pointer hover:shadow-lg transition"
            onClick={() => openWizard('category', { prefill: { category: name } })}
          >
            <Icon className="mx-auto h-8 w-8 text-primary mb-2" />
            <p className="font-semibold text-gray-800">{name}</p>
            <p className="text-xs text-gray-500 mt-1">{topTask}</p>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default CategoriesSection;
