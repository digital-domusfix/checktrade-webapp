import http from './httpClient';

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface VerifyOtpRequest {
  userId: string;
  emailOtp?: string;
  mobileOtp?: string;
}

export interface ResendOtpRequest {
  userId: string;
}

export interface LoginRequest {
  login: string;
  password: string;
}

export const registerUser = (data: RegisterRequest) =>
  http.post<{ userId: string }>('/api/identity/register', data);

export const verifyOtp = (data: VerifyOtpRequest) =>
  http.post('/api/identity/verify-otp', data);

export const resendOtp = (data: ResendOtpRequest) =>
  http.post('/api/identity/resend-otp', data);

export const getMyProfile = () => http.get('/api/identity/me');

export const login = (data: LoginRequest) =>
  http.post('/api/identity/login', data);
