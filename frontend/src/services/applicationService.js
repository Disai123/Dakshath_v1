import api from './api';

export const applicationService = {
  applyToJob: async (applicationData) => {
    console.log('applicationService.applyToJob called with:', applicationData);
    try {
      const response = await api.post('/applications', applicationData);
      console.log('API response:', response);
      return response.data;
    } catch (error) {
      console.error('API error in applyToJob:', error);
      throw error;
    }
  },

  getStudentApplications: async (params = {}) => {
    const response = await api.get('/applications/student/all', { params });
    return response.data;
  },

  getApplicationById: async (id) => {
    const response = await api.get(`/applications/student/${id}`);
    return response.data;
  },

  getCompanyApplications: async (params = {}) => {
    const response = await api.get('/applications/hr/all', { params });
    return response.data;
  },

  getJobApplications: async (jobId, params = {}) => {
    const response = await api.get(`/applications/hr/job/${jobId}`, { params });
    return response.data;
  },

  updateApplicationStatus: async (id, statusData) => {
    const response = await api.put(`/applications/hr/${id}/status`, statusData);
    return response.data;
  }
};

