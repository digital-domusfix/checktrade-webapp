import { Dialog } from '@headlessui/react';
import { X, Apple } from 'lucide-react';
import { RegisterScreen } from '../../screens/RegisterScreen';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const RegisterModal = ({ open, onClose }: Props) => (
  <Dialog open={open} onClose={onClose} className="fixed z-50 inset-0">
    <div className="min-h-screen bg-black bg-opacity-50 flex items-center justify-center px-4">
      <Dialog.Panel className="bg-white rounded-xl max-w-md w-full shadow-xl p-6 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-black">
          <X />
        </button>

        <h2 className="text-xl font-bold text-center mb-4">Create Your Account</h2>

        {/* OAuth buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={() => window.location.href = import.meta.env.VITE_API_BASE_URL + '/api/identity/oauth/google'}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            <img src="/icons/google.svg" alt="Google" className="w-5 h-5" />
            <span className="text-sm font-medium text-gray-800">Continue with Google</span>
          </button>

          <button
            onClick={() => window.location.href = import.meta.env.VITE_API_BASE_URL + '/api/identity/oauth/apple'}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            <Apple className="w-5 h-5" />
            <span className="text-sm font-medium text-gray-800">Continue with Apple</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <hr className="border-gray-200" />
          <span className="absolute left-1/2 -translate-x-1/2 bg-white px-3 text-gray-400 text-sm top-1/2 -translate-y-1/2">
            or continue with email
          </span>
        </div>

        <RegisterScreen />
      </Dialog.Panel>
    </div>
  </Dialog>
);
