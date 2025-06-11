import * as identityApi from '@/api/identityApi';

export const AuthService = {
  register: identityApi.registerUser,
  verifyOtp: identityApi.verifyOtp,
  resendOtp: identityApi.resendOtp,
  getProfile: identityApi.getMyProfile,
};
