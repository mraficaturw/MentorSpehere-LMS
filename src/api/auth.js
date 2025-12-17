import apiClient from './client';

export const authAPI = {
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    // Backend wraps response in {success, data: {...}} format
    const { user, token } = response.data.data;

    // Store token
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return { user, token };
  },

  register: async (name, email, password, role = 'student') => {
    const response = await apiClient.post('/auth/register', {
      name,
      email,
      password,
      role
    });
    // Backend wraps response in {success, data: {...}} format
    const { user, token } = response.data.data;

    // Store token
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    return { user, token };
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      // Always clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return { success: true };
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};

export default authAPI;
