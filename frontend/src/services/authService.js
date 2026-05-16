import apiClient from './apiClient';

export const authService = {
  // Login with email and password
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', { email, password });
    // response is already response.data from apiClient interceptor
    // response = { token, user }
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    return response; // return full object with { token, user }
  },

  // Register new user
  register: async (email, password, fullName) => {
    const response = await apiClient.post('/auth/register', {
      email,
      password,
      fullName,
    });
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    return response; // return full object with { token, user }
  },

  // Login with MetaMask
  loginWithWeb3: async (walletAddress, signature) => {
    const response = await apiClient.post('/auth/web3-login', {
      walletAddress,
      signature,
    });
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    return response; // return full object with { token, user }
  },

  // Get current user
  getCurrentUser: async () => {
    return apiClient.get('/auth/me');
  },

  // Logout
  logout: async () => {
    localStorage.removeItem('token');
    return apiClient.post('/auth/logout');
  },

  // Refresh token
  refreshToken: async () => {
    const response = await apiClient.post('/auth/refresh');
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    return response;
  },
};
