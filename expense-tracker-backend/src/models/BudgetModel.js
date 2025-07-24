import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';

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
    const params = {
      TableName: this.TABLE_NAME,
      IndexName: 'UserMonthIndex',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    };

    if (month) {
      params.KeyConditionExpression += ' AND #month = :month';
      params.ExpressionAttributeNames = { '#month': 'month' };
      params.ExpressionAttributeValues[':month'] = month;
    }

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
    const params = {
      TableName: this.TABLE_NAME,
      IndexName: 'UserMonthIndex',
      KeyConditionExpression: 'userId = :userId AND #month = :month',
      FilterExpression: 'category = :category',
      ExpressionAttributeNames: { '#month': 'month' },
      ExpressionAttributeValues: {
        ':userId': userId,
        ':month': month,
        ':category': category
      }
    };

    const { Items } = await dbClient.send(new QueryCommand(params));
    return Items && Items.length > 0;
  }

  static async copyBudgetsToNextMonth(userId, fromMonth, toMonth) {
    const sourceBudgets = await this.getBudgets(userId, fromMonth);
    const copiedBudgets = [];

    for (const budget of sourceBudgets) {
      const newBudget = this.createBudgetItem({
        category: budget.category,
        amount: budget.amount,
        month: toMonth
      }, userId);

      const params = {
        TableName: this.TABLE_NAME,
        Item: newBudget
      };

      await dbClient.send(new PutCommand(params));
      copiedBudgets.push(newBudget);
    }

    return copiedBudgets;
  }

  static async updateBudgetById(budgetId, userId, updateData) {
    const updateExpressions = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = { ':userId': userId };

    if (updateData.amount !== undefined) {
      updateExpressions.push('#amount = :amount');
      expressionAttributeNames['#amount'] = 'amount';
      expressionAttributeValues[':amount'] = updateData.amount;
    }

    if (updateData.category !== undefined) {
      updateExpressions.push('#category = :category');
      expressionAttributeNames['#category'] = 'category';
      expressionAttributeValues[':category'] = updateData.category;
    }

    updateExpressions.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = new Date().toISOString().split('T')[0];

    const params = {
      TableName: this.TABLE_NAME,
      Key: { budgetId },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ConditionExpression: 'userId = :userId',
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    };

    const result = await dbClient.send(new UpdateCommand(params));
    return result.Attributes;
  }

  static async deleteBudgetById(budgetId, userId) {
    const params = {
      TableName: this.TABLE_NAME,
      Key: { budgetId },
      ConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: { ':userId': userId },
      ReturnValues: 'ALL_OLD'
    };

    const result = await dbClient.send(new DeleteCommand(params));
    return result.Attributes;
  }
}

export default BudgetModel;