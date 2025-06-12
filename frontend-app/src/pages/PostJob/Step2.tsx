import { useLocation } from 'react-router-dom';

const Step2 = () => {
  const { state } = useLocation() as {
    state?: { categoryId: string; title: string };
  };

  return (
    <div className="p-4">
      <p className="text-sm text-gray-600">
        Step 2 of 3 – Job Description & Photos
      </p>
      <pre className="mt-4 text-xs text-gray-500">
        {JSON.stringify(state, null, 2)}
      </pre>
      <p className="mt-6 text-gray-500">Coming soon…</p>
    </div>
  );
};

export default Step2;
