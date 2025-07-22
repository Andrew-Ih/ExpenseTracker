import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { verifyTransactionOwnership, buildUpdateExpression, buildTransactionQueryParams } from '../helpers/transactions/transactionModelHelpers.js';

const dbClient = (() => {
  const client = new DynamoDBClient({ region: 'ca-central-1' });
  return DynamoDBDocumentClient.from(client);
})();

class TransactionModel {
  static TABLE_NAME = 'ExpenseTrackerTransactions';
  
  static createTransactionItem(transactionData, userId) {
    const currentDate = new Date().toISOString();
    const dateOnly = currentDate.split('T')[0];
    
    return {
      transactionId: uuidv4(),
      userId,
      amount: transactionData.amount,
      type: transactionData.type,
      category: transactionData.category,
      description: transactionData.description,
      date: transactionData.date || dateOnly,
      createdAt: dateOnly,
      updatedAt: dateOnly
    };
  }

  static async createTransaction(transactionData, userId) {
    const item = this.createTransactionItem(transactionData, userId);
    
    const params = {
      TableName: this.TABLE_NAME,
      Item: item
    };
    
    await dbClient.send(new PutCommand(params));
    return item;
  }

  static async getTransactions(userId, options = {}) {
    const params = buildTransactionQueryParams(userId, options, this.TABLE_NAME);
    const { Items, LastEvaluatedKey } = await dbClient.send(new QueryCommand(params));
    
    return {
      transactions: Items || [],
      lastEvaluatedKey: LastEvaluatedKey
    };
  }

  static async updateTransactionById(transactionId, userId, updateData) {
    await verifyTransactionOwnership(dbClient, transactionId, userId, this.TABLE_NAME);
    
    const { 
      updateExpression, 
      expressionAttributeNames, 
      expressionAttributeValues 
    } = buildUpdateExpression(updateData);
    
    const params = {
      TableName: this.TABLE_NAME,
      Key: { transactionId },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    };
    
    const result = await dbClient.send(new UpdateCommand(params));
    return result.Attributes;
  }

  static async deleteTransactionById(transactionId, userId) {
    await verifyTransactionOwnership(dbClient, transactionId, userId, this.TABLE_NAME);
    
    const params = {
      TableName: this.TABLE_NAME,
      Key: { transactionId },
      ReturnValues: 'ALL_OLD'
    };
    
    const result = await dbClient.send(new DeleteCommand(params));
    return result.Attributes;
  }
}

export default TransactionModel;
