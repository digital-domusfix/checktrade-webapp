import { useState } from 'react';
import { OtpForm } from '../pages/auth/components/OtpForm';
import { RegisterForm } from '../pages/auth/components/RegisterForm';

export const RegisterScreen = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [step, setStep] = useState<'register' | 'verify'>('register');

  const handleRegisterSuccess = (id: string) => {
    setUserId(id);
    setStep('verify');
  };

  const handleVerifySuccess = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Join CheckTrade</h1>
        {step === 'register' && <RegisterForm onRegistered={handleRegisterSuccess} />}
        {step === 'verify' && userId && (
          <OtpForm userId={userId} onVerified={handleVerifySuccess} />
        )}
      </div>
    </div>
  );
};