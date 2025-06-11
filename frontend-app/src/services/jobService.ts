import http from '../api/httpClient';

export interface CreateJobRequest {
  customerProfileId: string;
  propertyId: string;
  categoryId: string;
  subcategoryId: string;
  title?: string;
  description?: string;
  preferredStartDate?: string;
  urgency?: string;
  budget?: {
    min?: number;
    max?: number;
  };
  alternateAddress?: {
    line1?: string;
    line2?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    country?: string;
  };
}

export const createJob = (data: CreateJobRequest) =>
  http.post('/api/lead-gen/jobs', data);

export const createJobDraft = (
  data: unknown,
  token?: string,
) =>
  http.post<{ token: string }>('/api/lead-gen/jobs/draft', data, {
    headers: token ? { 'Auto-Save-Token': token } : undefined,
  });

export const convertJobDraft = (token: string) =>
  http.post('/api/lead-gen/jobs/draft/convert', undefined, {
    headers: { 'Auto-Save-Token': token },
  });

export interface JobCategory {
  id: string;
  name: string;
}

export interface JobSubcategory {
  id: string;
  name: string;
  categoryId?: string;
}

export const getJobCategories = () =>
  http.get<JobCategory[]>('/api/job-categories');

export const getJobSubcategories = (categoryId: string) =>
  http.get<JobSubcategory[]>(`/api/job-categories/${categoryId}/subcategories`);

export const getJobSubcategoryForm = (id: string) =>
  http.get(`/api/job-subcategories/${id}/form`);

export default {
  createJob,
  createJobDraft,
  convertJobDraft,
  getJobCategories,
  getJobSubcategories,
  getJobSubcategoryForm,
};
