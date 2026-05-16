import { Router } from 'express';
import { body } from 'express-validator';
import * as adminController from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { handleValidationErrors } from '../middleware/validation.js';

const router = Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorize(['admin']));

// Approve burn request
router.post(
  '/burn-requests/:burnRequestId/approve',
  adminController.approveBurnRequest,
);

// Reject burn request
router.post(
  '/burn-requests/:burnRequestId/reject',
  body('reason').notEmpty(),
  handleValidationErrors,
  adminController.rejectBurnRequest,
);

// Get pending burn requests
router.get('/burn-requests', adminController.getPendingBurnRequests);

// User management
router.get('/users', adminController.getUserManagement);

export default router;
