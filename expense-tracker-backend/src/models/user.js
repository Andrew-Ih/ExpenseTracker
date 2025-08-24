import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: 'ca-central-1' });
const docClient = DynamoDBDocumentClient.from(client);

class UserModel {
  static TABLE_NAME = `ExpenseTrackerUsers-${process.env.NODE_ENV || 'dev'}`;

  static async create(userData) {
    const params = {
      TableName: this.TABLE_NAME,
      Item: {
        userId: userData.userId,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email
      }
    };
    
    await docClient.send(new PutCommand(params));
    return params.Item;
  }

  static async getById(userId) {
    const params = {
      TableName: this.TABLE_NAME,
      Key: { userId }
    };
    
    const result = await docClient.send(new GetCommand(params));
    return result.Item;
  }

  static async updateById(userId, updateData) {
    // Build update expression dynamically
    const updateExpressions = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};

    // Only update fields that are provided
    if (updateData.firstName !== undefined) {
      updateExpressions.push('#fn = :fn');
      expressionAttributeNames['#fn'] = 'firstName';
      expressionAttributeValues[':fn'] = updateData.firstName;
    }

    if (updateData.lastName !== undefined) {
      updateExpressions.push('#ln = :ln');
      expressionAttributeNames['#ln'] = 'lastName';
      expressionAttributeValues[':ln'] = updateData.lastName;
    }
    
    // If no fields to update, return null
    if (updateExpressions.length === 0) {
      return null;
    }

    const params = {
      TableName: this.TABLE_NAME,
      Key: { userId },
      UpdateExpression: `set ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    };

    const result = await docClient.send(new UpdateCommand(params));
    return result.Attributes;
  }

  static async deleteById(userId) {
    const params = {
      TableName: this.TABLE_NAME,
      Key: { userId },
      ReturnValues: 'ALL_OLD'  // Return deleted item
    };
    
    const result = await docClient.send(new DeleteCommand(params));
    
    // Check if item actually existed
    if (!result.Attributes) {
      return { success: false, message: 'User not found' };
    }
    
    return { success: true };
  }
}

export default UserModel;
