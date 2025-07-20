import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { verifyTransactionOwnership, buildUpdateExpression } from '../helpers/transactions/transactionModelHelpers.js';

const client = new DynamoDBClient({ region: 'ca-central-1' });
const docClient = DynamoDBDocumentClient.from(client);

class TransactionModel {
  static async createTransaction(transactionData, userId) {
    const currentDate = new Date().toISOString();
    const params = {
      TableName: 'ExpenseTrackerTransactions',
      Item: {
        transactionId: uuidv4(),
        userId: userId,
        amount: transactionData.amount,
        type: transactionData.type, // 'income' or 'expense'
        category: transactionData.category,
        description: transactionData.description,
        date: transactionData.date || currentDate.split('T')[0],
        createdAt: currentDate.split('T')[0],
        updatedAt: currentDate.split('T')[0]
      }
    };
    
    await docClient.send(new PutCommand(params));
    return params.Item;
  }

  static async updateTransactionById(transactionId, userId, updateData) {
    await verifyTransactionOwnership(docClient, transactionId, userId);
    
    const { 
        updateExpression, 
        expressionAttributeNames, 
        expressionAttributeValues 
    } = buildUpdateExpression(updateData);
    
    const params = {
        TableName: 'ExpenseTrackerTransactions',
        Key: { transactionId },
        UpdateExpression: updateExpression,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW'
    };
    
    const result = await docClient.send(new UpdateCommand(params));
    return result.Attributes;
  }


  static async deleteTransactionById(transactionId, userId) {
    await verifyTransactionOwnership(docClient, transactionId, userId);
    
    // Delete the transaction
    const deleteParams = {
        TableName: 'ExpenseTrackerTransactions',
        Key: { transactionId },
        ReturnValues: 'ALL_OLD' // Return the deleted item
    };
    
    const result = await docClient.send(new DeleteCommand(deleteParams));
    return result.Attributes; // Return the deleted transaction
  }
}

export default TransactionModel;
