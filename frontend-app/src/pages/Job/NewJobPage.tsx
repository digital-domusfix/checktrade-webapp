import { useEffect, useState } from 'react';
import jobService from '../../services/jobService';

const NewJobPage = () => {
  const [converted, setConverted] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('draftToken');
    if (!token) return;

    jobService.convertJobDraft(token).finally(() => {
      localStorage.removeItem('draftToken');
      setConverted(true);
    });
  }, []);

  return (
    <div className="p-4">
      {converted ? 'Job draft converted!' : 'Job draft created. Converting...'}
    </div>
  );
};

export default NewJobPage;
