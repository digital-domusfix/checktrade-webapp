import React from 'react';
import { SectionWrapper } from '../../components/SectionWrapper';

const contractors = [
  { name: 'Eco Plumbing Ltd.', location: 'Truro', rating: 4.9, years: 12 },
  { name: 'SunSpark Solar', location: 'Halifax', rating: 4.8, years: 5 },
];

const ContractorHighlights: React.FC = () => (
  <SectionWrapper id="contractors" title="Meet Some of Our Pros">
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {contractors.map((c, i) => (
        <div
          key={i}
          className="border p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition"
        >
          <h4 className="text-lg font-bold">{c.name}</h4>
          <p className="text-sm text-gray-600">{c.location}</p>
          <p className="text-sm mt-2 text-gray-500">
            ⭐ {c.rating} / 5 • {c.years} years in business
          </p>
        </div>
      ))}
    </div>
  </SectionWrapper>
);

export default ContractorHighlights;
