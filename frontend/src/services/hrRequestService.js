import api from './api';

export const hrRequestService = {
  createRequest: async (requestData) => {
    const response = await api.post('/hr-requests', requestData);
    return response.data;
  },

  getHRRequests: async (params = {}) => {
    const response = await api.get('/hr-requests/hr/all', { params });
    return response.data;
  },

  getHRRequestById: async (id) => {
    const response = await api.get(`/hr-requests/hr/${id}`);
    return response.data;
  },

  getAllRequests: async (params = {}) => {
    const response = await api.get('/hr-requests/admin/all', { params });
    return response.data;
  },

  getRequestById: async (id) => {
    const response = await api.get(`/hr-requests/admin/${id}`);
    return response.data;
  },

  processRequest: async (id, processData) => {
    const response = await api.put(`/hr-requests/admin/${id}/process`, processData);
    return response.data;
  }
};

