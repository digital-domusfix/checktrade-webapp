import http from '../api/httpClient';

export interface ProfileSetupData {
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  postalCode?: string;
}

const updateProfile = (data: ProfileSetupData) =>
  http.post('/api/identity/profile', { userId: data.userId, ...data });

export interface BusinessProfileData {
  userId: string;
  businessName?: string;
  tradeCategory: string;
  subcategories: string[];
  yearsExperience?: number;
  city: string;
  postalCode?: string;
  travelRadius: number;
}

const completeOnboarding = (data: BusinessProfileData) =>
  http.post('/api/identity/onboarding', data);

export default { updateProfile, completeOnboarding };
