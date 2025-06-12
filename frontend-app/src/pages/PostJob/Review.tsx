import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../../components/Button';

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
  const { state } = useLocation() as { state: ReviewState };
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-md space-y-4 p-4">
      <p className="text-sm text-gray-600">Review &amp; Post</p>
      <div className="rounded border p-3">
        <p className="font-medium">Title</p>
        <p className="text-sm text-gray-700">{state.title}</p>
      </div>
      <div className="rounded border p-3">
        <p className="font-medium">Schedule</p>
        <p className="text-sm text-gray-700">
          {state.schedule.type === 'date'
            ? `On ${state.schedule.date}`
            : state.schedule.type === 'week'
              ? 'Within a week'
              : state.schedule.type === 'month'
                ? 'Within a month'
                : 'Flexible'}
        </p>
      </div>
      <div className="rounded border p-3">
        <p className="font-medium">Budget</p>
        <p className="text-sm text-gray-700">
          {state.budget ? `CAD ${state.budget}` : 'Looking for quotes'}
        </p>
      </div>
      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/post-job/schedule', { state })}
        >
          Back
        </Button>
        <Button type="button" onClick={() => navigate('/job/new')}>
          Post Job
        </Button>
      </div>
    </div>
  );
};

export default Review;
