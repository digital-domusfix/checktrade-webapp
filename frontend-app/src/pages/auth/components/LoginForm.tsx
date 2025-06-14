import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../../components/Button';
import { useAuthStore } from '../../../store/useAuthStore';

interface Props {
  onLoggedIn: () => void;
}

const LoginForm = ({ onLoggedIn }: Props) => {
  const [submitting, setSubmitting] = useState(false);
  const loginFn = useAuthStore((s) => s.login);

  type FormData = {
    email: string;
    password: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      await loginFn({ login: data.email, password: data.password });
      onLoggedIn();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto max-w-md space-y-4"
    >
      <div className="space-y-1">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Email"
          aria-describedby={errors.email ? 'login-email-error' : undefined}
          aria-invalid={errors.email ? 'true' : undefined}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Enter a valid email',
            },
          })}
          className={`w-full rounded-lg border p-3 ${errors.email ? 'border-red-500' : ''}`}
        />
        {errors.email && (
          <div aria-live="assertive">
            <p id="login-email-error" className="mt-1 text-sm text-red-500">
              {errors.email.message}
            </p>
          </div>
        )}
      </div>
      <div className="space-y-1">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Password"
          aria-describedby={
            errors.password ? 'login-password-error' : undefined
          }
          aria-invalid={errors.password ? 'true' : undefined}
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
            pattern: {
              value: /\d/,
              message: 'Password must contain at least one number',
            },
          })}
          className={`w-full rounded-lg border p-3 ${errors.password ? 'border-red-500' : ''}`}
        />
        {errors.password && (
          <div aria-live="assertive">
            <p id="login-password-error" className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          </div>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={submitting}>
        Login
      </Button>
    </form>
  );
};

export default LoginForm;
