import api from './api';
import { API_URL } from '../utils/constants';

export const authService = {
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data.data;
  },

  // Student login (email/password or Google)
  studentLogin: async (email, password) => {
    if (email && password) {
      const response = await api.post('/auth/login/student', { email, password });
      return response.data;
    } else {
      // Redirect to Google OAuth
      window.location.href = `${API_URL}/auth/google`;
    }
  },

  // HR login (email/password)
  hrLogin: async (email, password) => {
    const response = await api.post('/auth/login/hr', { email, password });
    return response.data;
  },

  // Admin login (email/password)
  adminLogin: async (email, password) => {
    const response = await api.post('/auth/login/admin', { email, password });
    return response.data;
  },

  // Google OAuth (for students)
  googleLogin: () => {
    window.location.href = `${API_URL}/auth/google`;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
  },

  setToken: (token) => {
    localStorage.setItem('token', token);
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  getUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

