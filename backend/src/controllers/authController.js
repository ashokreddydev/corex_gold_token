import * as authService from '../services/authService.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    const { email, password, fullName, role = 'user' } = req.body;
    const result = await authService.register(email, password, fullName, role);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const loginWithWeb3 = async (req, res, next) => {
  try {
    const { walletAddress, signature } = req.body;
    const result = await authService.loginWithWeb3(walletAddress, signature);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const User = (await import('../models/User.js')).default;
    const user = await User.findById(req.user.userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user with role field
    res.json({
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role || 'user',
      walletAddress: user.walletAddress,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  res.json({ message: 'Logged out successfully' });
};
