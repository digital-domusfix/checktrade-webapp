import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import jobService, { JobCategory } from '../../services/jobService';
import { Button } from '../../components/Button';
import { Spinner } from '../../components/Spinner';
import ConfirmDialog from '../../components/ConfirmDialog';

const Step1 = () => {
  const location = useLocation() as {
    state?: { categoryId?: string; title?: string };
  };

  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [categoryId, setCategoryId] = useState(
    location.state?.categoryId || '',
  );
  const [title, setTitle] = useState(location.state?.title || '');
  const [touched, setTouched] = useState({ category: false, title: false });
  const [submitting, setSubmitting] = useState(false);
  const [showDiscard, setShowDiscard] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    jobService
      .getJobCategories()
      .then((res) => setCategories(res.data.categories))
      .catch((err) => console.error('Failed to load categories', err));
  }, []);

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ category: true, title: true });
    if (!isValid) return;
    setSubmitting(true);
    setTimeout(() => {
      navigate('/post-job/details', { state: { categoryId, title } });
    }, 300);
  };

  const handleCancel = () => {
    if (categoryId || title) {
      setShowDiscard(true);
      return;
    }
    navigate(-1);
  };

  const discard = () => {
    setShowDiscard(false);
    navigate(-1);
  };

  const titleValid = title.trim().length >= 5;
  const isValid = categoryId !== '' && titleValid;

  return (
    <form onSubmit={handleNext} className="mx-auto max-w-md space-y-4 p-4">
      <p className="text-sm text-gray-600">Step 1 of 3 – Basic Info</p>

      <div className="space-y-1">
        <p className="text-sm font-medium">Service Category</p>
        <div
          className="grid grid-cols-2 gap-3 sm:grid-cols-3"
          role="radiogroup"
        >
          {categories.map((c) => (
            <motion.button
              key={c.id.value}
              type="button"
              role="radio"
              aria-checked={categoryId === c.id.value}
              whileTap={{ scale: 0.97 }}
              className={`flex flex-col items-center rounded border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                categoryId === c.id.value
                  ? 'border-primary bg-primary/10'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => {
                setCategoryId(c.id.value);
                setTouched((t) => ({ ...t, category: true }));
              }}
            >
              <span className="sr-only">{c.name}</span>
              <svg
                className="mb-1 size-6 text-primary"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2 2 7l10 5 10-5-10-5Z" />
                <path d="m2 17 10 5 10-5" />
                <path d="m2 12 10 5 10-5" />
              </svg>
              {c.name}
            </motion.button>
          ))}
        </div>
        {touched.category && !categoryId && (
          <p className="text-sm text-red-500">Please select a category</p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="title" className="text-sm font-medium">
          Job Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          maxLength={100}
          placeholder="e.g., Replace kitchen faucet"
          onChange={(e) => setTitle(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, title: true }))}
          className={`w-full rounded border p-2 ${
            touched.title && !titleValid ? 'border-red-500' : ''
          }`}
        />
        <div className="flex items-center justify-between text-sm">
          {touched.title && !titleValid && (
            <p className="text-red-500">Please provide more detail</p>
          )}
          <span className="ml-auto text-gray-400">{title.length}/100</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button type="button" variant="ghost" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!isValid || submitting}>
          {submitting ? <Spinner /> : 'Next: Details'}
        </Button>
      </div>
      <ConfirmDialog
        open={showDiscard}
        message="Discard this job post? Your information will be lost."
        onCancel={() => setShowDiscard(false)}
        onConfirm={discard}
      />
    </form>
  );
};

export default Step1;
