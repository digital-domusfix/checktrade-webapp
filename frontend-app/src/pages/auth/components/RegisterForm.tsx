import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid'; // If you want to simulate a tenantId
import { Button } from '../../../components/Button';
import { useAuthStore } from '../../../store/useAuthStore';

interface RegisterFormProps {
  onRegistered: (userId: string) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onRegistered }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    password: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const register = useAuthStore((s) => s.register);

  const isEmailValid = (val: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const isFormValid =
    fullName.trim().length > 0 &&
    isEmailValid(email) &&
    password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userId = await register({
      login: email,
      userType: 'Customer',
      tenantId: uuidv4(), // Replace with real tenant ID
      preferredLanguage: 'en',
      referralSource: 'Website',
    });

    onRegistered(userId);
    setSubmitted(true);
  };

  const handleBlur = (field: keyof typeof touched) =>
    setTouched((t) => ({ ...t, [field]: true }));

  return submitted ? (
    <div className="text-center text-primary">OTP sent! Please verify.</div>
  ) : (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="text"
          placeholder="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          onBlur={() => handleBlur('fullName')}
          className="w-full p-3 border rounded-lg"
        />
        {touched.fullName && !fullName.trim() && (
          <p className="text-red-500 text-sm mt-1">Full name is required</p>
        )}
      </div>
      <div>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => handleBlur('email')}
          className="w-full p-3 border rounded-lg"
        />
        {touched.email && !isEmailValid(email) && (
          <p className="text-red-500 text-sm mt-1">Enter a valid email</p>
        )}
      </div>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => handleBlur('password')}
          className="w-full p-3 border rounded-lg pr-20"
        />
        <button
          type="button"
          onClick={() => setShowPassword((p) => !p)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-primary"
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
        {touched.password && password.length < 6 && (
          <p className="text-red-500 text-sm mt-1">Password must be at least 6 characters</p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={!isFormValid}>
        Sign Up
      </Button>
    </form>
  );
};

