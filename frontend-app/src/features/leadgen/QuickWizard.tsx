import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LeadGenService } from '../../services/leadGenService';
import { logEvent } from '../../utils/analytics';
import { Button } from '../../components/Button';

interface Props {
  onStart?: () => void;
  onComplete?: (token: string) => void;
}

const categories = ['Plumbing', 'Electrical', 'HVAC', 'Renovation', 'Solar'];

export const QuickWizard = ({ onStart, onComplete }: Props) => {
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState('');
  const [postcode, setPostcode] = useState('');
  const [date, setDate] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (step === 0) onStart?.();
  }, [step, onStart]);

  const next = () => {
    setStep((s) => {
      const nextStep = s + 1;
      logEvent('wizard_step', { step: nextStep });
      return nextStep;
    });
  };

  const handleSubmit = async () => {
    setStep(4);
    logEvent('wizard_complete');
    try {
      const { data } = await LeadGenService.createJobDraft({
        category,
        postcode,
        date,
        email,
        phone,
      });
      onComplete?.(data.token);
    } finally {
      navigate('/job/new');
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded shadow-md text-left">
      {step === 0 && (
        <motion.section layout>
          <h3 className="font-semibold mb-4">What do you need help with?</h3>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setCategory(c);
                  next();
                }}
                className="border border-primary rounded p-2 text-sm hover:bg-primary hover:text-white"
              >
                {c}
              </button>
            ))}
          </div>
        </motion.section>
      )}

      {step === 1 && (
        <motion.section layout className="space-y-4">
          <label className="block text-sm font-medium">Postcode</label>
          <input
            type="text"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            placeholder="B3J 2K9"
            pattern="[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d"
            className="w-full border p-2 rounded"
          />
          <Button onClick={next} disabled={!postcode.match(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/)}>
            Next
          </Button>
        </motion.section>
      )}

      {step === 2 && (
        <motion.section layout className="space-y-4">
          <label className="block text-sm font-medium">When do you need it?</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <div>
            <button
              onClick={() => {
                setDate('ASAP');
                next();
              }}
              className="underline text-sm text-primary"
            >
              ASAP
            </button>
          </div>
          {date && <Button onClick={next}>Next</Button>}
        </motion.section>
      )}

      {step === 3 && (
        <motion.section layout className="space-y-4">
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <label className="block text-sm font-medium">Phone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <Button onClick={handleSubmit} disabled={!email && !phone}>
            Get My Quotes
          </Button>
        </motion.section>
      )}

      {step === 4 && (
        <motion.section layout className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-primary" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          <span>Finding local matches…</span>
        </motion.section>
      )}
    </div>
  );
};

export default QuickWizard;
