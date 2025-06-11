import { useState } from 'react';
import { Spinner } from '../../../components/Spinner';
import { v4 as uuidv4 } from 'uuid'; // If you want to simulate a tenantId
import { Button } from '../../../components/Button';
import { useAuthStore } from '../../../store/useAuthStore';
import { FcGoogle } from 'react-icons/fc';

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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const register = useAuthStore((s) => s.register);

  const isEmailValid = (val: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const isPasswordValid = (val: string) => val.length >= 6 && /\d/.test(val);

  const isFormValid =
    fullName.trim().length > 0 &&
    isEmailValid(email) &&
    isPasswordValid(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const userId = await register({
        login: email,
        userType: 'Customer',
        tenantId: uuidv4(), // Replace with real tenant ID
        preferredLanguage: 'en',
        referralSource: 'Website',
      });

      onRegistered(userId);
      setSubmitted(true);
    } catch (err: any) {
      const message = err?.response?.data?.message || err.message || 'Registration failed';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBlur = (field: keyof typeof touched) =>
    setTouched((t) => ({ ...t, [field]: true }));

  return submitted ? (
    <div className="text-center text-primary">OTP sent! Please verify.</div>
  ) : (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded text-sm" role="alert">
          {error}
        </div>
      )}
      <div className="space-y-1">
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
          Full name
        </label>
        <input
          id="fullName"
          type="text"
          placeholder="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          onBlur={() => handleBlur('fullName')}
          className={`w-full p-3 border rounded-lg ${
            touched.fullName && !fullName.trim() ? 'border-red-500' : ''
          }`}
        />
        {touched.fullName && !fullName.trim() && (
          <p className="text-red-500 text-sm mt-1">Full name is required</p>
        )}
      </div>
      <div className="space-y-1">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <input
          id="email"
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => handleBlur('email')}
          className={`w-full p-3 border rounded-lg ${
            touched.email && !isEmailValid(email) ? 'border-red-500' : ''
          }`}
        />
        {touched.email && !isEmailValid(email) && (
          <p className="text-red-500 text-sm mt-1">Enter a valid email</p>
        )}
      </div>
      <div className="relative space-y-1">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => handleBlur('password')}
          className={`w-full p-3 border rounded-lg pr-20 ${
            touched.password && !isPasswordValid(password) ? 'border-red-500' : ''
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword((p) => !p)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-primary"
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
        {touched.password && !isPasswordValid(password) && (
          <p className="text-red-500 text-sm mt-1">
            Password must be at least 6 characters and include a number
          </p>
        )}
      </div>
      <Button type="submit" className="w-full flex items-center justify-center" disabled={submitting || !isFormValid}>
        {submitting && <Spinner className="text-white mr-2" />}
        Sign Up
      </Button>
      <button
        type="button"
        onClick={() => (window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/identity/oauth/google`)}
        className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-100"
      >
        <FcGoogle size={20} />
        <span className="text-sm font-medium text-gray-800">Continue with Google</span>
      </button>
    </form>
  );
};

