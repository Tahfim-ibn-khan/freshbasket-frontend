import axios from 'axios';

const api = axios.create({
  baseURL: 'https://web-production-aec8.up.railway.app/', // ✅ Ensure this matches the backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") { // ✅ Prevents SSR errors
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
