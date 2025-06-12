import * as identityApi from '../api/identityApi';

export const AuthService = {
  registerCustomer: identityApi.registerCustomer,
  registerContractor: identityApi.registerContractor,
  verifyOtp: identityApi.verifyOtp,
  resendOtp: identityApi.resendOtp,
  getProfile: identityApi.getMyProfile,
  login: identityApi.login,
}