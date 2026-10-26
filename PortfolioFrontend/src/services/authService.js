import apiClient from './api.js';

export const authService = {
  async login(email, password) {
    const response = await apiClient.post('/auth/login', { email, password });
    if (response?.data?.token) {
      localStorage.setItem('portfolio_admin_token', response.data.token);
    }
    return response;
  },

  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      localStorage.removeItem('portfolio_admin_token');
    }
  },

  async getMe() {
    return await apiClient.get('/auth/me');
  },

  async changePassword(currentPassword, newPassword) {
    return await apiClient.put('/auth/change-password', {
      currentPassword,
      newPassword,
    });
  },
};

export default authService;
