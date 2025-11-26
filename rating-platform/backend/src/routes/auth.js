import express from 'express';
import { signup, login, getCurrentUser, updatePassword } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';
import { userValidation, loginValidation, passwordUpdateValidation, validate } from '../middleware/validation.js';

const router = express.Router();


router.post('/signup', userValidation, validate, signup);
router.post('/login', loginValidation, validate, login);


router.get('/me', authenticateToken, getCurrentUser);
router.put('/password', authenticateToken, passwordUpdateValidation, validate, updatePassword);

export default router;