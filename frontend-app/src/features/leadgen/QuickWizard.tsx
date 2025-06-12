import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LeadGenService } from '../../services/leadGenService';
import jobService, { JobCategory, JobSubcategory } from '../../services/jobService';
import { logEvent } from '../../utils/analytics';
import { Button } from '../../components/Button';

const questions: Record<string, string[]> = {
  'Leaky faucet': ['Is the faucet dripping or spraying?', 'Single handle or two knobs?'],
  'Toilet issue': ['Does it flush?', 'Is it leaking around the base?'],
  Lighting: ['What kind of lights?', 'Ceiling or wall-mounted?'],
  'AC not working': ['Is the fan running?', 'When did the issue start?'],
  'Kitchen remodel': ['Full remodel or cosmetic?', 'Include plumbing/electrical changes?'],
};

interface Props {
  onStart?: () => void;
  onComplete?: (token: string) => void;
}

export const QuickWizard = ({ onStart, onComplete }: Props) => {
  const [step, setStep] = useState(0);
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [subcategories, setSubcategories] = useState<JobSubcategory[]>([]);
  const [category, setCategory] = useState<JobCategory | null>(null);
  const [subcategory, setSubcategory] = useState<JobSubcategory | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState('');
  const [postcode, setPostcode] = useState('');
  const [date, setDate] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    jobService
      .getJobCategories()
      .then((res) => setCategories(res.data.categories))
      .catch((err) => console.error('Failed to load categories', err));
  }, []);

  useEffect(() => {
    if (step === 0) onStart?.();
  }, [step, onStart]);

  useEffect(() => {
    if (!category) return;
    jobService
      .getJobSubcategories(category.id.value)
      .then((res) => setSubcategories(res.data))
      .catch((err) => console.error('Failed to load subcategories', err));
  }, [category]);

  const next = () => {
    const nextStep = step + 1;
    logEvent('wizard_step', { step: nextStep });
    setStep(nextStep);
  };

  const handleSubmit = async () => {
    logEvent('wizard_complete');
    try {
      const { data } = await LeadGenService.createJobDraft({
        category: category?.id ?? '',
        subcategory: subcategory?.id,
        answers,
        notes,
        postcode,
        date,
        email,
        phone,
      });
      localStorage.setItem('draftToken', data.token);
      onComplete?.(data.token);
      navigate('/job/new');
    } catch (error) {
      console.error('Submission failed', error);
    }
  };

  return (
    <div className="bg-white p-5 sm:p-6 rounded shadow-md text-left space-y-6 max-w-xl mx-auto">
      {step === 0 && (
        <motion.section layout>
          <h3 className="font-semibold mb-3">What kind of help do you need?</h3>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((c) => (
              <button
                key={c.id.value}
                onClick={() => {
                  setCategory(c);
                  next();
                }}
                className="border border-primary rounded p-2 text-sm hover:bg-primary hover:text-white"
              >
                {c.name}
              </button>
            ))}
          </div>
        </motion.section>
      )}

      {step === 1 && category && (
        <motion.section layout>
          <h3 className="font-semibold mb-3">What best describes your job?</h3>
          <div className="grid grid-cols-2 gap-2">
            {subcategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => {
                  setSubcategory(sub);
                  next();
                }}
                className="border border-primary rounded p-2 text-sm hover:bg-primary hover:text-white"
              >
                {sub.name}
              </button>
            ))}
          </div>
        </motion.section>
      )}

      {step === 2 && subcategory && (
        <motion.section layout className="space-y-4">
          <h3 className="font-semibold mb-3">Just a few details</h3>
          {questions[subcategory.name]?.map((q, i) => (
            <div key={i} className="space-y-1">
              <label htmlFor={`q${i}`} className="text-sm font-medium">
                {q}
              </label>
              <input
                id={`q${i}`}
                type="text"
                value={answers[q] || ''}
                onChange={(e) => setAnswers({ ...answers, [q]: e.target.value })}
                className="w-full border p-2 rounded"
              />
            </div>
          ))}
          <div>
            <label htmlFor="notes" className="text-sm font-medium">
              Anything else we should know?
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="Optional — describe your situation"
            />
          </div>
          <Button onClick={next}>Continue</Button>
        </motion.section>
      )}

      {step === 3 && (
        <motion.section layout className="space-y-4">
          <label htmlFor="postcode" className="block text-sm font-medium">
            Your location (Postcode)
          </label>
          <input
            id="postcode"
            type="text"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            placeholder="e.g. B3J 2K9"
            className="w-full border p-2 rounded"
          />
          <Button onClick={next} disabled={!postcode}>Continue</Button>
        </motion.section>
      )}

      {step === 4 && (
        <motion.section layout className="space-y-4">
          <label htmlFor="needDate" className="block text-sm font-medium">
            When do you need the service?
          </label>
          <input
            id="needDate"
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

      {step === 5 && (
        <motion.section layout className="space-y-4">
          <label htmlFor="email" className="block text-sm font-medium">
            Your Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <label htmlFor="phone" className="block text-sm font-medium">
            Phone (optional)
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <Button onClick={next} disabled={!email}>Next</Button>
        </motion.section>
      )}

      {step === 6 && (
        <motion.section layout className="text-center space-y-4">
          <h4 className="font-semibold text-lg">One last step!</h4>
          <p className="text-gray-600 text-sm">
            We’ve saved your job. Create a free account to message contractors and track your quotes.
          </p>
          <Button onClick={handleSubmit}>Register & View Quotes</Button>
          <p className="text-xs text-gray-400">
            Already have an account? <a href="/login" className="underline text-primary">Sign in</a>
          </p>
        </motion.section>
      )}
    </div>
  );
};

export default QuickWizard;
