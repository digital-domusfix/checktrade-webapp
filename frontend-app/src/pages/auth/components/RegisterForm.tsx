import { useState } from 'react';
import { Spinner } from '../../../components/Spinner';
import { Button } from '../../../components/Button';
import { useAuthStore } from '../../../store/useAuthStore';
import { FcGoogle } from 'react-icons/fc';

interface RegisterFormProps {
  onRegistered: (
    userId: string,
    email: string,
    role: 'homeowner' | 'contractor',
  ) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onRegistered }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'homeowner' | 'contractor' | ''>('');
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    role: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const register = useAuthStore((s) => s.register);

  const isEmailValid = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const isPasswordValid = (val: string) => val.length >= 8 && /\d/.test(val);

  const isFormValid =
    isEmailValid(email) &&
    isPasswordValid(password) &&
    !!role;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const userId = await register({
        fullName,
        email,
        password,
        role: role as 'homeowner' | 'contractor',
      });

      onRegistered(userId, email, role as 'homeowner' | 'contractor');
      setSubmitted(true);
    } catch (err: any) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err.message ||
        'Registration failed';
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
    <form onSubmit={handleSubmit} className="mx-auto max-w-[400px] space-y-6">
      {error && (
        <div
          className="rounded bg-red-100 p-2 text-sm text-red-700 transition-opacity"
          role="alert"
        >
          {error}
        </div>
      )}
      <div className="space-y-4">
        <div className="space-y-1">
          <label
            htmlFor="fullName"
            className="block text-sm font-semibold text-gray-700"
          >
            Full name (optional)
          </label>
          <input
            id="fullName"
            type="text"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-md border border-brand-gray p-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="space-y-1">
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-gray-700"
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => handleBlur('email')}
            aria-describedby={
              touched.email && !isEmailValid(email)
                ? 'register-email-error'
                : undefined
            }
            aria-invalid={
              touched.email && !isEmailValid(email) ? 'true' : undefined
            }
            className={`w-full rounded-md border p-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary ${
              touched.email && !isEmailValid(email)
                ? 'border-error text-error'
                : 'border-brand-gray'
            }`}
          />
          {touched.email && !isEmailValid(email) && (
            <div aria-live="assertive">
              <p
                id="register-email-error"
                className="mt-1 text-sm italic text-error transition-opacity"
              >
                Enter a valid email
              </p>
            </div>
          )}
        </div>
        <div className="relative space-y-1">
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => handleBlur('password')}
            aria-describedby={
              touched.password && !isPasswordValid(password)
                ? 'register-password-error'
                : undefined
            }
            aria-invalid={
              touched.password && !isPasswordValid(password)
                ? 'true'
                : undefined
            }
            className={`w-full rounded-md border p-3 pr-20 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary ${
              touched.password && !isPasswordValid(password)
                ? 'border-error text-error'
                : 'border-brand-gray'
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
            <div aria-live="assertive">
              <p
                id="register-password-error"
                className="mt-1 text-sm italic text-error transition-opacity"
              >
                Password must be at least 8 characters and include a number
              </p>
            </div>
          )}
          <p className="text-xs text-gray-500">
            8+ characters, at least one number
          </p>
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-semibold text-gray-700">
            Select your role
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="role"
                value="homeowner"
                checked={role === 'homeowner'}
                onChange={() => setRole('homeowner')}
                onBlur={() => handleBlur('role')}
                aria-describedby={
                  touched.role && !role ? 'register-role-error' : undefined
                }
                aria-invalid={touched.role && !role ? 'true' : undefined}
              />
              I’m a Homeowner
            </label>
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="role"
                value="contractor"
                checked={role === 'contractor'}
                onChange={() => setRole('contractor')}
                onBlur={() => handleBlur('role')}
                aria-describedby={
                  touched.role && !role ? 'register-role-error' : undefined
                }
                aria-invalid={touched.role && !role ? 'true' : undefined}
              />
              I’m a Tradesperson / Contractor
            </label>
          </div>
          {touched.role && !role && (
            <p id="register-role-error" className="text-sm italic text-error">
              Please select a role
            </p>
          )}
        </div>
      </div>
      <Button
        type="submit"
        className="flex w-full items-center justify-center"
        disabled={submitting || !isFormValid}
      >
        {submitting && <Spinner className="mr-2 text-white" />}
        {submitting ? 'Signing up…' : 'Sign Up'}
      </Button>
      <button
        type="button"
        onClick={() =>
          (window.location.href = `${import.meta.env.VITE_API_BASE_URL}/api/identity/oauth/google`)
        }
        className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-100"
      >
        <FcGoogle size={20} />
        <span className="text-sm font-medium text-gray-800">
          Continue with Google
        </span>
      </button>
      <a
        href="/login"
        className="block text-center text-sm text-primary underline"
      >
        Already have an account? Log in
      </a>
    </form>
  );
};
