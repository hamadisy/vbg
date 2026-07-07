import axios from 'axios';

export const AUTH_TOKEN_STORAGE_KEY = 'vbg_auth_token';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api',
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// No refresh-token flow on the backend (single 8h token) - on 401, clear the
// stale token and bounce to /login rather than trying to silently recover.
apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error instanceof Error ? error : new Error(String(error)));
  },
);
