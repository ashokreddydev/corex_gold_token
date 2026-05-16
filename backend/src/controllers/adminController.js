import * as tokenService from '../services/tokenService.js';
import * as emailService from '../services/emailService.js';
import User from '../models/User.js';

export const approveBurnRequest = async (req, res, next) => {
  try {
    const { burnRequestId } = req.params;

    const burnRequest = await tokenService.approveBurnRequest(
      burnRequestId,
      req.user.userId,
    );

    const user = await User.findById(burnRequest.userId);
    await emailService.sendBurnApprovalEmail(user.email, burnRequest.amount);

    res.json({
      message: 'Burn request approved',
      burnRequest,
    });
  } catch (error) {
    next(error);
  }
};

export const rejectBurnRequest = async (req, res, next) => {
  try {
    const { burnRequestId } = req.params;
    const { reason } = req.body;

    const burnRequest = await tokenService.rejectBurnRequest(
      burnRequestId,
      reason,
    );

    const user = await User.findById(burnRequest.userId);
    await emailService.sendBurnRejectionEmail(user.email, reason);

    res.json({
      message: 'Burn request rejected',
      burnRequest,
    });
  } catch (error) {
    next(error);
  }
};

export const getPendingBurnRequests = async (req, res, next) => {
  try {
    const burnRequests = await tokenService.getPendingBurnRequests();
    res.json(burnRequests);
  } catch (error) {
    next(error);
  }
};

export const getUserManagement = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').limit(100);
    res.json(users);
  } catch (error) {
    next(error);
  }
};
