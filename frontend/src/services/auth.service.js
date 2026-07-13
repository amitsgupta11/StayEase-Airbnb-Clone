import api from "./api.js";
export const authService = {
  register:       (data) => api.post("/auth/register", data),
  login:          (data) => api.post("/auth/login", data),
  logout:         ()     => api.post("/auth/logout"),
  forgotPassword: (data) => api.post("/auth/forgot-password", data),
  resetPassword:  (token, data) => api.put(`/auth/reset-password/${token}`, data),
  verifyEmail:    (token) => api.get(`/auth/verify-email/${token}`),
};
