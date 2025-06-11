import { FcGoogle } from 'react-icons/fc';
import { BsApple } from 'react-icons/bs';
import { Button } from '../../../components/Button';

export const OAuthButtons = () => {
  const handleOAuth = (provider: 'google' | 'apple') => {
    window.location.href = `/auth/${provider}`; // or call API to get redirect URL
  };

  return (
    <div className="space-y-3">
      <Button
        onClick={() => handleOAuth('google')}
        className="w-full flex items-center justify-center gap-2 bg-white text-gray-800 border border-gray-300 hover:bg-gray-100"
      >
        <FcGoogle size={20} /> Continue with Google
      </Button>
      <Button
        onClick={() => handleOAuth('apple')}
        className="w-full flex items-center justify-center gap-2 bg-black text-white hover:bg-gray-900"
      >
        <BsApple size={20} /> Continue with Apple
      </Button>
    </div>
  );
};
