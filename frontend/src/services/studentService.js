import api from './api';

export const studentService = {
  getProfile: async (id = null) => {
    const endpoint = id ? `/students/${id}/profile` : '/students/profile';
    const response = await api.get(endpoint);
    return response.data;
  },

  getScore: async (id = null) => {
    const endpoint = id ? `/students/${id}/score` : '/students/score';
    const response = await api.get(endpoint);
    return response.data;
  },

  getCourses: async (id = null) => {
    const endpoint = id ? `/students/${id}/courses` : '/students/courses';
    const response = await api.get(endpoint);
    return response.data;
  },

  getCertificates: async (id = null) => {
    const endpoint = id ? `/students/${id}/certificates` : '/students/certificates';
    const response = await api.get(endpoint);
    return response.data;
  }
};

