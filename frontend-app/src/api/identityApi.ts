import http from './httpClient';
import { AppConfig } from '../config'

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

// identityApi.ts
export interface ExternalLoginRequest {
  provider: 'google' | 'apple';
  idToken: string;
  tenantId: string;
}

export interface RegisterCustomerRequest {
  firstName?: string
  lastName?: string
  mobile?: string
  email?: string
  password?: string
  preferredLanguage?: string
  referralSource?: string
  acceptedTerms?: boolean
  marketingOptIn?: boolean
  tenantId?: string
}

export interface RegisterContractorRequest {
  firstName?: string
  lastName?: string
  mobile?: string
  email?: string
  password?: string
  preferredLanguage?: string
  referralSource?: string
  bio?: string
  license?: any // define from OpenAPI
  insurance?: any
  contact?: any
  preferences?: any
  isCompanyOwner: boolean
  tenantId: string
}
const getTenantId = (): string => {
  return  import.meta.env.VITE_TENANT_ID || '00000000-0000-0000-0000-000000000001';
};

// New endpoints
export const registerCustomer = (data: RegisterCustomerRequest) =>
  http.post<{ userId: string }>('/api/identity/register/customer', {
  ...data,
  tenantId: AppConfig.tenantId,
})

export const registerContractor = (data: RegisterContractorRequest) =>
  http.post<{ userId: string }>('/api/identity/register/contractor', {
  ...data,
  tenantId: AppConfig.tenantId,
})


// identityApi.ts
export const verifyOtp = async (data: VerifyOtpRequest) => {
  const res = await http.post('/api/identity/verify-otp', data)
  return res.data // this should contain a token
}

export const resendOtp = (data: ResendOtpRequest) =>
  http.post('/api/identity/resend-otp', data);

export const getMyProfile = () => http.get('/api/identity/me');

export const login = (data: LoginRequest) =>
  http.post('/api/identity/login', data);

export const externalLogin = (data: ExternalLoginRequest) =>
  http.post<{ token: string }>('/api/identity/external-login', data);
