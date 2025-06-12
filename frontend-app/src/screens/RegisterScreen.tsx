import { RegisterForm } from '../pages/auth/components/RegisterForm';
import { useNavigate } from 'react-router-dom';
export const RegisterScreen = () => {
  const navigate = useNavigate();

  const handleRegisterSuccess = (id: string, email: string) => {
    navigate(`/verify-email?uid=${id}&email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-[400px]">
        <h1 className="mb-6 text-center text-2xl font-bold">Join CheckTrade</h1>
        <RegisterForm onRegistered={handleRegisterSuccess} />
      </div>
    </div>
  );
};
