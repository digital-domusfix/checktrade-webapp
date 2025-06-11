import { useState } from 'react';
import { SectionWrapper } from '../../components/SectionWrapper';
import { ChevronDown, ChevronUp } from 'lucide-react';

const locations = [
  'Halifax',
  'Dartmouth',
  'Sydney',
  'Truro',
  'New Glasgow',
  'Bridgewater',
  'Kentville',
  'Yarmouth',
];

const LocationsGrid = () => {
  const [open, setOpen] = useState(false);
  return (
    <SectionWrapper title="Find plumbers in…" className="bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="mb-4 flex items-center text-primary font-semibold"
      >
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        <span className="ml-2">{open ? 'Hide locations' : 'Show locations'}</span>
      </button>
      {open && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
          {locations.map((loc) => (
            <div key={loc} className="bg-base p-2 rounded">
              {loc}
            </div>
          ))}
        </div>
      )}
    </SectionWrapper>
  );
};

export default LocationsGrid;
