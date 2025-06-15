export type Nullable<T> = T | null;
export type ApiResponse<T> = { data: T; success: boolean; error?: string };
export interface MyProfileDto {
  userId: string;
  fullName?: string;
  email?: string;
  phone?: string;
  roles?: string[];
  type?: string;
  isOnboarded: boolean;
  onboardingStatus?: string;
  referralSource?: string;
  isActive: boolean;
}

export interface PropertyDto {
  id: string;
  nickname?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    country?: string;
  };
  contact?: {
    name?: string;
    email?: string;
    phone?: string;
  };
}

export interface JobDto {
  id: string;
  title?: string;
  status?: string;
  quoteStatus?: string;
}

export interface PropertyWithStats {
  id: string;
  nickname?: string;
  address: {
    line1: string;
    city: string;
    province: string;
  };
  primaryContact?: {
    fullName: string;
    phone: string;
  };
  stats: {
    total: number;
    open: number;
    quoted: number;
    assigned: number;
    completed: number;
  };
}
