  import axios from 'axios';

  // Environment batti Base URL pick chestundi
  // src/api/api.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Automatic switch!

  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request Interceptor: Token emaina unte automatic ga add chestundi (Future kosam)
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  export default api;