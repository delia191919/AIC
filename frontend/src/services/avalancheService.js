import api from './api';

const avalancheService = {
    getAll: async (params) => {
        const response = await api.get('/avalanches', { params });
        return response.data;
    },

    getValidated: async (params) => {
        const response = await api.get('/avalanches/validated', { params });
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

    uploadImages: async (id, files) => {
        const formData = new FormData();
        Array.from(files).forEach((file) => {
            formData.append('files', file);
        });
        
        const response = await api.post(`/avalanches/${id}/images`, formData);
        return response.data;
    },

    validate: async (id) => {
        const response = await api.put(`/avalanches/${id}/validate`);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/avalanches/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/avalanches/${id}`);
        return response.data;
    },

    deleteImage: async (id, imageUrl) => {
        const response = await api.delete(`/avalanches/${id}/images`, { params: { imageUrl } });
        return response.data;
    }
};

export default avalancheService;
