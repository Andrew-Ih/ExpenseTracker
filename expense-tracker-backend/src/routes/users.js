import express from 'express';
import UserController from '../controllers/userController.js';

const router = express.Router();

router.post('/', UserController.createUser);

export default router;
