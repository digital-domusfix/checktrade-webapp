import { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import Toast from '../components/Toast';

interface LocationState {
  jobId?: string;
}

const JobPostedScreen = () => {
  const { state } = useLocation() as { state?: LocationState };
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(true);

  const jobId = state?.jobId || localStorage.getItem('lastJobId') || '';

  useEffect(() => {
    if (state?.jobId) {
      localStorage.setItem('lastJobId', state.jobId);
    }
  }, [state]);

  const viewJob = () => {
    navigate('/dashboard');
  };

  const postAnother = () => {
    localStorage.removeItem('lastJobId');
    navigate('/post-job');
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 text-center">
        <CheckCircle className="mx-auto size-20 text-green-600" />
        <h1 className="text-3xl font-bold">Job Posted Successfully!</h1>
        <p className="text-lg">
          Your job has been posted! Local professionals will start reaching out
          soon.
        </p>
        {jobId ? (
          <p className="text-sm text-gray-600">Reference ID: {jobId}</p>
        ) : (
          <p className="text-sm text-gray-600">
            Your job was successfully submitted. View it on your dashboard.
          </p>
        )}
        <div className="space-y-2 pt-2">
          <Button onClick={viewJob} className="w-full">
            View My Job
          </Button>
          <Button variant="outline" onClick={postAnother} className="w-full">
            Post Another Job
          </Button>
        </div>
      </div>
      {showToast && (
        <Toast
          message="You’ll be notified when someone sends you a quote"
          onDismiss={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default JobPostedScreen;
