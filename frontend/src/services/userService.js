import apiClient from './apiClient';

export const userService = {
  // Get user profile
  getProfile: async () => {
    return apiClient.get('/users/profile');
  },

  // Update wallet address
  updateWalletAddress: async (walletAddress) => {
    return apiClient.post('/users/wallet', { walletAddress });
  },

  // Update user profile
  updateProfile: async (data) => {
    return apiClient.put('/users/profile', data);
  },

  // Change password
  changePassword: async (oldPassword, newPassword) => {
    return apiClient.post('/users/change-password', {
      oldPassword,
      newPassword,
    });
  },

  // Get user settings
  getSettings: async () => {
    return apiClient.get('/users/settings');
  },

  // Update user settings
  updateSettings: async (settings) => {
    return apiClient.put('/users/settings', settings);
  },

  // Verify email
  verifyEmail: async (code) => {
    return apiClient.post('/users/verify-email', { code });
  },

  // Request email change
  requestEmailChange: async (newEmail) => {
    return apiClient.post('/users/request-email-change', { newEmail });
  },

  // Get all users (admin only)
  getUsers: async () => {
    return apiClient.get('/admin/users');
  },
};
