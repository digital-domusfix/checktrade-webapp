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
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Properties</h1>
      {properties.map((p) => (
        <PropertyCard key={p.id} property={p} onAddJob={setSelected} />
      ))}
      {properties.length === 0 && (
        <p className="text-gray-500 text-sm">No properties found.</p>
      )}
      {selected && (
        <AddJobModal property={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

export default Dashboard;
