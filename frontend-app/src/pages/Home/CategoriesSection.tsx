import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HomeIcon } from 'lucide-react';
import { SectionWrapper } from '../../components/SectionWrapper';
import { useModal } from '../../components/ModalManager';
import jobService, { JobCategory } from '../../services/jobService';

const CategoriesSection = () => {
  const { openWizard } = useModal();
  const [categories, setCategories] = useState<JobCategory[]>([]);

  useEffect(() => {
    jobService
      .getJobCategories()
      .then((res) => setCategories(res.data))
      .catch((err) => console.error('Failed to load categories', err));
  }, []);

  return (
    <SectionWrapper
      id="categories"
      title="What do you need done today?"
      className="bg-white"
    >
      <p className="mb-6 text-center text-gray-600">
        Choose a service to get started with fast, free quotes.
      </p>
      <div className="grid grid-cols-2 gap-5 text-center sm:grid-cols-3 md:grid-cols-5">
        {categories.map(({ id, name }) => (
          <motion.div
            key={id}
            whileHover={{ scale: 1.05 }}
            className="cursor-pointer rounded-xl bg-base p-5 transition hover:shadow-lg"
            onClick={() => openWizard('hero')}
          >
            <HomeIcon className="mx-auto mb-2 size-8 text-primary" />
            <p className="font-semibold text-gray-800">{name}</p>
          </motion.div>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default CategoriesSection;
