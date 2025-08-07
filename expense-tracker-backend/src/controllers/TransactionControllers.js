import TransactionModel from "../models/TransactionModel.js";
import { validateTransactionData, validateTransactionQueryParams, parseTransactionQueryParams } from "../helpers/transactions/transactionValidators.js";
import { formatTransactionsResponse, getDateRange } from '../helpers/transactions/transactionControllerHelpers.js';
import { transactionControllerWrapper } from '../helpers/transactions/transactionControllerWrapper.js';
import { calculateTransactionSummary } from '../helpers/transactions/transactionSummaryHelpers.js';

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

  static getTransactionSummary = transactionControllerWrapper(async (req, res) => {
    const userId = req.user.userId;
    const { month, year, period } = req.query;

    const dateRange = getDateRange(period, month, year);
    const result = await TransactionModel.getTransactions(userId, { startDate: dateRange.startDate, endDate: dateRange.endDate });
    const summary = calculateTransactionSummary(result.transactions);
    
    res.status(200).json({
      summary,
      period: {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        month: month ? parseInt(month) : new Date().getMonth() + 1,
        year: year ? parseInt(year) : new Date().getFullYear()
      }
    });
  });

  static getAllTimeTransactionSummary = transactionControllerWrapper(async (req, res) => {
    const userId = req.user.userId;
    const result = await TransactionModel.getTransactions(userId, { limit: 10000 }); // High limit to get all transactions
    const summary = calculateTransactionSummary(result.transactions);
    
    res.status(200).json({
      summary,
      period: {
        startDate: null,
        endDate: null,
        month: null,
        year: null,
        type: 'all-time'
      }
    });
  });
}

export default TransactionControllers;
