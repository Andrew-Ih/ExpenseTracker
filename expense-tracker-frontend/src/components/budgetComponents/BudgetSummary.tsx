'use client';

import { Box, Paper, Typography, Stack, LinearProgress } from '@mui/material';
import { TrendingUp, TrendingDown, AccountBalance } from '@mui/icons-material';
import { Budget } from '@/services/budgetService';
import { formatCurrency } from '@/utils/formatCurrency';

interface BudgetSummaryProps {
  budgets: Budget[];
  budgetProgress: Record<string, number>;
}

const BudgetSummary = ({ budgets, budgetProgress }: BudgetSummaryProps) => {
  const totalBudgeted = budgets.reduce((sum, budget) => sum + parseFloat(budget.amount.toString()), 0);
  const totalSpent = budgets.reduce((sum, budget) => {
    const spent = budget.budgetId ? budgetProgress[budget.budgetId] || 0 : 0;
    return sum + spent;
  }, 0);
  const remaining = totalBudgeted - totalSpent;
  const overallProgress = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;
  const isOverBudget = totalSpent > totalBudgeted;

  return (
    <Paper sx={{ 
      p: { xs: 2, md: 3 }, 
      mb: { xs: 2, md: 3 },
      overflow: 'hidden'
    }}>
      <Typography 
        variant="h6" 
        gutterBottom 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          fontSize: { xs: '1.25rem', md: '1.5rem' },
          fontWeight: 700,
          mb: { xs: 2, md: 3 }
        }}
      >
        <AccountBalance />
        Budget Summary
      </Typography>
      
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 2, md: 3 }} sx={{ textAlign: 'center' }}>
        <Box sx={{ flex: 1 }}>
          <Typography 
            variant="h4" 
            color="primary.main"
            sx={{
              fontSize: { xs: '1.75rem', md: '2.125rem' },
              fontWeight: 700
            }}
          >
            {formatCurrency(totalBudgeted)}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              fontSize: { xs: '0.875rem', md: '1rem' }
            }}
          >
            Total Budgeted
          </Typography>
        </Box>
        
        <Box sx={{ flex: 1 }}>
          <Typography 
            variant="h4" 
            color={isOverBudget ? "error.main" : "text.primary"}
            sx={{
              fontSize: { xs: '1.75rem', md: '2.125rem' },
              fontWeight: 700
            }}
          >
            {formatCurrency(totalSpent)}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              fontSize: { xs: '0.875rem', md: '1rem' }
            }}
          >
            Total Spent
          </Typography>
        </Box>
        
        <Box sx={{ flex: 1 }}>
          <Typography 
            variant="h4" 
            color={remaining >= 0 ? "success.main" : "error.main"}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: 1,
              fontSize: { xs: '1.75rem', md: '2.125rem' },
              fontWeight: 700
            }}
          >
            {remaining >= 0 ? <TrendingUp /> : <TrendingDown />}
            {formatCurrency(Math.abs(remaining))}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              fontSize: { xs: '0.875rem', md: '1rem' }
            }}
          >
            {remaining >= 0 ? 'Remaining' : 'Over Budget'}
          </Typography>
        </Box>
      </Stack>
      
      <Box sx={{ mt: { xs: 2, md: 3 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography 
            variant="body2"
            sx={{
              fontSize: { xs: '0.875rem', md: '1rem' },
              fontWeight: 600
            }}
          >
            Overall Progress
          </Typography>
          <Typography 
            variant="body2"
            sx={{
              fontSize: { xs: '0.875rem', md: '1rem' },
              fontWeight: 600
            }}
          >
            {overallProgress.toFixed(0)}%
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={Math.min(overallProgress, 100)}
          color={isOverBudget ? "error" : overallProgress > 80 ? "warning" : "success"}
          sx={{ height: { xs: 6, md: 8 }, borderRadius: { xs: 3, md: 4 } }}
        />
      </Box>
    </Paper>
  );
};

export default BudgetSummary;
