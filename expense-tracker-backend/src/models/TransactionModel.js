import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand, UpdateCommand, DeleteCommand, BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { verifyTransactionOwnership, buildUpdateExpression, buildTransactionQueryParams } from '../helpers/transactions/transactionModelHelpers.js';

const dbClient = (() => {
  const client = new DynamoDBClient({ region: 'ca-central-1' });
  return DynamoDBDocumentClient.from(client);
})();

class TransactionModel {
  static TABLE_NAME = `ExpenseTrackerTransactions-${process.env.NODE_ENV || 'dev'}`;
  
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

  static async createRecurringInstances(recurringTemplate, userId) {
    const { templateData, frequency, dayOfMonth, monthOfYear, dayOfMonth2, startMonth, startYear, endMonth, endYear } = recurringTemplate;
    const transactions = [];
    
    if (frequency === 'monthly') {
      transactions.push(...this.generateMonthlyTransactions(templateData, dayOfMonth, startMonth, startYear, endMonth, endYear, recurringTemplate.recurringId, userId));
    } else if (frequency === 'yearly') {
      transactions.push(...this.generateYearlyTransactions(templateData, dayOfMonth, monthOfYear, startYear, endYear, recurringTemplate.recurringId, userId));
    } else if (frequency === 'bi-weekly') {
      transactions.push(...this.generateBiWeeklyTransactions(templateData, dayOfMonth, dayOfMonth2, startMonth, startYear, endMonth, endYear, recurringTemplate.recurringId, userId));
    }
    
    // Batch write to DynamoDB
    await this.batchCreateTransactions(transactions);
    return transactions;
  }

  static generateMonthlyTransactions(templateData, dayOfMonth, startMonth, startYear, endMonth, endYear, recurringId, userId) {
    const transactions = [];
    let currentYear = parseInt(startYear);
    let currentMonth = parseInt(startMonth);
    const endYearInt = parseInt(endYear);
    const endMonthInt = parseInt(endMonth);
    
    while (currentYear < endYearInt || (currentYear === endYearInt && currentMonth <= endMonthInt)) {
      const actualDay = this.getActualDayForMonth(dayOfMonth, currentMonth, currentYear);
      const transactionDate = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${actualDay.toString().padStart(2, '0')}`;
      
      const transaction = {
        ...templateData,
        date: transactionDate,
        recurringId,
        isRecurring: true
      };
      
      transactions.push(this.createTransactionItem(transaction, userId));
      
      currentMonth++;
      if (currentMonth > 12) {
        currentMonth = 1;
        currentYear++;
      }
      
      if (transactions.length > 120) break;
    }
    
    return transactions;
  }

  static generateYearlyTransactions(templateData, dayOfMonth, monthOfYear, startYear, endYear, recurringId, userId) {
    const transactions = [];
    
    for (let year = parseInt(startYear); year <= parseInt(endYear); year++) {
      const actualDay = this.getActualDayForMonth(dayOfMonth, monthOfYear, year);
      const transactionDate = `${year}-${monthOfYear.toString().padStart(2, '0')}-${actualDay.toString().padStart(2, '0')}`;
      
      const transaction = {
        ...templateData,
        date: transactionDate,
        recurringId,
        isRecurring: true
      };
      
      transactions.push(this.createTransactionItem(transaction, userId));
      
      if (transactions.length > 20) break; // Max 20 years
    }
    
    return transactions;
  }

  static generateBiWeeklyTransactions(templateData, dayOfMonth1, dayOfMonth2, startMonth, startYear, endMonth, endYear, recurringId, userId) {
    const transactions = [];
    let currentYear = parseInt(startYear);
    let currentMonth = parseInt(startMonth);
    const endYearInt = parseInt(endYear);
    const endMonthInt = parseInt(endMonth);
    
    while (currentYear < endYearInt || (currentYear === endYearInt && currentMonth <= endMonthInt)) {
      // First transaction of the month
      const actualDay1 = this.getActualDayForMonth(dayOfMonth1, currentMonth, currentYear);
      const transactionDate1 = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${actualDay1.toString().padStart(2, '0')}`;
      
      transactions.push(this.createTransactionItem({
        ...templateData,
        date: transactionDate1,
        recurringId,
        isRecurring: true
      }, userId));
      
      // Second transaction of the month
      const actualDay2 = this.getActualDayForMonth(dayOfMonth2, currentMonth, currentYear);
      const transactionDate2 = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-${actualDay2.toString().padStart(2, '0')}`;
      
      transactions.push(this.createTransactionItem({
        ...templateData,
        date: transactionDate2,
        recurringId,
        isRecurring: true
      }, userId));
      
      currentMonth++;
      if (currentMonth > 12) {
        currentMonth = 1;
        currentYear++;
      }
      
      if (transactions.length > 240) break; // Max 10 years of bi-weekly
    }
    
    return transactions;
  }

  // Helper method to handle end-of-month scenarios
  static getActualDayForMonth(requestedDay, month, year) {
    const daysInMonth = new Date(year, month, 0).getDate();
    
    // If requested day exists in this month, use it
    if (requestedDay <= daysInMonth) {
      return requestedDay;
    }
    
    // Otherwise, use the last day of the month
    return daysInMonth;
  }

  static async batchCreateTransactions(transactions) {
    // DynamoDB batch write limit is 25 items
    const batchSize = 25;
    
    for (let i = 0; i < transactions.length; i += batchSize) {
      const batch = transactions.slice(i, i + batchSize);
      const putRequests = batch.map(transaction => ({
        PutRequest: {
          Item: transaction
        }
      }));
      
      const params = {
        RequestItems: {
          [this.TABLE_NAME]: putRequests
        }
      };
      
      await dbClient.send(new BatchWriteCommand(params));
    }
  }
}

export default TransactionModel;
