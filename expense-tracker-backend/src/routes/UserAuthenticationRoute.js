import express from 'express';
import UserAuthenticationController from '../controllers/UserAuthenticationController.js';

const router = express.Router();

router.post('/signup', UserAuthenticationController.registerNewUser);
router.post('/confirm-signup', UserAuthenticationController.verifyUserEmail);
router.post('/signin', UserAuthenticationController.authenticateUser);
router.post('/resend-code', UserAuthenticationController.regenerateVerificationCode);
router.post('/forgot-password', UserAuthenticationController.initiatePasswordReset);
router.post('/confirm-forgot-password', UserAuthenticationController.completePasswordReset);

export default router;
