import { HomeIcon, PlugIcon, FlameIcon, SunIcon, WrenchIcon } from 'lucide-react';
import { SectionWrapper } from '../../components/SectionWrapper';

const categories = [
  { name: 'Plumbing', icon: WrenchIcon },
  { name: 'Electrical', icon: PlugIcon },
  { name: 'HVAC', icon: FlameIcon },
  { name: 'Renovation', icon: HomeIcon },
  { name: 'Solar', icon: SunIcon },
];

const CategoriesSection = () => (
  <SectionWrapper id="categories" title="Explore Services" className="bg-cream-muted">
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-center">
      {categories.map(({ name, icon: Icon }) => (
        <div key={name} className="bg-white border border-green-muted rounded-lg p-4 hover:shadow">
          <Icon className="mx-auto h-6 w-6 text-green-accent mb-2" />
          <p className="text-sm font-medium text-gray-800">{name}</p>
        </div>
      ))}
    </div>
  </SectionWrapper>
);

export default CategoriesSection;
