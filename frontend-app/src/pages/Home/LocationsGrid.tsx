import { SectionWrapper } from '../../components/SectionWrapper';
import { MapPin } from 'lucide-react';

const cityStats = [
  { name: 'Halifax', jobs: 2300 },
  { name: 'Dartmouth', jobs: 1400 },
  { name: 'Sydney', jobs: 1100 },
  { name: 'Truro', jobs: 950 },
  { name: 'New Glasgow', jobs: 730 },
  { name: 'Bridgewater', jobs: 680 },
  { name: 'Kentville', jobs: 570 },
  { name: 'Yarmouth', jobs: 430 },
];

const LocationsGrid = () => {
  return (
    <SectionWrapper title="Trusted by homeowners across Nova Scotia" className="bg-white">
      <p className="text-center text-gray-600 mb-6">
        We’ve helped thousands find trusted contractors near them. Here’s where:
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
        {cityStats.map(({ name, jobs }) => (
          <div
            key={name}
            className="bg-base p-4 rounded shadow-sm hover:shadow-md transition cursor-pointer text-center"
          >
            <MapPin className="mx-auto text-primary w-5 h-5 mb-2" />
            <p className="font-medium text-gray-800">{name}</p>
            <p className="text-xs text-gray-500">{jobs}+ jobs posted</p>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default LocationsGrid;
