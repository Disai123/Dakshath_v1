import api from './api';

export const jobService = {
  getAllJobs: async (params = {}) => {
    const response = await api.get('/jobs', { params });
    return response.data;
  },

  getJobById: async (id) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  searchJobs: async (params = {}) => {
    const response = await api.get('/jobs/search', { params });
    return response.data;
  },

  getQualifiedJobs: async (params = {}) => {
    const response = await api.get('/jobs/qualified', { params });
    return response.data;
  },

  createJob: async (jobData) => {
    const response = await api.post('/jobs', jobData);
    return response.data;
  },

  updateJob: async (id, jobData) => {
    const response = await api.put(`/jobs/${id}`, jobData);
    return response.data;
  },

  deleteJob: async (id) => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  },

  getCompanyJobs: async (params = {}) => {
    const response = await api.get('/jobs/company/all', { params });
    return response.data;
  }
};

