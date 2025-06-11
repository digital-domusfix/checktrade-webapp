import { useState } from 'react';
import { Button } from '../../../components/Button';
import jobService, { CreateJobRequest } from '../../../services/jobService';
import { Property } from '../../../services/propertyService';

interface Props {
  property: Property;
  onCreated?: () => void;
}

export const AddJobForm = ({ property, onCreated }: Props) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const req: Partial<CreateJobRequest> = {
        customerProfileId: '',
        propertyId: property.id,
        categoryId: '',
        subcategoryId: '',
        title,
        description,
      };
      await jobService.createJob(req as CreateJobRequest);
      onCreated?.();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="text-sm text-gray-700">
        Creating job for{' '}
        <strong>{property.nickname || property.address?.line1}</strong>
      </div>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Job title"
        className="w-full border p-2 rounded"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Job description"
        className="w-full border p-2 rounded"
      />
      <Button type="submit" disabled={submitting || !title}>
        Create Job
      </Button>
    </form>
  );
};

export default AddJobForm;
