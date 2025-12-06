import api from './api';

export const companyService = {
  // Public registration (no auth required)
  registerCompany: async (companyData) => {
    const response = await api.post('/companies/register', companyData);
    return response.data;
  },

  getCompanyProfile: async (id = null) => {
    const endpoint = id ? `/companies/admin/${id}` : '/companies/hr/profile';
    const response = await api.get(endpoint);
    return response.data;
  },

  updateCompanyProfile: async (companyData) => {
    const response = await api.put('/companies/hr/profile', companyData);
    return response.data;
  },

  getAllCompanies: async (params = {}) => {
    const response = await api.get('/companies/admin/all', { params });
    return response.data;
  },

  getPendingCompanies: async () => {
    const response = await api.get('/companies/admin/pending');
    return response.data;
  },

  approveCompany: async (id) => {
    const response = await api.post(`/companies/admin/${id}/approve`);
    return response.data;
  },

  rejectCompany: async (id, rejectionReason) => {
    const response = await api.post(`/companies/admin/${id}/reject`, { rejection_reason: rejectionReason });
    return response.data;
  }
};

