import { CheckCircle, Hourglass } from 'lucide-react';
import { Button } from '../components/Button';
import { useNavigate } from 'react-router-dom';

export interface OnboardingStatusScreenProps {
  firstName: string;
  status: 'approved' | 'pending';
}

export default function OnboardingStatusScreen({
  firstName,
  status,
}: OnboardingStatusScreenProps) {
  const navigate = useNavigate();
  const goHome = () => navigate('/home');
  const goDashboard = () => navigate('/dashboard');

  const approved = status === 'approved';
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        {approved ? (
          <CheckCircle className="mx-auto size-20 text-green-600" />
        ) : (
          <Hourglass className="mx-auto size-20 text-primary" />
        )}
        <h1 className="text-3xl font-bold">
          {approved ? `You’re all set, ${firstName}!` : 'Verification Pending'}
        </h1>
        <p className="text-lg">
          {approved
            ? "Your profile is complete and you're ready to start receiving job leads."
            : `Thanks for submitting your documents, ${firstName}. Our team is reviewing your profile and will notify you shortly.`}
        </p>
        <div className="pt-2">
          {approved ? (
            <Button onClick={goDashboard} className="w-full">
              Go to My Dashboard
            </Button>
          ) : (
            <Button onClick={goHome} className="w-full">
              Return to Home
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
