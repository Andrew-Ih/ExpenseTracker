
export const validateTransactionData = (data) => {
  const errors = [];
  
  if (!data.amount) errors.push('Amount is required');
  if (isNaN(Number(data.amount))) errors.push('Amount must be a number');
  
  if (!data.type) errors.push('Type is required');
  if (!['income', 'expense'].includes(data.type)) errors.push('Type must be income or expense');
  
  if (!data.category) errors.push('Category is required');
  
  return errors.length > 0 ? errors : null;
};

export const validateTransactionQueryParams = (params) => {
  const errors = [];
  
  // Validate date formats if provided
  if (params.startDate && !/^\d{4}-\d{2}-\d{2}$/.test(params.startDate)) {
    errors.push('Invalid startDate format. Use YYYY-MM-DD');
  }
  
  if (params.endDate && !/^\d{4}-\d{2}-\d{2}$/.test(params.endDate)) {
    errors.push('Invalid endDate format. Use YYYY-MM-DD');
  }
  
  // Validate type if provided
  if (params.type && !['income', 'expense'].includes(params.type)) {
    errors.push('Type must be income or expense');
  }
  
  // Validate limit if provided
  if (params.limit && (isNaN(Number(params.limit)) || Number(params.limit) <= 0)) {
    errors.push('Limit must be a positive number');
  }
  
  return errors.length > 0 ? errors : null;
};

export const parseTransactionQueryParams = (query) => {
  const params = {};
  
  // Copy simple string parameters
  ['startDate', 'endDate', 'category', 'type'].forEach(param => {
    if (query[param]) params[param] = query[param];
  });
  
  // Parse limit to number if provided
  if (query.limit) {
    params.limit = parseInt(query.limit, 10);
  }
  
  // Parse lastEvaluatedKey if it exists
  if (query.lastEvaluatedKey) {
    try {
      params.lastEvaluatedKey = JSON.parse(query.lastEvaluatedKey);
    } catch (e) {
      throw new Error('Invalid lastEvaluatedKey format');
    }
  }
  
  return params;
};
