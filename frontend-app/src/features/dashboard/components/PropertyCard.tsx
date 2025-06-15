import React from 'react';
import { Button } from '../../../components/Button';
import { Property } from '../../../services/propertyService';

interface Props {
  property: Property;
  onAddJob: (property: Property) => void;
  onViewJobs: (propertyId: string) => void;
}

const PropertyCard = ({ property, onAddJob, onViewJobs }: Props) => {
  const {
    jobStats = { total: 0, completed: 0, pending: 0, quotesReceived: 0, quotesPending: 0 },
  } = property;

  return (
    <div className="mb-4 rounded-lg border bg-white p-4 shadow">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{property.nickname || property.address.line1}</h3>
          <p className="text-sm text-gray-600">
            {property.address.line1}, {property.address.city}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onAddJob(property)}>
            Add Job
          </Button>
          <Button variant="ghost" onClick={() => onViewJobs(property.id)}>
            View Jobs
          </Button>
        </div>
      </div>
      <div className="mt-2 text-sm text-gray-700">
        Total: {jobStats.total} | Completed: {jobStats.completed} | Pending: {jobStats.pending}
        <br />
        Quotes Received: {jobStats.quotesReceived} | Quotes Pending: {jobStats.quotesPending}
      </div>
    </div>
  );
};

export default PropertyCard;
