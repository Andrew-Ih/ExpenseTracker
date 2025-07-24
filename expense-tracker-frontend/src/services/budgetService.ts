const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Budget {
  budgetId?: string;
  category: string;
  amount: number;
  month: string; // Format: YYYY-MM
}

export const createBudget = async (budget: Budget) => {
  const response = await fetch(`${API_BASE_URL}/api/budget/createBudget`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(budget)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create budget');
  }

  return response.json();
};

export const getBudgets = async (month?: string) => {
  const url = new URL(`${API_BASE_URL}/api/budget/getBudgets`);
  if (month) {
    url.searchParams.append('month', month);
  }

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch budgets');
  }

  return response.json();
};

export const updateBudget = async (budgetId: string, updateData: Partial<Budget>) => {
  const response = await fetch(`${API_BASE_URL}/api/budget/updateBudget`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ budgetId, ...updateData })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update budget');
  }

  return response.json();
};

export const deleteBudget = async (budgetId: string) => {
  const response = await fetch(`${API_BASE_URL}/api/budget/deleteBudget`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ budgetId })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete budget');
  }

  return response.json();
};

export const getBudgetHistory = async (months: string[]) => {
  const response = await fetch(`${API_BASE_URL}/api/budget/getBudgetHistory?months=${months.join(',')}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch budget history');
  }

  return response.json();
};

export const copyBudgetsToNextMonth = async (fromMonth: string, toMonth: string) => {
  const response = await fetch(`${API_BASE_URL}/api/budget/copyBudgets`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ fromMonth, toMonth })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to copy budgets');
  }

  return response.json();
};