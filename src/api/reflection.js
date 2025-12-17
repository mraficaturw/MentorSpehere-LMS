import apiClient from './client';

export const reflectionAPI = {
  getReflection: async () => {
    const response = await apiClient.get('/reflections');
    return response.data.data;
  },

  generateReflection: async () => {
    const response = await apiClient.post('/reflections/generate');
    return response.data.data;
  },

  getDailyReflection: async (date) => {
    const response = await apiClient.get('/reflections/daily', {
      params: { date }
    });
    return response.data.data;
  },

  getWeeklyInsight: async (weekNumber) => {
    const response = await apiClient.get('/reflections/weekly', {
      params: { week: weekNumber }
    });
    return response.data.data;
  },

  getLearningPath: async () => {
    const response = await apiClient.get('/reflections/learning-path');
    return response.data.data;
  },

  getRiskAssessment: async () => {
    const response = await apiClient.get('/reflections/risk-assessment');
    return response.data.data;
  },
};

export default reflectionAPI;
