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
      <Paper sx={{ p: { xs: 2, md: 3 }, height: '100%', overflow: 'hidden' }}>
        <Typography variant="h5" gutterBottom sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          fontWeight: 700,
          fontSize: { xs: '1.25rem', md: '1.5rem' }
        }}>
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
    <Paper sx={{ p: { xs: 2, md: 3 }, height: '100%', overflow: 'hidden' }}>
      <Typography variant="h5" gutterBottom sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        fontWeight: 700,
        fontSize: { xs: '1.25rem', md: '1.5rem' }
      }}>
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
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
              Income
            </Typography>
          </Box>
          <Typography variant="h6" color="success.main" fontWeight={600} sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
            {formatCurrency(summary.totalIncome)}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingDown color="error" />
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
              Expenses
            </Typography>
          </Box>
          <Typography variant="h6" color="error.main" fontWeight={600} sx={{ fontSize: { xs: '1rem', md: '1.25rem' } }}>
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
          <Typography variant="body1" fontWeight={500} sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
            Net Income
          </Typography>
          <Typography 
            variant="h6" 
            color={isPositiveNet ? 'success.main' : 'error.main'} 
            fontWeight={700}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 0.5,
              fontSize: { xs: '1rem', md: '1.25rem' }
            }}
          >
            {isPositiveNet ? '+' : ''}{formatCurrency(summary.netIncome)}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
            Total Transactions
          </Typography>
          <Typography variant="body1" fontWeight={500} sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
            {summary.transactionCount}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
            Income Transactions
          </Typography>
          <Typography variant="body1" fontWeight={500} color="success.main" sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
            {summary.incomeCount}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
            Expense Transactions
          </Typography>
          <Typography variant="body1" fontWeight={500} color="error.main" sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}>
            {summary.expenseCount}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

export default DashboardTransactionSummary; 