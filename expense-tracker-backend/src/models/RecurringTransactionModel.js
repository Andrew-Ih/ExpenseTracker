import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

const dbClient = (() => {
  const client = new DynamoDBClient({ region: 'ca-central-1' });
  return DynamoDBDocumentClient.from(client);
})();

class RecurringTransactionModel {
  static TABLE_NAME = 'ExpenseTrackerRecurringTransactions-dev';
  
  static createRecurringItem(recurringData, userId) {
    const currentDate = new Date().toISOString().split('T')[0];
    
    return {
      recurringId: uuidv4(),
      userId,
      templateData: recurringData.templateData,
      frequency: recurringData.frequency,
      dayOfMonth: recurringData.dayOfMonth, // 1-31 (for monthly/yearly)
      monthOfYear: recurringData.monthOfYear, // 1-12 (for yearly only)
      dayOfMonth2: recurringData.dayOfMonth2, // 1-31 (for bi-weekly only)
      startMonth: recurringData.startMonth, // 1-12
      startYear: recurringData.startYear, // YYYY
      endMonth: recurringData.endMonth, // 1-12
      endYear: recurringData.endYear, // YYYY
      isActive: true,
      createdAt: currentDate,
      updatedAt: currentDate
    };
  }

  static async createRecurring(recurringData, userId) {
    const item = this.createRecurringItem(recurringData, userId);
    
    const params = {
      TableName: this.TABLE_NAME,
      Item: item
    };
    
    await dbClient.send(new PutCommand(params));
    return item;
  }

  static async getRecurringTransactions(userId) {
    const params = {
      TableName: this.TABLE_NAME,
      IndexName: 'UserRecurringIndex',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    };
    
    const { Items } = await dbClient.send(new QueryCommand(params));
    return Items || [];
  }

  static async updateRecurringById(recurringId, userId, updateData) {
    // Build update expression dynamically
    const updateExpressions = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    if (updateData.templateData !== undefined) {
      updateExpressions.push('#td = :td');
      expressionAttributeNames['#td'] = 'templateData';
      expressionAttributeValues[':td'] = updateData.templateData;
    }

    if (updateData.isActive !== undefined) {
      updateExpressions.push('#ia = :ia');
      expressionAttributeNames['#ia'] = 'isActive';
      expressionAttributeValues[':ia'] = updateData.isActive;
    }

    if (updateExpressions.length === 0) {
      throw new Error('No fields to update');
    }

    // Add updatedAt timestamp
    updateExpressions.push('#ua = :ua');
    expressionAttributeNames['#ua'] = 'updatedAt';
    expressionAttributeValues[':ua'] = new Date().toISOString().split('T')[0];

    const params = {
      TableName: this.TABLE_NAME,
      Key: { recurringId },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    };
    
    const result = await dbClient.send(new UpdateCommand(params));
    return result.Attributes;
  }

  static async deleteRecurringById(recurringId) {
    const params = {
      TableName: this.TABLE_NAME,
      Key: { recurringId },
      ReturnValues: 'ALL_OLD'
    };
    
    const result = await dbClient.send(new DeleteCommand(params));
    return result.Attributes;
  }
}

export default RecurringTransactionModel;