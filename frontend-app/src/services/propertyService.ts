import http from '../api/httpClient';
import { PropertyDto, JobDto } from '../types/common';

export type Property = PropertyDto;
export type Job = JobDto;

const getProperties = () => http.get<Property[]>('/api/identity/properties');

const getPropertyJobs = (propertyId: string) =>
  http.get<Job[]>(`/api/identity/properties/${propertyId}/jobs`);

export default {
  getProperties,
  getPropertyJobs,
};
