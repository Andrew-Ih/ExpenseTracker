import BudgetModel from "../models/BudgetModel.js";

class BudgetController {
  static async createBudget(req, res) {
    try {
      const userId = req.user.userId;
      const { category, amount, month } = req.body;

      if (!category || !amount || !month) {
        return res.status(400).json({ error: 'Category, amount, and month are required' });
      }

      if (amount <= 0) {
        return res.status(400).json({ error: 'Amount must be greater than 0' });
      }

      const budget = await BudgetModel.createBudget({ category, amount, month }, userId);
      res.status(201).json(budget);
    } catch (error) {
      console.error('Create budget error:', error);
      if (error.message.includes('already exists')) {
        return res.status(409).json({ error: error.message });
      }
      res.status(500).json({ error: 'Failed to create budget' });
    }
  }

  static async getBudgets(req, res) {
    try {
      const userId = req.user.userId;
      const { month } = req.query;

      const budgets = await BudgetModel.getBudgets(userId, month);
      res.json(budgets);
    } catch (error) {
      console.error('Get budgets error:', error);
      res.status(500).json({ error: 'Failed to get budgets' });
    }
  }

  static async updateBudget(req, res) {
    try {
      const userId = req.user.userId;
      const { budgetId, amount, category } = req.body;

      if (!budgetId) {
        return res.status(400).json({ error: 'Budget ID is required' });
      }

      if (amount !== undefined && amount <= 0) {
        return res.status(400).json({ error: 'Amount must be greater than 0' });
      }

      const updatedBudget = await BudgetModel.updateBudgetById(budgetId, userId, { amount, category });
      
      res.json({
        message: "Budget updated successfully",
        budget: updatedBudget
      });
    } catch (error) {
      console.error('Update budget error:', error);
      if (error.name === 'ConditionalCheckFailedException') {
        return res.status(404).json({ error: 'Budget not found or access denied' });
      }
      res.status(500).json({ error: 'Failed to update budget' });
    }
  }

  static async deleteBudget(req, res) {
    try {
      const userId = req.user.userId;
      const { budgetId } = req.body;

      if (!budgetId) {
        return res.status(400).json({ error: 'Budget ID is required' });
      }

      const deletedBudget = await BudgetModel.deleteBudgetById(budgetId, userId);
      
      res.json({
        message: "Budget deleted successfully",
        budget: deletedBudget
      });
    } catch (error) {
      console.error('Delete budget error:', error);
      if (error.name === 'ConditionalCheckFailedException') {
        return res.status(404).json({ error: 'Budget not found or access denied' });
      }
      res.status(500).json({ error: 'Failed to delete budget' });
    }
  }

  static async getBudgetHistory(req, res) {
    try {
      const userId = req.user.userId;
      const { months } = req.query;

      if (!months) {
        return res.status(400).json({ error: 'Months parameter is required' });
      }

      const monthsArray = months.split(',');
      const history = await BudgetModel.getBudgetHistory(userId, monthsArray);
      
      res.json(history);
    } catch (error) {
      console.error('Get budget history error:', error);
      res.status(500).json({ error: 'Failed to get budget history' });
    }
  }

  static async copyBudgetsToNextMonth(req, res) {
    try {
      const userId = req.user.userId;
      const { fromMonth, toMonth } = req.body;

      if (!fromMonth || !toMonth) {
        return res.status(400).json({ error: 'Both fromMonth and toMonth are required' });
      }

      const copiedBudgets = await BudgetModel.copyBudgetsToNextMonth(userId, fromMonth, toMonth);
      
      res.json({
        message: 'Budgets copied successfully',
        budgets: copiedBudgets
      });
    } catch (error) {
      console.error('Copy budgets error:', error);
      res.status(500).json({ error: 'Failed to copy budgets' });
    }
  }
}

export default BudgetController;