import { GetCommand } from '@aws-sdk/lib-dynamodb';

export const verifyTransactionOwnership = async (docClient, transactionId, userId) => {
  const transaction = await _getTransactionById(docClient, transactionId);
  return _verifyOwnership(transaction, userId);
};

export const buildUpdateExpression = (updateData) => {
  const fields = ['amount', 'type', 'category', 'description', 'date'];

  const { updateExpressions, expressionAttributeNames, expressionAttributeValues } = _processUpdatableFields(updateData, fields);
  _addTimestampField(updateExpressions, expressionAttributeNames, expressionAttributeValues);
  _validateUpdateExpressions(updateExpressions);
  
  return {
    updateExpression: _formatUpdateExpression(updateExpressions),
    expressionAttributeNames,
    expressionAttributeValues
  };
};

export const buildTransactionQueryParams = (userId, options = {}) => {
  const params = _initializeBaseParams(userId);
  
  _addDateFilters(params, options);
  _addCategoryFilter(params, options.category);
  _addTypeFilter(params, options.type);
  _addPagination(params, options);
  
  return _cleanupParams(params);
};

// ******************************************************
// Helper functions for verifyTransactionOwnership
// ******************************************************
const _getTransactionById = async (docClient, transactionId) => {
  const getParams = {
    TableName: 'ExpenseTrackerTransactions',
    Key: { transactionId }
  };

  const { Item: transaction } = await docClient.send(new GetCommand(getParams));
  
  if (!transaction) {
    throw new Error('Transaction not found');
  }
  
  return transaction;
};

const _verifyOwnership = (transaction, userId) => {
  if (transaction.userId !== userId) {
    throw new Error('Unauthorized: Transaction belongs to another user');
  }
  return transaction;
};

// ******************************************************
// Helper functions for buildUpdateExpression
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
  // Check if there are fields to update (besides updatedAt)
  if (expressions.length === 1) { // Only updatedAt
    throw new Error('No fields to update');
  }
};

const _formatUpdateExpression = (expressions) => {
  return `set ${expressions.join(', ')}`;
};

// ******************************************************
// Helper functions buildTransactionQueryParams
// ******************************************************
const _initializeBaseParams = (userId) => {
  return {
    TableName: 'ExpenseTrackerTransactions',
    IndexName: 'UserDateIndex',
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    },
    ScanIndexForward: false // Sort in descending order (latest first)
  };
};

const _addDateFilters = (params, options) => {
  if (!options.startDate && !options.endDate) return;
  
  params.ExpressionAttributeNames = params.ExpressionAttributeNames || {};
  params.ExpressionAttributeNames['#date'] = 'date';
  
  if (options.startDate && options.endDate) {
    params.KeyConditionExpression += ' AND #date BETWEEN :startDate AND :endDate';
    params.ExpressionAttributeValues[':startDate'] = options.startDate;
    params.ExpressionAttributeValues[':endDate'] = options.endDate;
  } else if (options.startDate) {
    params.KeyConditionExpression += ' AND #date >= :startDate';
    params.ExpressionAttributeValues[':startDate'] = options.startDate;
  } else if (options.endDate) {
    params.KeyConditionExpression += ' AND #date <= :endDate';
    params.ExpressionAttributeValues[':endDate'] = options.endDate;
  }
};

const _addCategoryFilter = (params, category) => {
  if (!category) return;
  
  params.FilterExpression = 'category = :category';
  params.ExpressionAttributeValues[':category'] = category;
};

const _addTypeFilter = (params, type) => {
  if (!type) return;
  
  params.ExpressionAttributeNames = params.ExpressionAttributeNames || {};
  params.ExpressionAttributeNames['#type'] = 'type';
  
  const typeExpression = '#type = :type';
  params.FilterExpression = params.FilterExpression 
    ? `${params.FilterExpression} AND ${typeExpression}` 
    : typeExpression;
  params.ExpressionAttributeValues[':type'] = type;
};

const _addPagination = (params, options) => {
  if (options.limit) {
    params.Limit = options.limit;
  }
  
  if (options.lastEvaluatedKey) {
    params.ExclusiveStartKey = options.lastEvaluatedKey;
  }
};

const _cleanupParams = (params) => {
  if (params.ExpressionAttributeNames && Object.keys(params.ExpressionAttributeNames).length === 0) {
    delete params.ExpressionAttributeNames;
  }
  
  return params;
};
