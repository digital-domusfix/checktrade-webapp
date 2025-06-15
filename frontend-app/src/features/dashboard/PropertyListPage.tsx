import { useEffect, useState } from 'react';
import { getAllPropertiesWithStats, Property } from '../../services/propertyService';
import { useNavigate } from 'react-router-dom';
import PropertyCard from './components/PropertyCard';

export const PropertyListPage = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllPropertiesWithStats().then(setProperties).catch(() => setProperties([]));
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Your Properties</h1>
      {properties.map((p) => (
        <PropertyCard
          key={p.id}
          property={p}
          onAddJob={(prop) => navigate(`/dashboard/properties/${prop.id}/jobs/new`)}
          onViewJobs={(id) => navigate(`/dashboard/properties/${id}`)}
        />
      ))}
    </div>
  );
};
