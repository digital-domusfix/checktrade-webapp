import { MyProfileDto } from '../types/common';
import { create } from 'zustand';
import {
  RegisterRequest,
  VerifyOtpRequest,
  ResendOtpRequest,
  registerUser,
  verifyOtp,
  resendOtp,
  getMyProfile,
} from '../api/identityApi';

type AuthState = {
  profile: MyProfileDto | null;
  loading: boolean;
  error?: string;

  register: (req: RegisterRequest) => Promise<string>;
  verify: (req: VerifyOtpRequest) => Promise<void>;
  resend: (req: ResendOtpRequest) => Promise<void>;
  fetchProfile: () => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  profile: null,
  loading: false,
  error: undefined,

register: async (req) => {
  try {
    set({ loading: true });
    const { data } = await registerUser(req);
    return data.userId; // 👈 Bubble this up
  } catch (err: any) {
    set({ error: err.message });
    throw err; // 👈 Re-throw if caller needs to handle
  } finally {
    set({ loading: false });
  }
},

  verify: async (req) => {
    try {
      set({ loading: true });
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
      set({ loading: true });
      await resendOtp(req);
    } catch (err: any) {
      set({ error: err.message });
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
    // Clear token/cookie if needed
    set({ profile: null });
  },
}));
