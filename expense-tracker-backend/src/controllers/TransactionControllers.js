import TransactionModel from "../models/TransactionModel.js";
import RecurringTransactionModel from "../models/RecurringTransactionModel.js";
import { validateTransactionData, validateTransactionQueryParams, parseTransactionQueryParams, validateRecurringTransactionData } from "../helpers/transactions/transactionValidators.js";
import { formatTransactionsResponse } from '../helpers/transactions/transactionControllerHelpers.js';
import { transactionControllerWrapper } from '../helpers/transactions/transactionControllerWrapper.js';

class TransactionControllers {
  static createTransaction = transactionControllerWrapper(async (req, res) => {
    const userId = req.user.userId;
    const transactionData = req.body;

    const validationErrors = validateTransactionData(transactionData);
    if (validationErrors) {
      throw { type: 'validation', message: 'Validation failed', details: validationErrors };
    }

    const newTransaction = await TransactionModel.createTransaction(transactionData, userId);
    res.status(201).json(newTransaction);
  });

  static getTransactions = transactionControllerWrapper(async (req, res) => {
    const userId = req.user.userId;
    
    const validationErrors = validateTransactionQueryParams(req.body);
    if (validationErrors) {
      throw { type: 'validation', message: 'Validation failed', details: validationErrors };
    }
    
    const queryParams = parseTransactionQueryParams(req.body);
    const result = await TransactionModel.getTransactions(userId, queryParams);
    
    const response = formatTransactionsResponse(result.transactions, result.lastEvaluatedKey);
    res.status(200).json(response);
  });

  static updateTransaction = transactionControllerWrapper(async (req, res) => {
    const userId = req.user.userId;
    const { transactionId, ...updateData } = req.body;

    if (!transactionId) {
      throw { type: 'missing_field', message: 'Transaction ID is required' };
    }

    if (updateData.type && !['income', 'expense'].includes(updateData.type)) {
      throw { type: 'validation', message: 'Invalid transaction type', details: ['Type must be income or expense'] };
    }

    const updatedTransaction = await TransactionModel.updateTransactionById(transactionId, userId, updateData);
    
    res.status(200).json({
      message: "Transaction updated successfully",
      transaction: updatedTransaction
    });
  });

  static deleteTransaction = transactionControllerWrapper(async (req, res) => {
    const userId = req.user.userId;
    const { transactionId } = req.body;

    if (!transactionId) {
      throw { type: 'missing_field', message: 'Transaction ID is required' };
    }
    
    const deletedTransaction = await TransactionModel.deleteTransactionById(transactionId, userId);
    
    res.status(200).json({
      message: "Transaction deleted successfully",
      transaction: deletedTransaction
    });
  });

  static createRecurringTransaction = transactionControllerWrapper(async (req, res) => {
    const userId = req.user.userId;
    const recurringData = req.body;

    const validationErrors = validateRecurringTransactionData(recurringData);
    if (validationErrors) {
      throw { type: 'validation', message: 'Validation failed', details: validationErrors };
    }

    // Create recurring template
    const recurringTemplate = await RecurringTransactionModel.createRecurring(recurringData, userId);
    
    // Generate all instances at once
    const transactions = await TransactionModel.createRecurringInstances(recurringTemplate, userId);
    
    res.status(201).json({
      message: 'Recurring transaction created successfully',
      recurringTemplate,
      generatedCount: transactions.length,
      transactions: transactions.slice(0, 5) // Return first 5 for confirmation
    });
  });

  static getRecurringTransactions = transactionControllerWrapper(async (req, res) => {
    const userId = req.user.userId;
    
    const recurringTransactions = await RecurringTransactionModel.getRecurringTransactions(userId);
    
    res.status(200).json(recurringTransactions);
  });

  static updateRecurringTransaction = transactionControllerWrapper(async (req, res) => {
    const userId = req.user.userId;
    const { recurringId, ...updateData } = req.body;

    if (!recurringId) {
      throw { type: 'missing_field', message: 'Recurring ID is required' };
    }

    const updatedRecurring = await RecurringTransactionModel.updateRecurringById(recurringId, userId, updateData);
    
    res.status(200).json({
      message: "Recurring transaction updated successfully",
      recurringTransaction: updatedRecurring
    });
  });

  static deleteRecurringTransaction = transactionControllerWrapper(async (req, res) => {
    const userId = req.user.userId;
    const { recurringId } = req.body;

    if (!recurringId) {
      throw { type: 'missing_field', message: 'Recurring ID is required' };
    }
    
    const deletedRecurring = await RecurringTransactionModel.deleteRecurringById(recurringId);
    
    res.status(200).json({
      message: "Recurring transaction deleted successfully",
      recurringTransaction: deletedRecurring
    });
  });
}

export default TransactionControllers;
