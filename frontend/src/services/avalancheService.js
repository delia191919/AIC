import api from './api';

const avalancheService = {
    getAll: async () => {
        const response = await api.get('/avalanches');
        return response.data;
    },

    getValidated: async () => {
        const response = await api.get('/avalanches/validated');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/avalanches/${id}`);
        return response.data;
    },
    search: async (params) => {
        const response = await api.get('/avalanches/search', { params });
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/avalanches', data);
        return response.data;
    },

    validate: async (id) => {
        const response = await api.put(`/avalanches/${id}/validate`);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/avalanches/${id}`);
        return response.data;
    }
};

export default avalancheService;
