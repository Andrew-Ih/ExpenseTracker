'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Tabs, Tab } from '@mui/material';
import BudgetList from './BudgetList';
import BudgetForm from './BudgetForm';
import BudgetSummary from './BudgetSummary';
import BudgetHistory from './BudgetHistory';
import { getBudgets, Budget } from '@/services/budgetService';
import { getTransactions, Transaction } from '@/services/transactionService';

const BudgetContainer = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [budgetProgress, setBudgetProgress] = useState<Record<string, number>>({});

  const fetchBudgets = async (month?: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getBudgets(month);
      setBudgets(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch budgets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets(selectedMonth);
  }, [selectedMonth]);

  useEffect(() => {
    const fetchBudgetProgress = async () => {
      const progress: Record<string, number> = {};
      
      for (const budget of budgets) {
        try {
          const startDate = `${selectedMonth}-01`;
          const endDate = `${selectedMonth}-31`;
          
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
        }
      }
      
      setBudgetProgress(progress);
    };

    if (budgets.length > 0) {
      fetchBudgetProgress();
    }
  }, [budgets, selectedMonth]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleBudgetAdded = () => {
    fetchBudgets(selectedMonth);
  };

  const handleBudgetDeleted = (budgetId: string) => {
    setBudgets(prev => prev.filter(b => b.budgetId !== budgetId));
  };

  const handleBudgetUpdated = (updatedBudget: Budget) => {
    setBudgets(prev => 
      prev.map(b => b.budgetId === updatedBudget.budgetId ? updatedBudget : b)
    );
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Budget Management
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="View Budgets" />
          <Tab label="Add Budget" />
          <Tab label="Budget History" />
        </Tabs>
      </Paper>

      {activeTab === 0 && (
        <>
          <BudgetSummary budgets={budgets} budgetProgress={budgetProgress} />
          <BudgetList 
            budgets={budgets}
            loading={loading}
            error={error}
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
            onDelete={handleBudgetDeleted}
            onUpdate={handleBudgetUpdated}
          />
        </>
      )}

      {activeTab === 1 && (
        <BudgetForm onBudgetAdded={handleBudgetAdded} />
      )}

      {activeTab === 2 && (
        <BudgetHistory selectedMonth={selectedMonth} />
      )}
    </Box>
  );
};

export default BudgetContainer;
