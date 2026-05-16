import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import User from '../models/User.js';

export const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn },
  );
};

export const login = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    throw new Error('Invalid email or password');
  }

  if (!user.isActive) {
    throw new Error('Account is inactive');
  }

  user.lastLogin = new Date();
  await user.save();

  const token = generateToken(user._id, user.role);

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
  };
};

export const register = async (email, password, fullName, role = 'user') => {
  let user = await User.findOne({ email });

  if (user) {
    throw new Error('Email already registered');
  }

  user = new User({
    email,
    password,
    fullName,
    role,
  });

  await user.save();

  const token = generateToken(user._id, user.role);

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
  };
};

export const loginWithWeb3 = async (walletAddress, signature) => {
  let user = await User.findOne({ walletAddress });

  if (!user) {
    user = new User({
      email: `${walletAddress}@web3.local`,
      password: Math.random().toString(36),
      fullName: walletAddress,
      walletAddress,
      isVerified: true,
    });
    await user.save();
  }

  user.lastLogin = new Date();
  await user.save();

  const token = generateToken(user._id, user.role);

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      walletAddress: user.walletAddress,
    },
  };
};
