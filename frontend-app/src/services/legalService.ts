import http from '../api/httpClient';

export interface UploadResult {
  id: string;
}

const uploadDocument = async (file: File): Promise<UploadResult> => {
  void file;
  // In a real app we'd POST multipart/form-data
  // Here we simulate a short delay and return a fake id
  await new Promise((res) => setTimeout(res, 300));
  return { id: crypto.randomUUID() };
};

interface SubmitPayload {
  insuranceId: string;
  businessId?: string;
  govId: string;
  soleTrader: boolean;
}

const submitCredentials = async (payload: SubmitPayload) => {
  await new Promise((res) => setTimeout(res, 300));
  return http.post('/api/identity/legal', payload);
};

export default { uploadDocument, submitCredentials };
