import BudgetModel from "../models/BudgetModel.js";
import { budgetControllerWrapper } from '../helpers/budgets/budgetControllerWrapper.js';
import { validateBudgetData, validateBudgetUpdateData } from '../helpers/budgets/budgetValidators.js';

class BudgetController {
  static createBudget = budgetControllerWrapper(async (req, res) => {
    const userId = req.user.userId;
    const budgetData = req.body;

    const validationErrors = validateBudgetData(budgetData);
    if (validationErrors) {
      throw { type: 'validation', message: 'Validation failed', details: validationErrors };
    }

    const budget = await BudgetModel.createBudget(budgetData, userId);
    res.status(201).json(budget);
  });

  static getBudgets = budgetControllerWrapper(async (req, res) => {
    const userId = req.user.userId;
    const { month } = req.query;

    const budgets = await BudgetModel.getBudgets(userId, month);
    res.json(budgets);
  });

  static updateBudget = budgetControllerWrapper(async (req, res) => {
    const userId = req.user.userId;
    const updateData = req.body;

    const validationErrors = validateBudgetUpdateData(updateData);
    if (validationErrors) {
      throw { type: 'validation', message: 'Validation failed', details: validationErrors };
    }

    const { budgetId, ...fieldsToUpdate } = updateData;
    const updatedBudget = await BudgetModel.updateBudgetById(budgetId, userId, fieldsToUpdate);
    
    res.json({
      message: "Budget updated successfully",
      budget: updatedBudget
    });
  });

  static deleteBudget = budgetControllerWrapper(async (req, res) => {
    const userId = req.user.userId;
    const { budgetId } = req.body;

    if (!budgetId) {
      throw { type: 'missing_field', message: 'Budget ID is required' };
    }

    const deletedBudget = await BudgetModel.deleteBudgetById(budgetId, userId);
    
    res.json({
      message: "Budget deleted successfully",
      budget: deletedBudget
    });
  });

  static getBudgetSummary = budgetControllerWrapper(async (req, res) => {
    const userId = req.user.userId;
    const { year, startMonth, endMonth } = req.body;

    if (!year || !startMonth || !endMonth) {
      throw { type: 'missing_field', message: 'Year, startMonth, and endMonth are required' };
    }

    const summary = await BudgetModel.getBudgetSummary(userId, year, startMonth, endMonth);
    res.json(summary);
  });
}

export default BudgetController;
