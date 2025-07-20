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

