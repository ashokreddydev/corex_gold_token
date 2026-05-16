import User from '../models/User.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const updateWalletAddress = async (req, res, next) => {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ message: 'Wallet address is required' });
    }

    // Check if wallet address is already linked to another user
    const existingUser = await User.findOne({ 
      walletAddress: walletAddress,
      _id: { $ne: req.user.userId } 
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Wallet address already linked to another account' });
    }

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { walletAddress },
      { new: true },
    ).select('-password');

    res.json({ 
      message: 'Wallet address updated successfully',
      user 
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { fullName, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { fullName, phone },
      { new: true },
    ).select('-password');

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.userId);

    if (!(await user.comparePassword(oldPassword))) {
      return res.status(400).json({ message: 'Invalid current password' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};

export const getSettings = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);

    res.json({
      emailNotifications: true,
      twoFactorAuth: false,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const { emailNotifications, twoFactorAuth } = req.body;

    res.json({
      message: 'Settings updated successfully',
      settings: {
        emailNotifications,
        twoFactorAuth,
      },
    });
  } catch (error) {
    next(error);
  }
};
