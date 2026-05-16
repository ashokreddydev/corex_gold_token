import { Router } from 'express';
import { body } from 'express-validator';
import * as tokenController from '../controllers/tokenController.js';
import { authenticate } from '../middleware/auth.js';
import { handleValidationErrors } from '../middleware/validation.js';

const router = Router();

// All token routes require authentication
router.use(authenticate);

// Get balance
router.get('/balance', tokenController.getBalance);

// Get token info
router.get('/info', tokenController.getTokenInfo);

// Mint tokens
router.post(
  '/mint',
  body('amount').isNumeric({ min: 1 }),
  handleValidationErrors,
  tokenController.mint,
);

// Burn tokens
router.post(
  '/burn',
  body('amount').isNumeric({ min: 1 }),
  body('reason').notEmpty(),
  handleValidationErrors,
  tokenController.burn,
);

// Get vault balance
router.get('/vault-balance', tokenController.getVaultBalance);

// Get transaction history
router.get('/history', tokenController.getTransactionHistory);

// Get user's burn requests
router.get('/burn-requests/my', tokenController.getUserBurnRequests);

// Get burn requests
router.get('/burn-requests', tokenController.getBurnRequests);

export default router;
