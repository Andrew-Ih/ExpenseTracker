import { handleBudgetError } from './budgetErrorHandlers.js';

export const budgetControllerWrapper = (handler) => {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (error) {
      console.error('Budget controller error:', error);
      handleBudgetError(error, res);
    }
  };
};
