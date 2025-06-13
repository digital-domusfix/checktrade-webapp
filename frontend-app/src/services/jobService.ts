import http from '../api/httpClient';


export interface JobAnswerDto{
  questionId: string,
  answer: string
}

export interface JobAttachmentDto{
  id: string,
  url: string,
  contentType: string
}

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
  attachments?: JobAttachmentDto[]
  answers?: JobAnswerDto[]
}

export const createJob = (data: CreateJobRequest) =>
  http.post('/api/lead-gen/jobs', data);

export const createJobDraft = (data: unknown, token?: string) =>
  http.post<{ token: string }>('/api/lead-gen/jobs/draft', data, {
    headers: token ? { 'Auto-Save-Token': token } : undefined,
  });

export const convertJobDraft = (token: string) =>
  http.post('/api/lead-gen/jobs/draft/convert', undefined, {
    headers: { 'Auto-Save-Token': token },
  });

export interface JobCategoryId {
  value: string;
}

export interface JobSubcategoryId {
  value: string;
}
export interface JobCategory {
  id: JobCategoryId;
  name: string;
  code: string               
}

export interface JobCategories {
  categories: JobCategory[];
}
export interface JobSubcategory {
  id: JobSubcategoryId;
  name: string;
  code: string;
  categoryId?: string;
}

export interface JobSubcategoryQuestion {
  id: string;
  questionText: string;
  type: 'text' | 'yes_no' | 'dropdown';
  isRequired: boolean;
  options?: string[];
}

export const getJobCategories = () =>
  http.get<JobCategories>('/api/job-categories');

export const getJobSubcategories = (categoryId: string) =>
  http.get<JobSubcategory[]>(`/api/job-categories/${categoryId}/subcategories`);

export const getJobSubcategoryForm = (id: string) =>
  http.get(`/api/job-subcategories/${id}/form`);

export const getJobsForProperty = (propertyId: string) =>
  http.get(`/api/identity/properties/${propertyId}/jobs`);

export const getSubcategoryQuestions = async (
  subcategoryId: string
): Promise<JobSubcategoryQuestion[]> => {
  const res = await http.get(`/api/job-subcategories/${subcategoryId}/questions`)
  return res.data as JobSubcategoryQuestion[]
}

export default {
  createJob,
  createJobDraft,
  convertJobDraft,
  getJobCategories,
  getJobSubcategories,
  getJobSubcategoryForm,
  getJobsForProperty,
  getSubcategoryQuestions
};
