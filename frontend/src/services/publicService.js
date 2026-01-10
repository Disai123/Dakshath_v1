import api from './api';

export const publicService = {
    getTopStudents: async (limit = 10) => {
        const response = await api.get('/public/top-students', { params: { limit } });
        return response.data;
    }
};
