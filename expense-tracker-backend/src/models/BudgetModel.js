import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { verifyBudgetOwnership, buildBudgetUpdateExpression, buildBudgetQueryParams, buildDuplicateCheckParams } from '../helpers/budgets/budgetModelHelpers.js';

const dbClient = (() => {
  const client = new DynamoDBClient({ region: 'ca-central-1' });
  return DynamoDBDocumentClient.from(client);
})();

class BudgetModel {
  static TABLE_NAME = 'ExpenseTrackerBudgets';
  
  static createBudgetItem(budgetData, userId) {
    const currentDate = new Date().toISOString().split('T')[0];
    
    return {
      budgetId: uuidv4(),
      userId,
      category: budgetData.category,
      amount: budgetData.amount,
      month: budgetData.month, // Format: YYYY-MM
      createdAt: currentDate,
      updatedAt: currentDate
    };
  }

  static async createBudget(budgetData, userId) {
    // Check for duplicate budget
    const isDuplicate = await this.checkDuplicateBudget(userId, budgetData.category, budgetData.month);
    if (isDuplicate) {
      throw new Error(`Budget for ${budgetData.category} already exists for ${budgetData.month}`);
    }

    const item = this.createBudgetItem(budgetData, userId);
    
    const params = {
      TableName: this.TABLE_NAME,
      Item: item
    };
    
    await dbClient.send(new PutCommand(params));
    return item;
  }

  static async getBudgets(userId, month = null) {
    const params = buildBudgetQueryParams(userId, month, this.TABLE_NAME);
    const { Items } = await dbClient.send(new QueryCommand(params));
    return Items || [];
  }

  static async getBudgetHistory(userId, months) {
    const results = [];
    
    for (const month of months) {
      const budgets = await this.getBudgets(userId, month);
      results.push({ month, budgets });
    }
    
    return results;
  }

  static async checkDuplicateBudget(userId, category, month) {
    const params = buildDuplicateCheckParams(userId, category, month, this.TABLE_NAME);
    const { Items } = await dbClient.send(new QueryCommand(params));
    return Items && Items.length > 0;
  }



  static async updateBudgetById(budgetId, userId, updateData) {
    await verifyBudgetOwnership(dbClient, budgetId, userId, this.TABLE_NAME);
    
    const { 
      updateExpression, 
      expressionAttributeNames, 
      expressionAttributeValues 
    } = buildBudgetUpdateExpression(updateData);
    
    const params = {
      TableName: this.TABLE_NAME,
      Key: { budgetId },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    };
    
    const result = await dbClient.send(new UpdateCommand(params));
    return result.Attributes;
  }

  static async deleteBudgetById(budgetId, userId) {
    await verifyBudgetOwnership(dbClient, budgetId, userId, this.TABLE_NAME);
    
    const params = {
      TableName: this.TABLE_NAME,
      Key: { budgetId },
      ReturnValues: 'ALL_OLD'
    };
    
    const result = await dbClient.send(new DeleteCommand(params));
    return result.Attributes;
  }
}

export default BudgetModel;
