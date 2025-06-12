import { useEffect, useState } from 'react';
import propertyService, { Property } from '../../services/propertyService';
import PropertyCard from './components/PropertyCard';
import AddJobModal from './components/AddJobModal';

function Dashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selected, setSelected] = useState<Property | null>(null);

  useEffect(() => {
    propertyService
      .getProperties()
      .then((res) => setProperties(res.data))
      .catch(() => setProperties([]));
  }, []);

  return (
    <div className="mx-auto max-w-3xl p-4">
      <h1 className="mb-4 text-2xl font-bold">My Properties</h1>
      {properties.map((p) => (
        <PropertyCard key={p.id} property={p} onAddJob={setSelected} />
      ))}
      {properties.length === 0 && (
        <p className="text-sm text-gray-500">No properties found.</p>
      )}
      {selected && (
        <AddJobModal property={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

export default Dashboard;
