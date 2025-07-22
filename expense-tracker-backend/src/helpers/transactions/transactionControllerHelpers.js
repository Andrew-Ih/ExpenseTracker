/**
 * Helper functions for transaction controllers
 */

/**
 * Formats the response for getTransactions
 * @param {Array} transactions - The transactions array
 * @param {Object} lastEvaluatedKey - The pagination token
 * @returns {Object} Formatted response with transactions and pagination info
 */
export const formatTransactionsResponse = (transactions, lastEvaluatedKey) => {
  return {
    transactions,
    pagination: {
      hasMore: !!lastEvaluatedKey,
      lastEvaluatedKey: lastEvaluatedKey ? JSON.stringify(lastEvaluatedKey) : null
    }
  };
};
