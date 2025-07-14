import express from 'express';
import UserController from '../controllers/userController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

router.post('/', UserController.createUser);

// Protected route - NEW
router.get('/profile', authenticateUser, UserController.getUserProfile);

export default router;
