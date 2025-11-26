import express from 'express';
import { submitRating, getUserRating } from '../controllers/ratingController.js';
import { authenticateToken, isNormalUser } from '../middleware/auth.js';
import { ratingValidation, validate } from '../middleware/validation.js';
import { body } from 'express-validator';

const router = express.Router();


router.use(authenticateToken, isNormalUser);


router.post('/',
  [
    body('storeId').isInt().withMessage('Valid store ID required'),
    ...ratingValidation
  ],
  validate,
  submitRating
);


router.get('/store/:storeId', getUserRating);

export default router;