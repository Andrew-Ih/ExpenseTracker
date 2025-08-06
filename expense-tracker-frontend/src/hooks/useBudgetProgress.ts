import { useState, useEffect } from 'react';
import { Budget } from '@/services/budgetService';
import { getTransactions, Transaction } from '@/services/transactionService';
import { getMonthDateRange } from '@/utils/formatCurrency';

export const useBudgetProgress = (budgets: Budget[], selectedMonth: string) => {
  const [budgetProgress, setBudgetProgress] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBudgetProgress = async () => {
      // Validate year from selectedMonth - only proceed if it's a valid 4-digit year
      const year = selectedMonth.split('-')[0];
      if (!year || year.length !== 4 || isNaN(parseInt(year))) {
        setBudgetProgress({});
        return;
      }

      if (budgets.length === 0) {
        setBudgetProgress({});
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { startDate, endDate } = getMonthDateRange(selectedMonth);
        const progress: Record<string, number> = {};
        
        for (const budget of budgets) {
          try {
            const result = await getTransactions({
              startDate,
              endDate,
              category: budget.category,
              type: 'expense'
            });
            
            const totalSpent = result.transactions.reduce((sum: number, transaction: Transaction) => 
              sum + parseFloat(transaction.amount.toString()), 0
            );
            
            if (budget.budgetId) {
              progress[budget.budgetId] = totalSpent;
            }
          } catch (error) {
            console.error('Error fetching progress for', budget.category, error);
            // Continue with other budgets even if one fails
          }
        }
        
        setBudgetProgress(progress);
      } catch (error) {
        console.error('Error fetching budget progress:', error);
        setError('Failed to fetch budget progress');
      } finally {
        setLoading(false);
      }
    };

    fetchBudgetProgress();
  }, [budgets, selectedMonth]);

  return { budgetProgress, loading, error };
}; 