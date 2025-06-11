import http from '../api/httpClient';

export interface DraftJobRequest {
  category: string;
  subcategory?: string;
  answers?: Record<string, string>;
  notes?: string;
  postcode: string;
  date: string;
  email: string;
  phone: string;
}

const createJobDraft = (data: DraftJobRequest) =>
  http.post<{ token: string }>('/api/lead-gen/jobs/draft', data);

export const LeadGenService = {
  createJobDraft,
};
