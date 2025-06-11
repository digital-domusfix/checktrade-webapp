import { useState } from 'react';
import { Button } from '../../../components/Button';
import { useAuthStore } from '../../../store/useAuthStore';

interface Props {
  userId: string;
  onVerified: () => void;
}

export const OtpForm = ({ userId, onVerified }: Props) => {
  const [otp, setOtp] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const verify = useAuthStore((s) => s.verify);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await verify({ userId, emailOtp: otp });
    setSubmitting(false);
    onVerified();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        inputMode="numeric"
        maxLength={6}
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="w-full p-3 rounded-lg border text-center tracking-widest text-xl"
        placeholder="Enter 6-digit code"
      />
      <Button type="submit" className="w-full" disabled={submitting}>
        Verify
      </Button>
    </form>
  );
};