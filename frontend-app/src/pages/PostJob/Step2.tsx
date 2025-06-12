import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';

const Step2 = () => {
  const { state } = useLocation() as {
    state?: { categoryId: string; title: string };
  };
  const navigate = useNavigate();

  return (
    <div className="space-y-4 p-4">
      <p className="text-sm text-gray-600">
        Step 2 of 3 – Job Description & Photos
      </p>
      <pre className="mt-4 text-xs text-gray-500">
        {JSON.stringify(state, null, 2)}
      </pre>
      <p className="mt-6 text-gray-500">Coming soon…</p>
      <Button
        type="button"
        variant="outline"
        onClick={() => navigate('/post-job', { state })}
      >
        Back
      </Button>
    </div>
  );
};

export default Step2;
