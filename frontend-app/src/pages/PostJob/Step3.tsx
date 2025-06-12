import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '../../components/Button';
import { Spinner } from '../../components/Spinner';

interface Step2State {
  categoryId: string;
  title: string;
  subcategoryId: string;
  answers: Record<string, unknown>;
  description: string;
  imgFiles: File[];
  videoFiles: File[];
}

const today = new Date().toISOString().split('T')[0];

const Step3 = () => {
  const { state } = useLocation() as { state?: Step2State };
  const navigate = useNavigate();

  const [timing, setTiming] = useState('');
  const [date, setDate] = useState('');
  const [budget, setBudget] = useState('');
  const [unsure, setUnsure] = useState(false);
  const [touched, setTouched] = useState({ timing: false, budget: false });
  const [nexting, setNexting] = useState(false);

  const timingValid =
    timing !== '' && (timing !== 'date' || (date && date >= today));
  const timingError =
    !touched.timing || timingValid
      ? ''
      : timing === 'date' && date && date < today
        ? 'Please select a future date'
        : 'Please choose when you want the job done';
  const budgetValid =
    unsure ||
    (budget !== '' && !Number.isNaN(Number(budget)) && Number(budget) > 0);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ timing: true, budget: true });
    if (!timingValid || !budgetValid) return;
    setNexting(true);
    const schedule =
      timing === 'date' ? { type: 'date', date } : { type: timing };
    const budgetNum = unsure ? undefined : Number(budget);
    setTimeout(() => {
      navigate('/post-job/review', {
        state: { ...state, schedule, budget: budgetNum },
      });
    }, 300);
  };

  return (
    <form onSubmit={handleNext} className="mx-auto max-w-md space-y-6 p-4">
      <p className="text-sm text-gray-600">Step 3 of 3 – Schedule & Budget</p>

      <div className="space-y-1">
        <p className="text-sm font-medium">
          When would you like the work done?
        </p>
        <div
          className="grid grid-cols-2 gap-3"
          role="radiogroup"
          aria-describedby="schedule-error"
        >
          {[
            { id: 'flexible', label: 'Flexible' },
            { id: 'week', label: 'Within a week' },
            { id: 'month', label: 'Within a month' },
            { id: 'date', label: 'On a specific date' },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={timing === opt.id}
              className={`rounded border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                timing === opt.id
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => {
                setTiming(opt.id);
                setTouched((t) => ({ ...t, timing: true }));
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {timing === 'date' && (
          <input
            type="date"
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-2 w-full rounded border p-2 focus:border-primary"
          />
        )}
        {timingError && (
          <p id="schedule-error" className="text-sm text-red-500">
            {timingError}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="budget" className="text-sm font-medium">
          What is your estimated budget?
        </label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">CAD</span>
          <input
            id="budget"
            type="number"
            disabled={unsure}
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, budget: true }))}
            className={`w-full rounded border p-2 ${touched.budget && !budgetValid ? 'border-red-500' : ''}`}
            placeholder="e.g. 300"
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={unsure}
            onChange={(e) => setUnsure(e.target.checked)}
          />{' '}
          I&apos;m not sure – looking for quotes
        </label>
        {touched.budget && !budgetValid && !unsure && (
          <p className="text-sm text-red-500">Please enter a valid budget</p>
        )}
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/post-job/details', { state })}
        >
          Back
        </Button>
        <Button
          type="submit"
          aria-busy={nexting}
          disabled={!timingValid || !budgetValid || nexting}
        >
          {nexting && <Spinner className="mr-2" />}Next: Review & Post
        </Button>
      </div>
    </form>
  );
};

export default Step3;
