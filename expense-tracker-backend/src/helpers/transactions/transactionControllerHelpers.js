import { getCurrentMonthDateRange, getMonthDateRange, getCurrentYearDateRange, validateMonthYear } from './transactionSummaryHelpers.js';
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

export const getDateRange = (period, month, year) => {
    let dateRange;
    if (period === 'current-year') {
      dateRange = getCurrentYearDateRange();
    } else if (month && year) {
      const validationErrors = validateMonthYear(parseInt(month), parseInt(year));
      if (validationErrors) {
        throw { type: 'validation', message: 'Invalid month/year', details: validationErrors };
      }
      dateRange = getMonthDateRange(parseInt(month), parseInt(year));
    } else {
      dateRange = getCurrentMonthDateRange();
    }
    return dateRange;
};
