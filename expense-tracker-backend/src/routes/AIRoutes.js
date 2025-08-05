import express from 'express';
import { authenticateUser } from '../middleware/auth.js';
import AIController from '../controllers/AIController.js';

const router = express.Router();

// AI chat endpoint
router.post('/chat', authenticateUser, AIController.chat);

// Clear chat history endpoint
router.delete('/chat-history', authenticateUser, AIController.clearChatHistory);

export default router;