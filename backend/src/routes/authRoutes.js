import { Router } from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { handleValidationErrors } from '../middleware/validation.js';
import { authLimiter } from '../middleware/rateLimit.js';

const router = Router();

// Login
router.post(
  '/login',
  authLimiter,
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  handleValidationErrors,
  authController.login,
);

// Register
router.post(
  '/register',
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('fullName').notEmpty(),
  handleValidationErrors,
  authController.register,
);

// Web3 Login
router.post(
  '/web3-login',
  body('walletAddress').notEmpty(),
  body('signature').notEmpty(),
  handleValidationErrors,
  authController.loginWithWeb3,
);

// Get current user (protected)
router.get('/me', authenticate, authController.getCurrentUser);

// Logout
router.post('/logout', authenticate, authController.logout);

export default router;
