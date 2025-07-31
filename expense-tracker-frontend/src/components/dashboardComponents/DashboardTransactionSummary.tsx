'use client';

import { Box, Paper, Typography, Stack, Chip } from '@mui/material';
import { Receipt, TrendingUp, TrendingDown } from '@mui/icons-material';
import { formatCurrency } from '@/utils/formatCurrency';

interface TransactionSummary {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  transactionCount: number;
  incomeCount: number;
  expenseCount: number;
}

interface DashboardTransactionSummaryProps {
  summary: TransactionSummary | null;
  period: {
    month: number;
    year: number;
    startDate: string;
    endDate: string;
  } | null;
}

const DashboardTransactionSummary = ({ summary, period }: DashboardTransactionSummaryProps) => {
  if (!summary) {
    return (
      <Paper sx={{ p: 3, height: '100%' }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Receipt />
          Transaction Summary
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No transaction data available
        </Typography>
      </Paper>
    );
  }

  const getPeriodDisplay = () => {
    if (!period) return 'Current Period';
    
    if (period.month && period.year) {
      const monthName = new Date(0, period.month - 1).toLocaleString('default', { month: 'long' });
      return `${monthName} ${period.year}`;
    }
    
    return 'Current Period';
  };

  const isPositiveNet = summary.netIncome >= 0;

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Receipt />
        Transaction Summary
      </Typography>
      
      <Chip 
        label={getPeriodDisplay()} 
        size="small" 
        color="primary" 
        variant="outlined"
        sx={{ mb: 2 }}
      />
      
      <Stack spacing={2}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingUp color="success" />
            <Typography variant="body2" color="text.secondary">
              Income
            </Typography>
          </Box>
          <Typography variant="h6" color="success.main" fontWeight={600}>
            {formatCurrency(summary.totalIncome)}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingDown color="error" />
            <Typography variant="body2" color="text.secondary">
              Expenses
            </Typography>
          </Box>
          <Typography variant="h6" color="error.main" fontWeight={600}>
            {formatCurrency(summary.totalExpenses)}
          </Typography>
        </Box>
        
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            pt: 1,
            borderTop: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Typography variant="body1" fontWeight={500}>
            Net Income
          </Typography>
          <Typography 
            variant="h6" 
            color={isPositiveNet ? 'success.main' : 'error.main'} 
            fontWeight={700}
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
          >
            {isPositiveNet ? '+' : ''}{formatCurrency(summary.netIncome)}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Total Transactions
          </Typography>
          <Typography variant="body1" fontWeight={500}>
            {summary.transactionCount}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Income Transactions
          </Typography>
          <Typography variant="body1" fontWeight={500} color="success.main">
            {summary.incomeCount}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Expense Transactions
          </Typography>
          <Typography variant="body1" fontWeight={500} color="error.main">
            {summary.expenseCount}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

export default DashboardTransactionSummary; 