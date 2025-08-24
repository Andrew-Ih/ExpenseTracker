import RecurringTransactionModel from "../models/RecurringTransactionModel.js";
import TransactionModel from "../models/TransactionModel.js";
import { validateRecurringTransactionData } from "../helpers/transactions/transactionValidators.js";
import { transactionControllerWrapper } from '../helpers/transactions/transactionControllerWrapper.js';

class RecurringTransactionController {
  static createRecurringTransaction = transactionControllerWrapper(async (req, res) => {
    const userId = req.user.userId;
    const recurringData = req.body;

    const validationErrors = validateRecurringTransactionData(recurringData);
    if (validationErrors) {
      throw { type: 'validation', message: 'Validation failed', details: validationErrors };
    }
    const recurringTemplate = await RecurringTransactionModel.createRecurring(recurringData, userId);
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

export default RecurringTransactionController;
