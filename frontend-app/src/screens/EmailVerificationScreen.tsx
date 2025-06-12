import { useEffect, useState } from 'react';
import { MailCheck, CheckCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { useAuthStore } from '../store/useAuthStore';
import { Spinner } from '../components/Spinner';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';

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
  const [toastVisible, setToastVisible] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    document.title = 'Verify Your Email';
  }, []);

  useEffect(() => {
    if (verified) return;
    const interval = setInterval(async () => {
      await fetchProfile();
    }, 10000);
    return () => clearInterval(interval);
  }, [verified, fetchProfile]);

  useEffect(() => {
    if (profile?.isActive) {
      setVerified(true);
    }
  }, [profile]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((c) => c - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleResend = async () => {
    setResending(true);
    try {
      await resend({ userId });
      setToastVisible(true);
      setCooldown(30);
    } finally {
      setResending(false);
    }
  };

  const handleContinue = () => {
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <h1 className="sr-only">Verify Your Email</h1>
        {verified ? (
          <CheckCircle className="mx-auto size-16 text-green-600" />
        ) : (
          <MailCheck className="mx-auto size-16 text-primary" />
        )}
        <p className="text-lg">
          Please verify your email – we&apos;ve sent a confirmation link to{' '}
          {email}
        </p>
        {verified && (
          <p className="font-semibold text-green-600">Email verified!</p>
        )}
        <div className="space-y-2">
          <Button
            onClick={handleResend}
            disabled={resending || cooldown > 0}
            variant="primary"
            className="w-full"
          >
            {resending ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner className="text-white" /> Resending…
              </span>
            ) : cooldown > 0 ? (
              `Resend Email (${cooldown}s)`
            ) : (
              'Resend Email'
            )}
          </Button>
          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="mx-auto block text-sm text-primary underline"
          >
            Change Email
          </button>
        </div>
        <Button
          onClick={handleContinue}
          disabled={!verified}
          className="w-full"
        >
          Continue
        </Button>
      </div>
      {toastVisible && (
        <Toast
          message="Verification email sent again."
          onDismiss={() => setToastVisible(false)}
        />
      )}
    </div>
  );
};

export default EmailVerificationScreen;
