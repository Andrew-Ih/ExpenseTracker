
export const validateTransactionData = (data) => {
  const errors = [];
  
  if (!data.amount) errors.push('Amount is required');
  if (isNaN(Number(data.amount))) errors.push('Amount must be a number');
  
  if (!data.type) errors.push('Type is required');
  if (!['income', 'expense'].includes(data.type)) errors.push('Type must be income or expense');
  
  if (!data.category) errors.push('Category is required');
  
  return errors.length > 0 ? errors : null;
};
