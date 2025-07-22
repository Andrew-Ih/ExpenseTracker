import { handleTransactionError } from './transactionErrorHandlers.js';

export const transactionControllerWrapper = (handler) => {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (error) {
      handleTransactionError(error, res);
    }
  };
};
