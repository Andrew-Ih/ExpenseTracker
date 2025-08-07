import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand, BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

const dbClient = (() => {
  const client = new DynamoDBClient({ region: 'ca-central-1' });
  return DynamoDBDocumentClient.from(client);
})();

class ChatHistoryModel {
  static TABLE_NAME = 'ExpenseTrackerChatHistory-dev';
  
  static createChatMessageItem(userId, message, role = 'user') {
    const currentDate = new Date().toISOString();
    
    return {
      messageId: uuidv4(),
      userId,
      role, // 'user' or 'assistant'
      content: message,
      timestamp: currentDate,
      createdAt: currentDate.split('T')[0]
    };
  }

  static async saveMessage(userId, message, role = 'user') {
    const item = this.createChatMessageItem(userId, message, role);
    
    const params = {
      TableName: this.TABLE_NAME,
      Item: item
    };
    
    await dbClient.send(new PutCommand(params));
    return item;
  }

  static async getRecentMessages(userId, limit = 10) {
    const params = {
      TableName: this.TABLE_NAME,
      IndexName: 'UserTimestampIndex',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false, // Get most recent first
      Limit: limit
    };
    
    const { Items } = await dbClient.send(new QueryCommand(params));
    return (Items || []).reverse(); // Return in chronological order
  }

  static async clearChatHistory(userId) {
    try {
      // Get all messages for the user
      const messages = await this.getRecentMessages(userId, 1000);
      
      // If no messages to delete, return early
      if (!messages || messages.length === 0) {
        console.log('No messages found to delete for user:', userId);
        return;
      }
      
      // Delete messages in batches
      const batchSize = 25;
      for (let i = 0; i < messages.length; i += batchSize) {
        const batch = messages.slice(i, i + batchSize);
        
        // Filter out messages without valid messageId
        const validMessages = batch.filter(message => message && message.messageId);
        
        if (validMessages.length === 0) {
          continue;
        }
        
        const deleteRequests = validMessages.map(message => ({
          DeleteRequest: {
            Key: { messageId: message.messageId }
          }
        }));
        
        const params = {
          RequestItems: {
            [this.TABLE_NAME]: deleteRequests
          }
        };
        
        console.log('Deleting batch:', deleteRequests.length, 'messages');
        await dbClient.send(new BatchWriteCommand(params));
      }
      
      console.log('Successfully cleared chat history for user:', userId);
    } catch (error) {
      console.error('Error clearing chat history:', error);
      throw error;
    }
  }
}

export default ChatHistoryModel; 