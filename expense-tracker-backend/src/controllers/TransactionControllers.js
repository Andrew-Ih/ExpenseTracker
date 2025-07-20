import TransactionModel from "../models/TransactionModel.js";
import { validateTransactionData } from "../helpers/transactions/transactionValidators.js";
import { handleTransactionError } from '../helpers/transactions/transactionErrorHandlers.js';

class TransactionControllers {
  static async createTransaction(req, res) {
    const userId = req.user.userId; // From JWT middleware
    try {
      const transactionData = req.body;

      const validationErrors = validateTransactionData(transactionData);
      if (validationErrors) {
        return res.status(400).json({ 
          error: "Validation failed", 
          details: validationErrors 
        });
      }

      const newTransaction = await TransactionModel.createTransaction(transactionData, userId);
      res.status(201).json(newTransaction);
    } catch (error) {
      handleTransactionError(error, res);
    }
  }

  static async getTransactions(req, res) {
    res.status(200).json({ message: "This endpoint is under development" });
  }

  static async updateTransaction(req, res) {
    const userId = req.user.userId; // From JWT middleware
    const { transactionId, ...updateData } = req.body;

    try {
      if (!transactionId) {
        return res.status(400).json({ error: "Transaction ID is required" });
      }

      // Validate update data if needed
      if (updateData.type && !['income', 'expense'].includes(updateData.type)) {
        return res.status(400).json({ error: "Type must be income or expense" });
      }

      const updatedTransaction = await TransactionModel.updateTransactionById( transactionId, userId, updateData );
      
      res.status(200).json({
        message: "Transaction updated successfully",
        transaction: updatedTransaction
      });
    } catch (error) {      
      handleTransactionError(error, res);
    }
  }

  static async deleteTransaction(req, res) {
    const userId = req.user.userId; // From JWT middleware
    const { transactionId } = req.body;

    try {
      if (!transactionId) {
        return res.status(400).json({ error: "Transaction ID is required" });
      }
      const deletedTransaction = await TransactionModel.deleteTransactionById(transactionId, userId);
      
      res.status(200).json({
        message: "Transaction deleted successfully",
        transaction: deletedTransaction
      });
    } catch (error) {
      handleTransactionError(error, res);
    }
  }
}

export default TransactionControllers;
