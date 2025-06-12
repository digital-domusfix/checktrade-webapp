import { useState, useEffect } from 'react';
import { Button } from '../../../components/Button';
import propertyService, {
  Property,
  Job,
} from '../../../services/propertyService';

interface Props {
  property: Property;
  onAddJob: (property: Property) => void;
}

export const PropertyCard = ({ property, onAddJob }: Props) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    propertyService
      .getPropertyJobs(property.id)
      .then((res) => setJobs(res.data))
      .catch(() => setJobs([]));
  }, [open, property.id]);

  const completed = jobs.filter((j) => j.status === 'Completed').length;
  const pending = jobs.filter((j) => j.status !== 'Completed').length;
  const quotesReceived = jobs.filter(
    (j) => j.quoteStatus === 'Received',
  ).length;
  const quotesPending = jobs.filter((j) => j.quoteStatus !== 'Received').length;

  return (
    <div className="mb-4 rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            {property.nickname || property.address?.line1}
          </h3>
          <p className="text-sm text-gray-600">
            {property.address?.line1} {property.address?.city}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onAddJob(property)}>
            Add Job
          </Button>
          <Button variant="ghost" onClick={() => setOpen(!open)}>
            {open ? 'Hide Jobs' : 'View Jobs'}
          </Button>
        </div>
      </div>
      {open && (
        <div className="mt-4 space-y-2">
          <div className="text-sm text-gray-700">
            Jobs Completed: {completed} | Pending: {pending}
          </div>
          <div className="text-sm text-gray-700">
            Quotes Received: {quotesReceived} | Pending: {quotesPending}
          </div>
          <ul className="mt-2 space-y-1 border-t pt-2">
            {jobs.map((job) => (
              <li key={job.id} className="text-sm">
                {job.title} - {job.status}
              </li>
            ))}
            {jobs.length === 0 && (
              <li className="text-sm text-gray-500">No jobs found.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PropertyCard;
