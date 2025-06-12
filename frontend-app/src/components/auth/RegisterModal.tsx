import { Dialog } from '@headlessui/react';
import { X, Apple } from 'lucide-react';
import { RegisterScreen } from '../../screens/RegisterScreen';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const RegisterModal = ({ open, onClose }: Props) => (
  <Dialog open={open} onClose={onClose} className="fixed inset-0 z-50">
    <div className="flex min-h-screen items-center justify-center bg-black bg-opacity-50 px-4">
      <Dialog.Panel className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-400 hover:text-black"
        >
          <X />
        </button>

        <h2 className="mb-4 text-center text-xl font-bold">
          Create Your Account
        </h2>

        {/* OAuth buttons */}
        <div className="mb-6 space-y-3">
          <button
            onClick={() =>
              (window.location.href =
                import.meta.env.VITE_API_BASE_URL +
                '/api/identity/oauth/google')
            }
            className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-100"
          >
            <img src="/icons/google.svg" alt="Google" className="size-5" />
            <span className="text-sm font-medium text-gray-800">
              Continue with Google
            </span>
          </button>

          <button
            onClick={() =>
              (window.location.href =
                import.meta.env.VITE_API_BASE_URL + '/api/identity/oauth/apple')
            }
            className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-100"
          >
            <Apple className="size-5" />
            <span className="text-sm font-medium text-gray-800">
              Continue with Apple
            </span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative mb-6">
          <hr className="border-gray-200" />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-sm text-gray-400">
            or continue with email
          </span>
        </div>

        <RegisterScreen />
      </Dialog.Panel>
    </div>
  </Dialog>
);
