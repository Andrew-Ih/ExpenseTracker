export const validateBudgetData = (data) => {
  const errors = [];
  
  if (!data.category) errors.push('Category is required');
  if (!data.amount) errors.push('Amount is required');
  if (!data.month) errors.push('Month is required');
  
  if (data.amount !== undefined && (isNaN(Number(data.amount)) || Number(data.amount) <= 0)) {
    errors.push('Amount must be a positive number');
  }
  
  if (data.month && !/^\d{4}-\d{2}$/.test(data.month)) {
    errors.push('Month must be in YYYY-MM format');
  }
  
  return errors.length > 0 ? errors : null;
};

export const validateBudgetUpdateData = (data) => {
  const errors = [];
  
  if (!data.budgetId) {
    throw { type: 'missing_field', message: 'Budget ID is required' };
  }
  
  if (data.amount !== undefined && (isNaN(Number(data.amount)) || Number(data.amount) <= 0)) {
    errors.push('Amount must be a positive number');
  }
  
  return errors.length > 0 ? errors : null;
};

export const validateBudgetHistoryParams = (params) => {
  const errors = [];
  
  if (!params.months) {
    throw { type: 'missing_field', message: 'Months parameter is required' };
  }
  
  return errors.length > 0 ? errors : null;
};
