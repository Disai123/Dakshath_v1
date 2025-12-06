import api from './api';

export const hrService = {
  getDashboard: async () => {
    const response = await api.get('/hr/dashboard');
    return response.data;
  }
};

