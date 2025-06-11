import { useState } from 'react';
import { Button } from '../../../components/Button';
import { useAuthStore } from '../../../store/useAuthStore';

interface Props {
  onLoggedIn: () => void;
}

const LoginForm = ({ onLoggedIn }: Props) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const loginFn = useAuthStore((s) => s.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await loginFn({ login, password });
      onLoggedIn();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={login}
        onChange={(e) => setLogin(e.target.value)}
        placeholder="Email or phone"
        className="w-full p-3 border rounded-lg"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="w-full p-3 border rounded-lg"
      />
      <Button type="submit" className="w-full" disabled={submitting}>
        Login
      </Button>
    </form>
  );
};

export default LoginForm;
