import express from 'express';
import UserController from '../controllers/userController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

router.post('/createUser', UserController.createUser);
router.get('/getProfile', authenticateUser, UserController.getUserProfile);
router.put('/updateProfile', authenticateUser, UserController.updateUserProfile);
router.delete('/deleteProfile', authenticateUser, UserController.deleteUserProfile);

export default router;
