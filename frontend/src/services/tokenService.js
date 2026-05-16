import apiClient from './apiClient';

export const tokenService = {
  // Get token balance
  getBalance: async () => {
    return apiClient.get('/tokens/balance');
  },

  // Get token info
  getTokenInfo: async () => {
    return apiClient.get('/tokens/info');
  },

  // Mint tokens
  mint: async (amount) => {
    return apiClient.post('/tokens/mint', { amount });
  },

  // Burn tokens
  burn: async (amount, reason) => {
    return apiClient.post('/tokens/burn', { amount, reason });
  },

  // Get vault balance
  getVaultBalance: async () => {
    return apiClient.get('/tokens/vault-balance');
  },

  // Get transaction history
  getTransactionHistory: async (page = 1, limit = 10) => {
    return apiClient.get('/tokens/history', {
      params: { page, limit },
    });
  },

  // Get user's burn requests
  getUserBurnRequests: async () => {
    return apiClient.get('/tokens/burn-requests/my');
  },

  // Get burn requests (admin only)
  getBurnRequests: async () => {
    return apiClient.get('/admin/burn-requests');
  },

  // Approve burn request (admin only)
  approveBurnRequest: async (burnRequestId) => {
    return apiClient.post(`/admin/burn-requests/${burnRequestId}/approve`);
  },

  // Reject burn request (admin only)
  rejectBurnRequest: async (burnRequestId, reason) => {
    return apiClient.post(`/admin/burn-requests/${burnRequestId}/reject`, { reason });
  },
};
