import { useLocation } from 'react-router-dom';
import OnboardingStatusScreen from '../../screens/OnboardingStatusScreen';
import { useAuthStore } from '../../store/useAuthStore';

type State = { status?: 'approved' | 'pending' };

const STATUS_KEY = 'onboardingStatus';

export default function OnboardingStatusPage() {
  const { state } = useLocation() as { state?: State };
  const profile = useAuthStore((s) => s.profile);

  const status =
    state?.status ||
    (localStorage.getItem(STATUS_KEY) as 'approved' | 'pending' | null) ||
    'pending';

  if (state?.status) {
    localStorage.setItem(STATUS_KEY, state.status);
  }

  const firstName = profile?.fullName?.split(' ')[0] || 'there';
  return <OnboardingStatusScreen firstName={firstName} status={status} />;
}
