import axios from 'axios';
import { getToken } from '../utils/token';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = getToken();                 // localStorage helper
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;