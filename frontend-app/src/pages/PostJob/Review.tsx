import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Spinner } from '../../components/Spinner';
import jobService, {
  JobCategory,
  JobSubcategory,
} from '../../services/jobService';
import type { Field } from './formConfigs';
import { formConfigs } from './formConfigs';

interface ReviewState {
  categoryId: string;
  title: string;
  subcategoryId: string;
  answers: Record<string, unknown>;
  description: string;
  imgFiles: File[];
  videoFiles: File[];
  schedule: { type: string; date?: string };
  budget?: number;
}

const Review = () => {
  const { state } = useLocation() as { state?: ReviewState };
  const navigate = useNavigate();

  const [category, setCategory] = useState<JobCategory>();
  const [subcategory, setSubcategory] = useState<JobSubcategory>();
  const [fields, setFields] = useState<Field[]>([]);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    if (!state) return;
    jobService
      .getJobCategories()
      .then((res) =>
        setCategory(
          res.data.categories.find((c) => c.id.value === state.categoryId),
        ),
      )
      .catch(() => {});
    jobService
      .getJobSubcategories(state.categoryId)
      .then((res) =>
        setSubcategory(res.data.find((s) => s.id === state.subcategoryId)),
      )
      .catch(() => {});
    jobService
      .getJobSubcategoryForm(state.subcategoryId)
      .then(() => setFields(formConfigs[state.subcategoryId] || []))
      .catch(() => setFields([]));
  }, [state]);

  if (!state) return null;

  const scheduleLabel =
    state.schedule.type === 'date'
      ? `On ${state.schedule.date}`
      : state.schedule.type === 'week'
        ? 'Within a week'
        : state.schedule.type === 'month'
          ? 'Within a month'
          : 'Flexible';

  const postDisabled = posting;

  const handlePost = () => {
    setPosting(true);
    setTimeout(() => navigate('/job/new'), 500);
  };

  return (
    <div className="mx-auto max-w-md space-y-6 p-4">
      <h1 className="text-sm text-gray-600">Review &amp; Post</h1>

      <section className="space-y-1 rounded border p-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium">Category &amp; Subcategory</h2>
          <button
            type="button"
            className="text-sm text-primary underline"
            onClick={() => navigate('/post-job', { state })}
          >
            Edit
          </button>
        </div>
        <p className="text-sm text-gray-700">
          {(category?.name || state.categoryId) +
            ' / ' +
            (subcategory?.name || state.subcategoryId)}
        </p>
      </section>

      <section className="space-y-1 rounded border p-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium">Job Title</h2>
          <button
            type="button"
            className="text-sm text-primary underline"
            onClick={() => navigate('/post-job', { state })}
          >
            Edit
          </button>
        </div>
        <p className="text-sm text-gray-700">{state.title}</p>
      </section>

      <section className="space-y-1 rounded border p-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium">Specific Questions</h2>
          <button
            type="button"
            className="text-sm text-primary underline"
            onClick={() => navigate('/post-job/details', { state })}
          >
            Edit
          </button>
        </div>
        {fields.length === 0 ? (
          <p className="text-sm text-gray-700">No questions</p>
        ) : (
          <ul className="space-y-1 text-sm text-gray-700">
            {fields.map((f) => (
              <li key={f.id} className="flex justify-between gap-2">
                <span>{f.label}</span>
                <span className="font-medium">
                  {String(state.answers[f.id] ?? '')}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-1 rounded border p-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium">Description</h2>
          <button
            type="button"
            className="text-sm text-primary underline"
            onClick={() => navigate('/post-job/details', { state })}
          >
            Edit
          </button>
        </div>
        <p className="text-sm text-gray-700">
          {state.description ? state.description : 'Not provided'}
        </p>
      </section>

      <section className="space-y-1 rounded border p-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium">Schedule</h2>
          <button
            type="button"
            className="text-sm text-primary underline"
            onClick={() => navigate('/post-job/schedule', { state })}
          >
            Edit
          </button>
        </div>
        <p className="text-sm text-gray-700">{scheduleLabel}</p>
      </section>

      <section className="space-y-1 rounded border p-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium">Budget</h2>
          <button
            type="button"
            className="text-sm text-primary underline"
            onClick={() => navigate('/post-job/schedule', { state })}
          >
            Edit
          </button>
        </div>
        <p className="text-sm text-gray-700">
          {state.budget ? `CAD ${state.budget}` : 'Looking for quotes'}
        </p>
      </section>

      {(state.imgFiles.length > 0 || state.videoFiles.length > 0) && (
        <section className="space-y-2 rounded border p-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">Media</h2>
            <button
              type="button"
              className="text-sm text-primary underline"
              onClick={() => navigate('/post-job/details', { state })}
            >
              Edit
            </button>
          </div>
          {state.imgFiles.length > 0 && (
            <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {state.imgFiles.map((f, i) => (
                <li key={i}>
                  <img
                    className="h-24 w-full rounded object-cover"
                    src={URL.createObjectURL(f)}
                    alt="preview"
                  />
                </li>
              ))}
            </ul>
          )}
          {state.videoFiles.length > 0 && (
            <ul className="grid grid-cols-1 gap-2">
              {state.videoFiles.map((f, i) => (
                <li key={i}>
                  <video
                    className="h-32 w-full rounded"
                    src={URL.createObjectURL(f)}
                    controls
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/post-job/schedule', { state })}
        >
          Back
        </Button>
        <Button
          type="button"
          aria-busy={posting}
          disabled={postDisabled}
          onClick={handlePost}
        >
          {posting && <Spinner className="mr-2" />}Post Job
        </Button>
      </div>
    </div>
  );
};

export default Review;
