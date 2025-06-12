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
    <SectionWrapper
      title="Trusted by homeowners across Nova Scotia"
      className="bg-white"
    >
      <p className="mb-6 text-center text-gray-600">
        We’ve helped thousands find trusted contractors near them. Here’s where:
      </p>
      <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
        {cityStats.map(({ name, jobs }) => (
          <div
            key={name}
            className="cursor-pointer rounded bg-base p-4 text-center shadow-sm transition hover:shadow-md"
          >
            <MapPin className="mx-auto mb-2 size-5 text-primary" />
            <p className="font-medium text-gray-800">{name}</p>
            <p className="text-xs text-gray-500">{jobs}+ jobs posted</p>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default LocationsGrid;
