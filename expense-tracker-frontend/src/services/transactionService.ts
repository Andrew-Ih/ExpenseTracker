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

export interface RecurringTransaction {
  recurringId?: string;
  templateData: Transaction;
  frequency: 'monthly' | 'yearly' | 'bi-weekly';
  dayOfMonth: number; // 1-31
  monthOfYear?: number; // 1-12 (for yearly only)
  dayOfMonth2?: number; // 1-31 (for bi-weekly only)
  startMonth: number; // 1-12
  startYear: number; // YYYY
  endMonth: number; // 1-12
  endYear: number; // YYYY
  isActive?: boolean;
}

export const createRecurringTransaction = async (recurringData: RecurringTransaction) => {
  const response = await fetch(`${API_BASE_URL}/api/transactions/createRecurring`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(recurringData)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create recurring transaction');
  }

  return response.json();
};

export const getRecurringTransactions = async () => {
  const response = await fetch(`${API_BASE_URL}/api/transactions/getRecurring`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch recurring transactions');
  }

  return response.json();
};

export const updateRecurringTransaction = async (recurringId: string, updateData: Partial<RecurringTransaction>) => {
  const response = await fetch(`${API_BASE_URL}/api/transactions/updateRecurring`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ recurringId, ...updateData })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update recurring transaction');
  }

  return response.json();
};

export const deleteRecurringTransaction = async (recurringId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/transactions/deleteRecurring`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ recurringId })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete recurring transaction');
  }

  return response.json();
};

export interface TransactionSummary {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  transactionCount: number;
  incomeCount: number;
  expenseCount: number;
}

export const getTransactionSummary = async (month?: number, year?: number, period?: string) => {
  const params = new URLSearchParams();
  if (month) params.append('month', month.toString());
  if (year) params.append('year', year.toString());
  if (period) params.append('period', period);

  const response = await fetch(`${API_BASE_URL}/api/transactions/getSummary?${params.toString()}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch transaction summary');
  }

  return response.json();
};

export const getAllTimeTransactionSummary = async () => {
  const response = await fetch(`${API_BASE_URL}/api/transactions/getAllTimeSummary`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch all-time transaction summary');
  }

  return response.json();
};