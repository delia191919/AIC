import api from './api';

const conditionsService = {
    getAll: async () => {
        const response = await api.get('/conditions');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/conditions/${id}`);
        return response.data;
    },
    search: async (params) => {
        const response = await api.get('/conditions/search', { params });
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/conditions', data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/conditions/${id}`);
        return response.data;
    }
};

export default conditionsService;
