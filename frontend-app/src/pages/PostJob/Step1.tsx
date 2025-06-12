import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jobService, { JobCategory } from '../../services/jobService';
import { Button } from '../../components/Button';
import { Spinner } from '../../components/Spinner';

const Step1 = () => {
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [title, setTitle] = useState('');
  const [touched, setTouched] = useState({ category: false, title: false });
  const [submitting, setSubmitting] = useState(false);
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
      if (!window.confirm('Discard this job post?')) return;
    }
    navigate(-1);
  };

  const titleValid = title.trim().length >= 5;
  const isValid = categoryId !== '' && titleValid;

  return (
    <form onSubmit={handleNext} className="mx-auto max-w-md space-y-4 p-4">
      <p className="text-sm text-gray-600">Step 1 of 3 – Basic Info</p>

      <div className="space-y-1">
        <label htmlFor="category" className="text-sm font-medium">
          Service Category
        </label>
        <select
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, category: true }))}
          className={`w-full rounded border p-2 ${
            touched.category && !categoryId ? 'border-red-500' : ''
          }`}
        >
          <option value="">Select a category…</option>
          {categories.map((c) => (
            <option key={c.id.value} value={c.id.value}>
              {c.name}
            </option>
          ))}
        </select>
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
    </form>
  );
};

export default Step1;
