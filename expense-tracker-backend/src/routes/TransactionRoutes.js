import express from 'express';
import TransactionControllers from '../controllers/TransactionControllers.js';
import RecurringTransactionController from '../controllers/RecurringTransactionController.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

router.post('/createTransaction', authenticateUser, TransactionControllers.createTransaction);
router.post('/getTransactions', authenticateUser, TransactionControllers.getTransactions);
router.get('/getSummary', authenticateUser, TransactionControllers.getTransactionSummary);
router.put('/updateTransaction', authenticateUser, TransactionControllers.updateTransaction);
router.delete('/deleteTransaction', authenticateUser, TransactionControllers.deleteTransaction);

// Recurring transaction routes
router.post('/createRecurring', authenticateUser, RecurringTransactionController.createRecurringTransaction);
router.get('/getRecurring', authenticateUser, RecurringTransactionController.getRecurringTransactions);
router.put('/updateRecurring', authenticateUser, RecurringTransactionController.updateRecurringTransaction);
router.delete('/deleteRecurring', authenticateUser, RecurringTransactionController.deleteRecurringTransaction);

export default router;
