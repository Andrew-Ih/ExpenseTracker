import express from 'express';
import AuthController from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', AuthController.signUp);
router.post('/confirm-signup', AuthController.confirmSignUp);
router.post('/signin', AuthController.signIn);
router.post('/resend-code', AuthController.resendConfirmationCode);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/confirm-forgot-password', AuthController.confirmForgotPassword);

export default router;
