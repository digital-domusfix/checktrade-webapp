import { useEffect, useState } from 'react';
import { MailCheck } from 'lucide-react';
import { Button } from '../components/Button';
import { useAuthStore } from '../store/useAuthStore';
import { Spinner } from '../components/Spinner';
import { useNavigate } from 'react-router-dom';

interface Props {
  userId: string;
  email: string;
}

export const EmailVerificationScreen = ({ userId, email }: Props) => {
  const resend = useAuthStore((s) => s.resend);
  const fetchProfile = useAuthStore((s) => s.fetchProfile);
  const profile = useAuthStore((s) => s.profile);
  const navigate = useNavigate();

  const [verified, setVerified] = useState(profile?.isActive ?? false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (verified) return;
    const interval = setInterval(async () => {
      await fetchProfile();
    }, 5000);
    return () => clearInterval(interval);
  }, [verified, fetchProfile]);

  useEffect(() => {
    if (profile?.isActive) {
      setVerified(true);
    }
  }, [profile]);

  const handleResend = async () => {
    setResending(true);
    try {
      await resend({ userId });
    } finally {
      setResending(false);
    }
  };

  const handleContinue = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <MailCheck className="w-16 h-16 mx-auto text-primary" />
        <p className="text-lg">
          Please verify your email – we&apos;ve sent a confirmation link to {email}
        </p>
        <div className="space-y-2">
          <Button onClick={handleResend} disabled={resending} variant="outline" className="w-full">
            {resending ? (
              <span className="flex items-center justify-center gap-2"><Spinner className="text-primary" /> Resending…</span>
            ) : (
              'Resend Email'
            )}
          </Button>
          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="block mx-auto text-sm underline text-primary"
          >
            Change Email
          </button>
        </div>
        <Button onClick={handleContinue} disabled={!verified} className="w-full">
          Continue
        </Button>
      </div>
    </div>
  );
};

export default EmailVerificationScreen;
