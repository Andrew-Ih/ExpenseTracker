import { GetCommand } from '@aws-sdk/lib-dynamodb';

export const verifyTransactionOwnership = async (docClient, transactionId, userId) => {
  const getParams = {
    TableName: 'ExpenseTrackerTransactions',
    Key: { transactionId }
  };

  const { Item: transaction } = await docClient.send(new GetCommand(getParams));

  if (!transaction) {
    throw new Error('Transaction not found');
  }

  if (transaction.userId !== userId) {
    throw new Error('Unauthorized: Transaction belongs to another user');
  }

  return transaction;
};

export const buildUpdateExpression = (updateData) => {
  const updateExpressions = [];
  const expressionAttributeNames = {};
  const expressionAttributeValues = {};
  
  // Process each updatable field
  const fields = ['amount', 'type', 'category', 'description', 'date'];
  
  fields.forEach(field => {
    if (updateData[field] !== undefined) {
      updateExpressions.push(`#${field} = :${field}`);
      expressionAttributeNames[`#${field}`] = field;
      expressionAttributeValues[`:${field}`] = updateData[field];
    }
  });
  
  // Add updatedAt timestamp
  const currentDate = new Date().toISOString();
  updateExpressions.push('#updatedAt = :updatedAt');
  expressionAttributeNames['#updatedAt'] = 'updatedAt';
  expressionAttributeValues[':updatedAt'] = currentDate.split('T')[0];
  
  // Check if there are fields to update
  if (updateExpressions.length === 1) { // Only updatedAt
    throw new Error('No fields to update');
  }
  
  return {
    updateExpression: `set ${updateExpressions.join(', ')}`,
    expressionAttributeNames,
    expressionAttributeValues
  };
};

export const buildTransactionQueryParams = (userId, options = {}) => {
  // Set up base query parameters
  const params = {
    TableName: 'ExpenseTrackerTransactions',
    IndexName: 'UserDateIndex',
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    }
  };
  
  // Initialize ExpressionAttributeNames
  if (options.startDate || options.endDate || options.type) {
    params.ExpressionAttributeNames = {};
  }
  
  // Add date attribute name and condition if needed
  if (options.startDate || options.endDate) {
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
  }
  
  // Add category filter if provided
  if (options.category) {
    params.FilterExpression = 'category = :category';
    params.ExpressionAttributeValues[':category'] = options.category;
  }
  
  // Add type filter if provided - use expression attribute name since 'type' is a reserved word
  if (options.type) {
    params.ExpressionAttributeNames['#type'] = 'type';
    const typeExpression = '#type = :type';
    params.FilterExpression = params.FilterExpression 
      ? `${params.FilterExpression} AND ${typeExpression}` 
      : typeExpression;
    params.ExpressionAttributeValues[':type'] = options.type;
  }
  
  // Add pagination if provided
  if (options.limit) {
    params.Limit = options.limit;
  }
  
  if (options.lastEvaluatedKey) {
    params.ExclusiveStartKey = options.lastEvaluatedKey;
  }
  
  // Remove ExpressionAttributeNames if empty
  if (params.ExpressionAttributeNames && Object.keys(params.ExpressionAttributeNames).length === 0) {
    delete params.ExpressionAttributeNames;
  }
  
  return params;
};

