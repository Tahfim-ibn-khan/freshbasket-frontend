import axios from 'axios';

const api = axios.create({
  baseURL: 'https://web-production-aec8.up.railway.app',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") { 
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    console.log("API Response:", response);
    return response;
  },
  (error) => {
    console.error("API Error:", error.response);
    return Promise.reject(error);
  }
);

export default api;
