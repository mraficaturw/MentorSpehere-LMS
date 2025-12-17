import apiClient from './client';

export const coursesAPI = {
  getAll: async () => {
    const response = await apiClient.get('/courses');
    return response.data.data;
  },

  getById: async (courseId) => {
    const response = await apiClient.get(`/courses/${courseId}`);
    return response.data.data;
  },

  getModules: async (courseId) => {
    const response = await apiClient.get(`/courses/${courseId}/modules`);
    return response.data.data;
  },

  updateModuleStatus: async (courseId, moduleId, status, score = null) => {
    const response = await apiClient.put(`/courses/${courseId}/modules/${moduleId}`, {
      status,
      score
    });
    return response.data.data;
  },

  getQuizSummary: async (courseId) => {
    const response = await apiClient.get(`/courses/${courseId}/quiz-summary`);
    return response.data.data;
  },
};

export default coursesAPI;
