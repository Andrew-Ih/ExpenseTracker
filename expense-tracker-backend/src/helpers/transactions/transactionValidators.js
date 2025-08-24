
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

export const validateRecurringTransactionData = (data) => {
  const errors = [];
  
  // Validate templateData
  if (!data.templateData) {
    errors.push('Transaction details are required');
  } else {
    const templateErrors = validateTransactionData(data.templateData);
    if (templateErrors) {
      errors.push(...templateErrors.map(err => `Transaction: ${err}`));
    }
  }
  
  // Validate frequency
  if (!data.frequency) {
    errors.push('Please select a frequency (Monthly, Yearly, or Bi-weekly)');
  } else if (!['monthly', 'yearly', 'bi-weekly'].includes(data.frequency)) {
    errors.push('Invalid frequency selected. Choose Monthly, Yearly, or Bi-weekly');
  }
  
  // Validate day of month
  if (!data.dayOfMonth || data.dayOfMonth === 0) {
    errors.push('Please enter the day of the month (1-31)');
  } else if (data.dayOfMonth < 1 || data.dayOfMonth > 31) {
    errors.push('Day of month must be between 1 and 31');
  }
  
  // Validate yearly-specific fields
  if (data.frequency === 'yearly') {
    if (!data.monthOfYear || data.monthOfYear === 0) {
      errors.push('Please select the month for yearly transactions');
    } else if (data.monthOfYear < 1 || data.monthOfYear > 12) {
      errors.push('Invalid month selected. Please choose a valid month');
    }
    
    // Validate yearly date range
    if (data.startYear && data.endYear) {
      const startYear = parseInt(data.startYear);
      const endYear = parseInt(data.endYear);
      
      if (startYear >= endYear) {
        errors.push(`End year (${endYear}) must be after start year (${startYear})`);
      }
      
      if (endYear - startYear > 20) {
        errors.push('Yearly recurring transactions cannot span more than 20 years');
      }
    }
  }
  
  // Validate bi-weekly-specific fields
  if (data.frequency === 'bi-weekly') {
    if (!data.dayOfMonth2 || data.dayOfMonth2 === 0) {
      errors.push('Please enter the second day of the month for bi-weekly transactions');
    } else if (data.dayOfMonth2 < 1 || data.dayOfMonth2 > 31) {
      errors.push('Second day of month must be between 1 and 31');
    }
    
    if (data.dayOfMonth && data.dayOfMonth2 && data.dayOfMonth === data.dayOfMonth2) {
      errors.push(`Both days cannot be the same (${data.dayOfMonth}). Please choose different days`);
    }
    
    // Validate bi-weekly makes sense (reasonable gap between days)
    if (data.dayOfMonth && data.dayOfMonth2) {
      const gap = Math.abs(data.dayOfMonth - data.dayOfMonth2);
      if (gap < 7) {
        errors.push(`Days are too close together (${gap} days apart). For bi-weekly, consider at least 7 days apart`);
      }
    }
  }
  
  // Validate date components based on frequency
  if (data.frequency === 'yearly') {
    // Yearly only needs start/end years
    if (!data.startYear) {
      errors.push('Please enter the start year');
    } else if (data.startYear < 2020 || data.startYear > 2030) {
      errors.push('Start year must be between 2020 and 2030');
    }
    
    if (!data.endYear) {
      errors.push('Please enter the end year');
    } else if (data.endYear < 2020 || data.endYear > 2030) {
      errors.push('End year must be between 2020 and 2030');
    }
  } else {
    // Monthly and bi-weekly need full date ranges
    if (!data.startMonth || data.startMonth === 0) {
      errors.push('Please select the start month');
    } else if (data.startMonth < 1 || data.startMonth > 12) {
      errors.push('Invalid start month selected');
    }
    
    if (!data.startYear) {
      errors.push('Please enter the start year');
    } else if (data.startYear < 2020 || data.startYear > 2030) {
      errors.push('Start year must be between 2020 and 2030');
    }
    
    if (!data.endMonth || data.endMonth === 0) {
      errors.push('Please select the end month');
    } else if (data.endMonth < 1 || data.endMonth > 12) {
      errors.push('Invalid end month selected');
    }
    
    if (!data.endYear) {
      errors.push('Please enter the end year');
    } else if (data.endYear < 2020 || data.endYear > 2030) {
      errors.push('End year must be between 2020 and 2030');
    }
    
    // Validate date range for monthly/bi-weekly
    if (data.startMonth && data.startYear && data.endMonth && data.endYear) {
      const startDate = new Date(parseInt(data.startYear), parseInt(data.startMonth) - 1);
      const endDate = new Date(parseInt(data.endYear), parseInt(data.endMonth) - 1);
      
      if (startDate >= endDate) {
        const startMonthName = new Date(0, parseInt(data.startMonth) - 1).toLocaleString('default', { month: 'long' });
        const endMonthName = new Date(0, parseInt(data.endMonth) - 1).toLocaleString('default', { month: 'long' });
        errors.push(`End date (${endMonthName} ${data.endYear}) must be after start date (${startMonthName} ${data.startYear})`);
      }
      
      // Check for reasonable duration limits
      const monthsDiff = (parseInt(data.endYear) - parseInt(data.startYear)) * 12 + (parseInt(data.endMonth) - parseInt(data.startMonth));
      
      if (data.frequency === 'monthly' && monthsDiff > 120) {
        errors.push('Monthly recurring transactions cannot span more than 10 years (120 months)');
      }
      
      if (data.frequency === 'bi-weekly' && monthsDiff > 120) {
        errors.push('Bi-weekly recurring transactions cannot span more than 10 years');
      }
      
      if (monthsDiff < 0) {
        errors.push('Invalid date range: end date is before start date');
      }
      
      if (monthsDiff === 0) {
        errors.push('Date range too short: recurring transactions need at least one month duration');
      }
    }
  }
  
  // Validate current date logic
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  
  if (data.startYear && data.startYear < currentYear - 1) {
    errors.push(`Start year (${data.startYear}) is too far in the past. Consider using ${currentYear - 1} or later`);
  }
  
  if (data.frequency !== 'yearly' && data.startYear && data.startMonth) {
    const startDate = new Date(parseInt(data.startYear), parseInt(data.startMonth) - 1);
    const oneYearAgo = new Date(currentYear - 1, currentMonth - 1);
    
    if (startDate < oneYearAgo) {
      errors.push('Start date is too far in the past. Recurring transactions should start within the last year');
    }
  }
  
  return errors.length > 0 ? errors : null;
};
