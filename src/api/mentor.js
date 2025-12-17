import apiClient from './client';

export const mentorAPI = {
  getDashboard: async () => {
    const response = await apiClient.get('/mentor/dashboard');
    return response.data.data;
  },

  getStudents: async () => {
    const response = await apiClient.get('/mentor/students');
    return response.data.data;
  },

  getStudentDetail: async (studentId) => {
    const response = await apiClient.get(`/mentor/students/${studentId}`);
    return response.data.data;
  },

  createIntervention: async (data) => {
    const response = await apiClient.post('/mentor/interventions', data);
    return response.data.data;
  },

  getInterventions: async () => {
    const response = await apiClient.get('/mentor/interventions');
    return response.data.data;
  },

  updateInterventionStatus: async (interventionId, status, response = null) => {
    const res = await apiClient.put(`/mentor/interventions/${interventionId}`, {
      status,
      response
    });
    return res.data.data;
  },

  getNotifications: async () => {
    const response = await apiClient.get('/mentor/notifications');
    return response.data.data;
  },

  markNotificationRead: async (notificationId) => {
    const response = await apiClient.put(`/mentor/notifications/${notificationId}/read`);
    return response.data.data;
  },
};

export default mentorAPI;
