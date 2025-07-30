/**
 * Helper functions for transaction summary calculations
 */

/**
 * Calculate transaction summary metrics
 * @param {Array} transactions - Array of transactions
 * @returns {Object} Summary metrics
 */
export const calculateTransactionSummary = (transactions) => {
  const summary = {
    totalIncome: 0,
    totalExpenses: 0,
    netIncome: 0,
    transactionCount: transactions.length,
    incomeCount: 0,
    expenseCount: 0
  };

  transactions.forEach(transaction => {
    const amount = parseFloat(transaction.amount);
    
    if (transaction.type === 'income') {
      summary.totalIncome += amount;
      summary.incomeCount++;
    } else if (transaction.type === 'expense') {
      summary.totalExpenses += amount;
      summary.expenseCount++;
    }
  });

  summary.netIncome = summary.totalIncome - summary.totalExpenses;
  
  return summary;
};

/**
 * Generate date range for current month
 * @returns {Object} Start and end dates for current month
 */
export const getCurrentMonthDateRange = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  
  const startDate = new Date(year, month, 1).toISOString().split('T')[0];
  const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];
  
  return { startDate, endDate };
};

/**
 * Generate date range for specific month/year
 * @param {number} month - Month (1-12)
 * @param {number} year - Year (YYYY)
 * @returns {Object} Start and end dates for specified month
 */
export const getMonthDateRange = (month, year) => {
  const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
  const endDate = new Date(year, month, 0).toISOString().split('T')[0];
  
  return { startDate, endDate };
};

/**
 * Generate date range for current year
 * @returns {Object} Start and end dates for current year
 */
export const getCurrentYearDateRange = () => {
  const now = new Date();
  const year = now.getFullYear();
  
  const startDate = `${year}-01-01`;
  const endDate = `${year}-12-31`;
  
  return { startDate, endDate };
};

/**
 * Validate month and year parameters
 * @param {number} month - Month (1-12)
 * @param {number} year - Year (YYYY)
 * @returns {Array|null} Validation errors or null if valid
 */
export const validateMonthYear = (month, year) => {
  const errors = [];
  
  if (!month || month < 1 || month > 12) {
    errors.push('Month must be between 1 and 12');
  }
  
  if (!year || year < 2020 || year > 2030) {
    errors.push('Year must be between 2020 and 2030');
  }
  
  return errors.length > 0 ? errors : null;
};