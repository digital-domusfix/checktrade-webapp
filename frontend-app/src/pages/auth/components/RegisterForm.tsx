import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // If you want to simulate a tenantId
import { Button } from '../../../components/Button';
import { useAuthStore } from '../../../store/useAuthStore';
interface RegisterFormProps {
  onRegistered: (userId: string) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onRegistered }) => {
  const [login, setLogin] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const register = useAuthStore((s) => s.register);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userId = await register({
      login,
      userType: 'Customer',
      tenantId: uuidv4(), // Replace with real tenant ID
      preferredLanguage: 'en',
      referralSource: 'Website',
    });

    onRegistered(userId);
    setSubmitted(true);
  };

  return submitted ? (
    <div className="text-center text-primary">OTP sent! Please verify.</div>
  ) : (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Enter email or mobile"
        value={login}
        onChange={(e) => setLogin(e.target.value)}
        className="w-full p-3 border rounded-lg"
        required
      />
      <Button type="submit" className="w-full">Continue</Button>
    </form>
  );
};

