import TransactionModel from "../models/TransactionModel.js";
import { validateTransactionData } from "../helpers/transactionValidators.js";

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
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getTransactions(req, res) {

  }

  static async updateTransaction(req, res) {

  }

  static async deleteTransaction(req, res) {
    const userId = req.user.userId; // From JWT middleware
    const { transactionId } = req.body;

    try {
      if (!transactionId) {
        return res.status(400).json({ error: "Transaction ID is required" });
      }
      const deletedTransaction = await TransactionModel.deleteById(transactionId, userId);
      
      res.status(200).json({
        message: "Transaction deleted successfully",
        transaction: deletedTransaction
      });
    } catch (error) {
      if (error.message === 'Transaction not found') {
        return res.status(404).json({ error: "Transaction not found" });
      }
      if (error.message.startsWith('Unauthorized')) {
        return res.status(403).json({ error: error.message });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

export default TransactionControllers;
