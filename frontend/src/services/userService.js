import api from './api';

const userService = {
    getAll: async () => {
        const response = await api.get('/users');
        return response.data;
    },
    updateRole: async (userId, roleName) => {
        const response = await api.put(`/users/${userId}/role`, { roleName });
        return response.data;
    },
    delete: async (userId) => {
        await api.delete(`/users/${userId}`);
    }
};

export default userService;
