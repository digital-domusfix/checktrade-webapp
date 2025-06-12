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
  login as loginRequest,
} from '../api/identityApi';
import { MyProfileDto } from '../types/common';
import { AppConfig } from '../config';

type AuthState = {
  profile: MyProfileDto | null;
  loading: boolean;
  error?: string;
  token: string | null;

  registerCustomer: (req: Omit<RegisterCustomerRequest, 'tenantId'>) => Promise<string>;
  registerContractor: (req: Omit<RegisterContractorRequest, 'tenantId'>) => Promise<string>;

  verify: (req: VerifyOtpRequest) => Promise<void>;
  resend: (req: ResendOtpRequest) => Promise<void>;
  login: (req: LoginRequest) => Promise<void>;
  fetchProfile: () => Promise<void>;
  logout: () => void;
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
      await verifyOtp(req);
      await useAuthStore.getState().fetchProfile();
    } catch (err: any) {
      set({ error: err.message });
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
      const { data } = await loginRequest(req);
      if (data && (data as any).token) {
        set({ token: (data as any).token });
      }
      await useAuthStore.getState().fetchProfile();
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    } finally {
      set({ loading: false });
    }
  },

  fetchProfile: async () => {
    try {
      const { data } = await getMyProfile();
      set({ profile: data });
    } catch {
      set({ profile: null });
    }
  },

  logout: () => {
    set({ profile: null, token: null });
  },
}));
