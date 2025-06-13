import axios from 'axios';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://localhost:44368',
  withCredentials: true,
});

// Inject token from localStorage
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
http.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      console.warn('Unauthorized – logging out');
      import('../store/useAuthStore').then((mod) => {
        mod.useAuthStore.getState().logout();
      });
    }
    return Promise.reject(err);
  }
);

export default http;
