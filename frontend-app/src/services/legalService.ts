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

export interface SubmitResult {
  status: 'approved' | 'pending';
}

const submitCredentials = async (
  payload: SubmitPayload,
): Promise<SubmitResult> => {
  await new Promise((res) => setTimeout(res, 300));
  await http.post('/api/identity/legal', payload);
  // Simulate approval decision from backend
  return { status: Math.random() < 0.5 ? 'approved' : 'pending' };
};

export default { uploadDocument, submitCredentials };
