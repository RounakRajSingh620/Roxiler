import express from 'express';
import { getDashboardStats, createUser, getAllUsers, getUserDetails } from '../controllers/userController.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';
import { userValidation, validate } from '../middleware/validation.js';
import { body } from 'express-validator';

const router = express.Router();


router.use(authenticateToken, isAdmin);


router.get('/dashboard/stats', getDashboardStats);


router.post('/', 
  [
    ...userValidation,
    body('role')
      .isIn(['admin', 'user'])
      .withMessage('Role must be either admin or user')
  ],
  validate,
  createUser
);

router.get('/', getAllUsers);
router.get('/:id', getUserDetails);

export default router;