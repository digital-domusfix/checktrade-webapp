import http from '../api/httpClient';
import { PropertyDto, JobDto } from '../types/common';

export type Property = PropertyDto;
export type Job = JobDto;


export interface JobStats {
  total: number;
  completed: number;
  pending: number;
  quotesReceived: number;
  quotesPending: number;
}


const getProperties = () => http.get<Property[]>('/api/identity/properties');

const getPropertyJobs = (propertyId: string) =>
  http.get<Job[]>(`/api/identity/properties/${propertyId}/jobs`);

export default {
  getProperties,
  getPropertyJobs,
};

export async function getAllPropertiesWithStats(): Promise<Property[]> {
  const res = await http.get<Property[]>('/api/properties');

  return res.data.map((property) => {
    const jobs = property.jobs || [];

    const stats: JobStats = {
      total: jobs.length,
      completed: jobs.filter(j => j.status === 'Completed').length,
      pending: jobs.filter(j => j.status !== 'Completed').length,
      quotesReceived: jobs.filter(j => j.quoteStatus === 'Received').length,
      quotesPending: jobs.filter(j => j.quoteStatus !== 'Received').length,
    };

    return { ...property, jobStats: stats };
  });
}