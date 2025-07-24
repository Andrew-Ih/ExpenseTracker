'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Tabs, Tab } from '@mui/material';
import BudgetList from './BudgetList';
import BudgetForm from './BudgetForm';
import { getBudgets, Budget } from '@/services/budgetService';

const BudgetContainer = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

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
        </Tabs>
      </Paper>

      {activeTab === 0 && (
        <BudgetList 
          budgets={budgets}
          loading={loading}
          error={error}
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
          onDelete={handleBudgetDeleted}
          onUpdate={handleBudgetUpdated}
        />
      )}

      {activeTab === 1 && (
        <BudgetForm onBudgetAdded={handleBudgetAdded} />
      )}
    </Box>
  );
};

export default BudgetContainer;
