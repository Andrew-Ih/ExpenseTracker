import express from 'express';
import UserController from '../controllers/userController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

router.post('/', UserController.createUser);

// Protected route - NEW
router.get('/profile', authenticateUser, UserController.getUserProfile);
// New routes needed for user profile management
// 1. Update User information 
// router.put('/profile', authenticateUser, UserController.updateUserProfile);
// 2. Delete User account
// router.delete('/profile', authenticateUser, UserController.deleteUserAccount);

export default router;
