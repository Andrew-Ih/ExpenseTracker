'use client';

import { Box, Paper, Typography, Stack, LinearProgress } from '@mui/material';
import { TrendingUp, TrendingDown, AccountBalance } from '@mui/icons-material';
import { Budget } from '@/services/budgetService';

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
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AccountBalance />
        Budget Summary
      </Typography>
      
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ textAlign: 'center' }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" color="primary.main">
            ${totalBudgeted.toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Budgeted
          </Typography>
        </Box>
        
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" color={isOverBudget ? "error.main" : "text.primary"}>
            ${totalSpent.toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Spent
          </Typography>
        </Box>
        
        <Box sx={{ flex: 1 }}>
          <Typography 
            variant="h4" 
            color={remaining >= 0 ? "success.main" : "error.main"}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}
          >
            {remaining >= 0 ? <TrendingUp /> : <TrendingDown />}
            ${Math.abs(remaining).toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {remaining >= 0 ? 'Remaining' : 'Over Budget'}
          </Typography>
        </Box>
      </Stack>
      
      <Box sx={{ mt: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2">Overall Progress</Typography>
          <Typography variant="body2">{overallProgress.toFixed(0)}%</Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={Math.min(overallProgress, 100)}
          color={isOverBudget ? "error" : overallProgress > 80 ? "warning" : "success"}
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Box>
    </Paper>
  );
};

export default BudgetSummary;
