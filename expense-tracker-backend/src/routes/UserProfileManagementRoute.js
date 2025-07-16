import express from 'express';
import UserProfileManagementController from '../controllers/UserProfileManagementController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

router.post('/createUser', UserProfileManagementController.createUserProfile);
router.get('/getProfile', authenticateUser, UserProfileManagementController.getUserProfile);
router.put('/updateProfile', authenticateUser, UserProfileManagementController.updateUserProfile);
router.delete('/deleteProfile', authenticateUser, UserProfileManagementController.deleteUserProfile);

export default router;
