// pages/Auth/CompleteProfilePage.tsx
import { useNavigate } from 'react-router-dom';
import { CompleteProfileForm } from './CompleteProfileForm';

const CompleteProfilePage = () => {
  const navigate = useNavigate();

  const handleCompleted = () => {
    // TODO: You can check role/onboarding status here if needed
    navigate('/dashboard');
  };

  return <CompleteProfileForm onCompleted={handleCompleted} />;
};

export default CompleteProfilePage;
