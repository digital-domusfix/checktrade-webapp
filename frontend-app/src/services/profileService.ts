import http from '../api/httpClient';

export interface ProfileSetupData {
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  postalCode?: string;
}

const updateProfile = (data: ProfileSetupData) =>
  http.post('/api/identity/profile', data);

export default { updateProfile };
