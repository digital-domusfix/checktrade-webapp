// features/auth/CompleteProfileForm.tsx
import {  Button } from '@headlessui/react';
import { useState } from 'react';
import { useAuthStore } from '../../../store/useAuthStore';
import { Input } from '../../../components/Input';

interface Props {
  onCompleted: () => void;
}

export const CompleteProfileForm = ({ onCompleted }: Props) => {
  const profile = useAuthStore((s) => s.profile);
  const fetchProfile = useAuthStore((s) => s.fetchProfile);
  const [firstName, setFirstName] = useState(profile?.fullName?.split(' ')[0] || '');
  const [lastName, setLastName] = useState(profile?.fullName?.split(' ')[1] || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      // TODO: Submit to backend API (you may expose PATCH `/api/identity/users/me`)
      console.log('Submitting:', { firstName, lastName, phone });

      // Simulate update
      await new Promise((r) => setTimeout(r, 600));

      await fetchProfile(); // update local state
      onCompleted();
    } catch (e: any) {
      setError(e.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-md mx-auto mt-10">
      <h2 className="text-xl font-semibold">Complete your profile</h2>

      <Input label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      <Input label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
      <Input label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Saving...' : 'Continue'}
      </Button>
    </div>
  );
};
