import http from './httpClient';

export interface RegisterRequest {
  login: string;
  userType: string;
  tenantId: string;
  mobile?: string;
  email?: string;
  preferredLanguage? : string;
  referralSource? : string
}

export interface VerifyOtpRequest {
  userId: string;
  emailOtp?: string;
  mobileOtp?: string;
}

export interface ResendOtpRequest {
  userId: string;
}

export const registerUser = (data: RegisterRequest) =>
  http.post<{ userId: string }>('/api/identity/register', data);

export const verifyOtp = (data: VerifyOtpRequest) =>
  http.post('/api/identity/verify-otp', data);

export const resendOtp = (data: ResendOtpRequest) =>
  http.post('/api/identity/resend-otp', data);

export const getMyProfile = () => http.get('/api/identity/me');
