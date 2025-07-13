import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: 'ca-central-1' });
const docClient = DynamoDBDocumentClient.from(client);

class UserModel {
  static async create(userData) {
    const params = {
      TableName: 'ExpenseTrackerUsers',
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
      TableName: 'ExpenseTrackerUsers',
      Key: { userId }
    };
    
    const result = await docClient.send(new GetCommand(params));
    return result.Item;
  }
}

export default UserModel;
