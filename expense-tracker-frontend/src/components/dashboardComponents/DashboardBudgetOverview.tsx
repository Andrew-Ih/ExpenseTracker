'use client';

import { useState, useEffect, useCallback } from 'react';
import { Box, Paper, Typography, Stack, LinearProgress, Chip, Alert, Pagination } from '@mui/material';
import { AccountBalance, Warning } from '@mui/icons-material';
import { Budget } from '@/services/budgetService';
import { getTransactions, Transaction } from '@/services/transactionService';
import { formatCurrency } from '@/utils/formatCurrency';

interface DashboardBudgetOverviewProps {
  budgets: Budget[];
}

const DashboardBudgetOverview = ({ budgets }: DashboardBudgetOverviewProps) => {
  const [budgetProgress, setBudgetProgress] = useState<Record<string, number>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const budgetsPerPage = 3; // Show 3 budgets per page

  const fetchBudgetProgress = useCallback(async () => {
    const progress: Record<string, number> = {};
    
    try {
      for (const budget of budgets) {
        try {
          const currentMonth = new Date().toISOString().slice(0, 7);
          const startDate = `${currentMonth}-01`;
          const endDate = `${currentMonth}-31`;
          
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
    } catch (error) {
      console.error('Error fetching budget progress:', error);
    } 
  }, [budgets]);

  useEffect(() => {
    if (budgets.length > 0) {
      fetchBudgetProgress();
    }
  }, [budgets, fetchBudgetProgress]);

  const getBudgetProgress = (budgetId: string, budgetAmount: number) => {
    const spent = budgetProgress[budgetId] || 0;
    return (spent / budgetAmount) * 100;
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'error';
    if (progress >= 80) return 'warning';
    return 'success';
  };

  const getOverBudgetCategories = () => {
    return budgets.filter(budget => {
      if (!budget.budgetId) return false;
      const progress = getBudgetProgress(budget.budgetId, budget.amount);
      return progress >= 100;
    });
  };

  const overBudgetCategories = getOverBudgetCategories();

  // Pagination logic
  const totalPages = Math.ceil(budgets.length / budgetsPerPage);
  const startIndex = (currentPage - 1) * budgetsPerPage;
  const endIndex = startIndex + budgetsPerPage;
  const currentBudgets = budgets.slice(startIndex, endIndex);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const getCurrentMonthName = () => {
    const currentDate = new Date();
    const monthName = currentDate.toLocaleDateString('en-US', { month: 'long' });
    const year = currentDate.getFullYear();
    return `${monthName} ${year}`;
  };

  if (budgets.length === 0) {
    return (
      <Paper sx={{ p: 3, height: '100%' }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccountBalance />
          Budget Overview
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary" 
          sx={{ 
            textAlign: 'center', 
            py: 4,
            fontStyle: 'italic'
          }}
        >
          No budgets set for this month
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AccountBalance />
        Budget Overview
      </Typography>
      
      <Chip 
        label={getCurrentMonthName()} 
        size="small" 
        color="primary" 
        variant="outlined"
        sx={{ mb: 2 }}
      />
      
      {overBudgetCategories.length > 0 && (
        <Alert 
          severity="warning" 
          icon={<Warning />}
          sx={{ mb: 2 }}
        >
          {overBudgetCategories.length} categor{overBudgetCategories.length === 1 ? 'y is' : 'ies are'} over budget
        </Alert>
      )}
      
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: 300,
        position: 'relative'
      }}>
        <Box sx={{ 
          flex: 1,
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: 6,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(0,0,0,0.1)',
            borderRadius: 3,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.3)',
            borderRadius: 3,
          },
        }}>
          <Stack spacing={2}>
            {currentBudgets.map((budget) => {
              if (!budget.budgetId) return null;
              
              const progress = getBudgetProgress(budget.budgetId, budget.amount);
              const spent = budgetProgress[budget.budgetId] || 0;
              const remaining = budget.amount - spent;
              
              return (
                <Box key={budget.budgetId}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" fontWeight={500}>
                      {budget.category}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {progress.toFixed(0)}%
                    </Typography>
                  </Box>
                  
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min(progress, 100)}
                    color={getProgressColor(progress)}
                    sx={{ height: 6, borderRadius: 3, mb: 1 }}
                  />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" color="text.secondary">
                      {formatCurrency(spent)} / {formatCurrency(budget.amount)}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color={remaining >= 0 ? 'success.main' : 'error.main'}
                      fontWeight={500}
                    >
                      {remaining >= 0 ? `+${formatCurrency(remaining)}` : formatCurrency(Math.abs(remaining))} remaining
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Stack>
        </Box>

        {totalPages > 1 && (
          <Box sx={{ 
            position: 'absolute', 
            bottom: 0, 
            left: 0, 
            right: 0, 
            display: 'flex', 
            justifyContent: 'center', 
            py: 1
          }}>
            <Pagination 
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              size="small"
              sx={{
                '& .MuiPaginationItem-root': {
                  fontSize: '0.875rem',
                },
              }}
            />
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default DashboardBudgetOverview; 