import api from './client';

export const loginAPI = (email, password) =>
  api.post('/auth/login', { email, password }).then((res) => res.data);

export const signupAPI = (payload) =>
  api.post('/auth/signup', payload).then((res) => res.data);

export const verifyOTPAPI = (email, code) =>
  api.post('/auth/verify', { email, code }).then((res) => res.data);

export const resendOTPAPI = (email) =>
  api.post('/auth/resend-otp', { email }).then((res) => res.data);

export const forgotPasswordAPI = (email) =>
  api.post('/auth/forgot-password', { identifier: email }).then((res) => res.data);
