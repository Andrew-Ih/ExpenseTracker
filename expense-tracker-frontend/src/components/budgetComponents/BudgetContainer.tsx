'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Tabs, Tab } from '@mui/material';
import BudgetList from './BudgetList';
import BudgetForm from './BudgetForm';
import BudgetSummary from './BudgetSummary';
import BudgetHistory from './BudgetHistory';
import { getBudgets, Budget } from '@/services/budgetService';
import { useBudgetProgress } from '@/hooks/useBudgetProgress';

const BudgetContainer = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  
  // Use custom hook for budget progress
  const { budgetProgress, loading: progressLoading, error: progressError } = useBudgetProgress(budgets, selectedMonth);

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
    <Box sx={{ 
      width: '100%', 
      maxWidth: 1200, 
      mx: 'auto',
      p: { xs: 1, md: 3 },
      overflowX: 'hidden'
    }}>
      <Typography 
        variant="h4" 
        gutterBottom
        sx={{
          fontSize: { xs: '1.75rem', md: '2.125rem' },
          fontWeight: 700,
          mb: { xs: 2, md: 3 }
        }}
      >
        Budget Management
      </Typography>

      <Paper sx={{ mb: { xs: 2, md: 3 }, overflow: 'hidden' }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          centered
          sx={{
            '& .MuiTabs-flexContainer': {
              justifyContent: { xs: 'space-between', md: 'center' }
            },
            '& .MuiTab-root': {
              fontSize: { xs: '0.875rem', md: '1rem' },
              fontWeight: 600,
              minHeight: { xs: 48, md: 56 },
              flex: { xs: 1, md: 'none' },
              textTransform: 'none',
              whiteSpace: 'nowrap'
            }
          }}
        >
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
            loading={loading || progressLoading}
            error={error || progressError}
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
            onDelete={handleBudgetDeleted}
            onUpdate={handleBudgetUpdated}
            budgetProgress={budgetProgress}
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
