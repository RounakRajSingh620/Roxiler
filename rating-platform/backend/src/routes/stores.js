import express from 'express';
import { createStore, getAllStores, getStoreDashboard } from '../controllers/storeController.js';
import { authenticateToken, isAdmin, isStoreOwner } from '../middleware/auth.js';
import { storeValidation, validate, userValidation } from '../middleware/validation.js';
import { body } from 'express-validator';

const router = express.Router();


router.post('/', 
  authenticateToken,
  isAdmin,
  [
    ...storeValidation,
    body('password')
      .isLength({ min: 8, max: 16 })
      .withMessage('Password must be between 8 and 16 characters')
      .matches(/[A-Z]/)
      .withMessage('Password must contain at least one uppercase letter')
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage('Password must contain at least one special character')
  ],
  validate,
  createStore
);

router.get('/', authenticateToken, getAllStores);


router.get('/dashboard', authenticateToken, isStoreOwner, getStoreDashboard);

export default router;