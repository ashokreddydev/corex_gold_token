import { Router } from 'express';
import { body } from 'express-validator';
import * as userController from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { handleValidationErrors } from '../middleware/validation.js';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// Get profile
router.get('/profile', userController.getProfile);

// Update wallet address
router.post(
  '/wallet',
  body('walletAddress').notEmpty().matches(/^0x[a-fA-F0-9]{40}$/),
  handleValidationErrors,
  userController.updateWalletAddress,
);

// Update profile
router.put(
  '/profile',
  body('fullName').optional().notEmpty(),
  body('phone').optional(),
  handleValidationErrors,
  userController.updateProfile,
);

// Change password
router.post(
  '/change-password',
  body('oldPassword').notEmpty(),
  body('newPassword').isLength({ min: 6 }),
  handleValidationErrors,
  userController.changePassword,
);

// Get settings
router.get('/settings', userController.getSettings);

// Update settings
router.put('/settings', userController.updateSettings);

export default router;
