import { GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';

export const verifyBudgetOwnership = async (docClient, budgetId, userId, tableName) => {
  const budget = await _getBudgetById(docClient, budgetId, tableName);
  return _verifyOwnership(budget, userId);
};

export const buildBudgetUpdateExpression = (updateData) => {
  const fields = ['amount', 'category'];

  const { updateExpressions, expressionAttributeNames, expressionAttributeValues } = _processUpdatableFields(updateData, fields);
  _addTimestampField(updateExpressions, expressionAttributeNames, expressionAttributeValues);
  _validateUpdateExpressions(updateExpressions);
  
  return {
    updateExpression: _formatUpdateExpression(updateExpressions),
    expressionAttributeNames,
    expressionAttributeValues
  };
};

export const buildBudgetQueryParams = (userId, month, tableName) => {
  const params = _initializeBaseParams(userId, tableName);
  
  if (month) {
    _addMonthFilter(params, month);
  }
  
  return params;
};

export const buildDuplicateCheckParams = (userId, category, month, tableName) => {
  return {
    TableName: tableName,
    IndexName: 'UserMonthIndex',
    KeyConditionExpression: 'userId = :userId AND #month = :month',
    FilterExpression: 'category = :category',
    ExpressionAttributeNames: { '#month': 'month' },
    ExpressionAttributeValues: {
      ':userId': userId,
      ':month': month,
      ':category': category
    }
  };
};

export const buildBudgetSummaryParams = (userId, year, startMonth, endMonth, tableName) => {
  return {
    TableName: tableName,
    IndexName: 'UserMonthIndex',
    KeyConditionExpression: 'userId = :userId AND #month BETWEEN :startMonth AND :endMonth',
    ExpressionAttributeNames: { '#month': 'month' },
    ExpressionAttributeValues: {
      ':userId': userId,
      ':startMonth': `${year}-${startMonth.toString().padStart(2, '0')}`,
      ':endMonth': `${year}-${endMonth.toString().padStart(2, '0')}`
    }
  };
};

export const processBudgetSummaryData = (budgets, year, startMonth, endMonth) => {
  const monthlySummaries = [];
  let yearlyTotalBudgeted = 0;
  
  for (let month = startMonth; month <= endMonth; month++) {
    const monthStr = `${year}-${month.toString().padStart(2, '0')}`;
    const monthBudgets = budgets?.filter(b => b.month === monthStr) || [];
    const totalBudgeted = monthBudgets.reduce((sum, budget) => sum + parseFloat(budget.amount), 0);
    
    monthlySummaries.push({
      month: monthStr,
      totalBudgeted,
      totalSpent: 0,
      overUnderBudget: 0
    });
    
    yearlyTotalBudgeted += totalBudgeted;
  }
  
  return {
    year,
    monthlySummaries,
    yearlyTotals: {
      totalBudgeted: yearlyTotalBudgeted,
      totalSpent: 0,
      totalSaved: 0
    }
  };
};

// ******************************************************
// Helper functions for verifyBudgetOwnership
// ******************************************************
const _getBudgetById = async (docClient, budgetId, tableName) => {
  const getParams = {
    TableName: tableName,
    Key: { budgetId }
  };

  const { Item: budget } = await docClient.send(new GetCommand(getParams));
  
  if (!budget) {
    throw new Error('Budget not found');
  }
  
  return budget;
};

const _verifyOwnership = (budget, userId) => {
  if (budget.userId !== userId) {
    throw new Error('Unauthorized: Budget belongs to another user');
  }
  return budget;
};

// ******************************************************
// Helper functions for buildBudgetUpdateExpression
// ******************************************************
const _processUpdatableFields = (updateData, fields) => {
  const updateExpressions = [];
  const expressionAttributeNames = {};
  const expressionAttributeValues = {};
  
  fields.forEach(field => {
    if (updateData[field] !== undefined) {
      updateExpressions.push(`#${field} = :${field}`);
      expressionAttributeNames[`#${field}`] = field;
      expressionAttributeValues[`:${field}`] = updateData[field];
    }
  });
  
  return { updateExpressions, expressionAttributeNames, expressionAttributeValues };
};

const _addTimestampField = (expressions, names, values) => {
  const currentDate = new Date().toISOString().split('T')[0];
  expressions.push('#updatedAt = :updatedAt');
  names['#updatedAt'] = 'updatedAt';
  values[':updatedAt'] = currentDate;
};

const _validateUpdateExpressions = (expressions) => {
  if (expressions.length === 1) { // Only updatedAt
    throw new Error('No fields to update');
  }
};

const _formatUpdateExpression = (expressions) => {
  return `SET ${expressions.join(', ')}`;
};

// ******************************************************
// Helper functions for buildBudgetQueryParams
// ******************************************************
const _initializeBaseParams = (userId, tableName) => {
  return {
    TableName: tableName,
    IndexName: 'UserMonthIndex',
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    }
  };
};

const _addMonthFilter = (params, month) => {
  params.KeyConditionExpression += ' AND #month = :month';
  params.ExpressionAttributeNames = { '#month': 'month' };
  params.ExpressionAttributeValues[':month'] = month;
};
