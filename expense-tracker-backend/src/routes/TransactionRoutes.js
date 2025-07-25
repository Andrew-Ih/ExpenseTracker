import express from 'express';
import TransactionControllers from '../controllers/TransactionControllers.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

router.post('/createTransaction', authenticateUser, TransactionControllers.createTransaction);
router.post('/getTransactions', authenticateUser, TransactionControllers.getTransactions);
router.put('/updateTransaction', authenticateUser, TransactionControllers.updateTransaction);
router.delete('/deleteTransaction', authenticateUser, TransactionControllers.deleteTransaction);

export default router;
