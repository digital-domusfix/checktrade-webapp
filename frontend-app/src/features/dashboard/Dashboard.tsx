import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import propertyService, { Property } from '../../services/propertyService';
import PropertyCard from './components/PropertyCard';
import AddJobModal from './components/AddJobModal';
import { useAuthStore } from '../../store/useAuthStore';
import { Button } from '../../components/Button';

function Dashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selected, setSelected] = useState<Property | null>(null);
  const profile = useAuthStore((s) => s.profile);

  const showBanner = profile && !profile.isOnboarded;

  useEffect(() => {
    propertyService
      .getProperties()
      .then((res) => setProperties(res.data))
      .catch(() => setProperties([]));
  }, []);

  return (
    <div className="mx-auto max-w-3xl p-4">
      {showBanner && (
        <div className="mb-4 flex items-center justify-between rounded border border-primary bg-white p-3 shadow-sm">
          <span className="text-sm">Complete your profile to continue</span>
          <Link to="/profile-setup">
            <Button variant="outline" className="text-sm">
              Complete profile
            </Button>
          </Link>
        </div>
      )}
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
