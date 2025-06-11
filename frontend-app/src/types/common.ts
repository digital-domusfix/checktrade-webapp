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
