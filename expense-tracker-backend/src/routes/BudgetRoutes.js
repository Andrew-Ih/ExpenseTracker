import express from 'express';
import BudgetController from '../controllers/BudgetController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

router.post('/createBudget', authenticateUser, BudgetController.createBudget);
router.get('/getBudgets', authenticateUser, BudgetController.getBudgets);
router.put('/updateBudget', authenticateUser, BudgetController.updateBudget);
router.delete('/deleteBudget', authenticateUser, BudgetController.deleteBudget);

export default router;