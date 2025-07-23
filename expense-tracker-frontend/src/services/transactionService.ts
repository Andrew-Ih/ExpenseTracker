const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Transaction {
  transactionId?: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date: string;
}

export interface TransactionQueryParams {
  startDate?: string;
  endDate?: string;
  category?: string;
  type?: 'income' | 'expense';
  limit?: number;
  lastEvaluatedKey?: string;
}

export const createTransaction = async (transaction: Transaction) => {
  const response = await fetch(`${API_BASE_URL}/api/transactions/createTransaction`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(transaction)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create transaction');
  }

  return response.json();
};

export const getTransactions = async (queryParams: TransactionQueryParams = {}) => {
  const response = await fetch(`${API_BASE_URL}/api/transactions/getTransactions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(queryParams)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch transactions');
  }

  return response.json();
};

export const updateTransaction = async (transactionId: string, updateData: Partial<Transaction>) => {
  const response = await fetch(`${API_BASE_URL}/api/transactions/updateTransaction`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ transactionId, ...updateData })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update transaction');
  }

  return response.json();
};

export const deleteTransaction = async (transactionId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/transactions/deleteTransaction`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ transactionId })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete transaction');
  }

  return response.json();
};