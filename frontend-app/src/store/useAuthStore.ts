// src/store/useAuthStore.ts
import { create } from 'zustand';
import {
  RegisterCustomerRequest,
  RegisterContractorRequest,
  VerifyOtpRequest,
  ResendOtpRequest,
  LoginRequest,
  registerCustomer as registerCustomerApi,
  registerContractor as registerContractorApi,
  verifyOtp,
  resendOtp,
  getMyProfile,
  login,
  externalLogin,
  sendOtp as sendOtpApi,
  sendLoginOtp,
  verifyLoginOtp as verifyLoginOtpApi,
  SendLoginOtpResult,
} from '../api/identityApi';
import { MyProfileDto } from '../types/common';
import { AppConfig } from '../config';
import http from '../api/httpClient';

type AuthState = {
  profile: MyProfileDto | null;
  loading: boolean;
  error?: string;
  token: string | null;

  registerCustomer: (req: Omit<RegisterCustomerRequest, 'tenantId'>) => Promise<string>;
  registerContractor: (req: Omit<RegisterContractorRequest, 'tenantId'>) => Promise<string>;

  verify: (req: VerifyOtpRequest) => Promise<void>;
  resend: (req: ResendOtpRequest) => Promise<void>;
  login: (req: LoginRequest & { method?: string }) => Promise<void>;
  externalLogin: (provider: 'google' | 'apple', idToken: string) => Promise<void>;
  sendOtp: (req: { mobile?: string; email?: string; tenantId: string }) => Promise<void>;
  fetchProfile: () => Promise<void>;
  logout: () => void;
  sendLoginOtp: (data: { mobile: string }) => Promise<SendLoginOtpResult>;
  verifyLoginOtp: (data: { login: string; otp: string; tenantId: string }) => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  profile: null,
  loading: false,
  error: undefined,
  token: null,

  registerCustomer: async (req) => {
    try {
      set({ loading: true, error: undefined });
      const { data } = await registerCustomerApi({
        ...req,
        tenantId: AppConfig.tenantId,
      });
      return data.userId;
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  registerContractor: async (req) => {
    try {
      set({ loading: true, error: undefined });
      const { data } = await registerContractorApi({
        ...req,
        tenantId: AppConfig.tenantId,
      });
      return data.userId;
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  verify: async (req) => {
    try {
      set({ loading: true, error: undefined });
      const { token } = await verifyOtp(req);
      set({ token });
      localStorage.setItem('accessToken', token);
      http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      await useAuthStore.getState().fetchProfile();
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  resend: async (req) => {
    try {
      set({ loading: true, error: undefined });
      await resendOtp(req);
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  login: async (req) => {
    try {
      set({ loading: true, error: undefined });
      const { data } = await login(req);
      if (data?.token) {
        set({ token: data.token });
        localStorage.setItem('accessToken', data.token);
        http.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      }
      await useAuthStore.getState().fetchProfile();
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  externalLogin: async (provider, idToken) => {
    try {
      set({ loading: true, error: undefined });
      const { data } = await externalLogin({ provider, idToken, tenantId: AppConfig.tenantId });
      if (data?.token) {
        set({ token: data.token });
        localStorage.setItem('accessToken', data.token);
        http.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      }
      await useAuthStore.getState().fetchProfile();
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

sendOtp: async ({ mobile, email, tenantId }) => {
  try {
    set({ loading: true, error: undefined });
    await sendOtpApi({ mobile, email, tenantId });
  } catch (err: any) {
    set({ error: err.message });
    throw err;
  } finally {
    set({ loading: false });
  }
},
  fetchProfile: async () => {
    const { data } = await getMyProfile();
    set({ profile: data });
  },

  sendLoginOtp: async ({ mobile }) => {
  const { data } = await sendLoginOtp({ mobile });
  return { userId: data.userId, tenantId: data.tenantId };  
},

verifyLoginOtp: async ({ login, otp, tenantId }) => {
  const { data } = await verifyLoginOtpApi({ login, otp, tenantId });
  localStorage.setItem('accessToken', data.token);
  http.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
  set({ token: data.token });
  await useAuthStore.getState().fetchProfile();
},

  logout: () => {
    set({ profile: null, token: null });
    localStorage.removeItem('accessToken');
    delete http.defaults.headers.common['Authorization'];
  },
}));

export const useAuth = () => useAuthStore((state) => state);