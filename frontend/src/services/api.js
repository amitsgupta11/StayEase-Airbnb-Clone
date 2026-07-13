import axios from "axios";
import { store } from "../redux/store.js";
import { updateToken, logout } from "../redux/slices/authSlice.js";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  withCredentials: true,
  timeout: 15000,
});

// Request interceptor — attach access token
api.interceptors.request.use((config) => {
  const { auth } = store.getState();
  if (auth.accessToken) config.headers.Authorization = `Bearer ${auth.accessToken}`;
  return config;
}, Promise.reject);

// Response interceptor — handle token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(p => error ? p.reject(error) : p.resolve(token));
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const { data } = await axios.post("/api/auth/refresh-token", {}, { withCredentials: true });
        const newToken = data.data.accessToken;
        store.dispatch(updateToken(newToken));
        processQueue(null, newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch {
        processQueue(new Error("Session expired"), null);
        store.dispatch(logout());
        window.location.href = "/login";
        return Promise.reject(error);
      } finally { isRefreshing = false; }
    }
    return Promise.reject(error);
  }
);

export default api;
