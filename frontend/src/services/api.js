import axios from 'axios';
import { API_URL } from '../utils/constants';

// Ensure API_URL doesn't end with a slash or have double /api
const getBaseURL = (url) => {
  if (!url) return 'http://localhost:5001/api';
  // Remove trailing slashes
  let baseUrl = url.replace(/\/+$/, '');
  // If the user's environment variable has double /api, fix it
  if (baseUrl.endsWith('/api/api')) {
    baseUrl = baseUrl.replace(/\/api\/api$/, '/api');
  }
  return baseUrl;
};

const api = axios.create({
  baseURL: getBaseURL(API_URL),
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

