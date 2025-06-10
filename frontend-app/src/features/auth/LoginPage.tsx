import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [step, setStep] = useState<'options' | 'email' | 'code'>('options');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(Array(6).fill(''));
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const navigate = useNavigate();

  const handleSendCode = () => {
    if (email) {
      setStep('code');
      setTimeout(() => inputRefs.current[0]?.focus(), 0);
    }
  };

  const handleCodeChange = (idx: number, value: string) => {
    if (/^\d?$/.test(value)) {
      const next = [...code];
      next[idx] = value;
      setCode(next);
      if (value && idx < 5) {
        inputRefs.current[idx + 1]?.focus();
      }
      if (next.join('').length === 6) {
        navigate('/onboarding');
      }
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-4 p-4">
      {step === 'options' && (
        <div className="space-y-4">
          <button className="w-full rounded bg-black py-3 text-white">
            Continue with Apple
          </button>
          <button className="w-full rounded bg-red-600 py-3 text-white">
            Continue with Google
          </button>
          <button
            className="w-full rounded bg-teal-600 py-3 text-white"
            onClick={() => setStep('email')}
          >
            Continue with Email
          </button>
        </div>
      )}

      {step === 'email' && (
        <div className="space-y-4">
          <input
            type="email"
            placeholder="your@email.com"
            className="w-full rounded border p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="w-full rounded bg-teal-600 py-3 text-white"
            onClick={handleSendCode}
          >
            Send Code
          </button>
        </div>
      )}

      {step === 'code' && (
        <div
          className="flex justify-center space-x-2"
          data-testid="code-inputs"
        >
          {code.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                if (el) inputRefs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              className="w-10 rounded border p-2 text-center"
              maxLength={1}
              value={d}
              onChange={(e) => handleCodeChange(i, e.target.value)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default LoginPage;
