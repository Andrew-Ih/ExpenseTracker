import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

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

  
}

export default TransactionModel;
