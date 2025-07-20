import express from 'express';
import TransactionControllers from '../controllers/TransactionControllers.js';

const router = express.Router();

router.post('/createTransaction', TransactionControllers.createTransaction);
router.get('/listTransactions', TransactionControllers.getTransactions);
router.put('/updateTransaction/:id', TransactionControllers.updateTransaction);
router.delete('/deleteTransaction/:id', TransactionControllers.deleteTransaction);

export default router;
