import apiClient from './client';

export const studentAPI = {
  getDashboard: async () => {
    const response = await apiClient.get('/student/dashboard');
    return response.data.data;
  },

  getCourses: async () => {
    const response = await apiClient.get('/student/courses');
    return response.data.data;
  },

  getActivity: async () => {
    const response = await apiClient.get('/student/activity');
    return response.data.data;
  },
};

export default studentAPI;
