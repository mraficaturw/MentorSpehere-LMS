import apiClient from './client';

const userAPI = {
    getProfile: async () => {
        const response = await apiClient.get('/user/profile');
        return response.data.data;
    },

    updateProfile: async (data) => {
        const response = await apiClient.put('/user/profile', data);
        return response.data.data;
    },

    updateAvatar: async (avatarUrl) => {
        const response = await apiClient.put('/user/avatar', { avatarUrl });
        return response.data.data;
    },

    getSettings: async () => {
        const response = await apiClient.get('/user/settings');
        return response.data.data;
    },

    updateSettings: async (section, data) => {
        const response = await apiClient.put(`/user/settings/${section}`, data);
        return response.data.data;
    },

    changePassword: async (currentPassword, newPassword) => {
        const response = await apiClient.put('/user/password', {
            currentPassword,
            newPassword
        });
        return response.data;
    },

    deleteAccount: async (password) => {
        const response = await apiClient.delete('/user/', {
            data: { password }
        });
        return response.data;
    },
};

export default userAPI;
