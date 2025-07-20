import { GetCommand } from '@aws-sdk/lib-dynamodb';

export const verifyTransactionOwnership = async (docClient, transactionId, userId) => {
  const getParams = {
    TableName: 'ExpenseTrackerTransactions',
    Key: { transactionId }
  };

  const { Item: transaction } = await docClient.send(new GetCommand(getParams));

  if (!transaction) {
    throw new Error('Transaction not found');
  }

  if (transaction.userId !== userId) {
    throw new Error('Unauthorized: Transaction belongs to another user');
  }

  return transaction;
};
