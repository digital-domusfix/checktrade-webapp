import axios from 'axios';

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://localhost:44368',
  withCredentials: true, // Required for cookie-based auth
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized – consider triggering logout or refresh');
      // Optional: trigger logout
    }
    return Promise.reject(error);
  },
);

export default httpClient;
