'use client';

import { Box, Paper, Typography, Stack, Alert } from '@mui/material';
import { TrendingUp, TrendingDown, Receipt, AccountBalance } from '@mui/icons-material';
import { TransactionSummary as TransactionSummaryType } from '@/services/transactionService';
import { formatCurrency } from '@/utils/formatCurrency';

interface TransactionSummaryProps {
  summary: TransactionSummaryType | null;
  loading: boolean;
  error: string | null;
  period: {
    month: number;
    year: number;
    startDate: string;
    endDate: string;
  } | null;
}

const TransactionSummary = ({ summary, loading, error, period }: TransactionSummaryProps) => {
  // Default values to maintain structure
  const defaultSummary = {
    totalIncome: 0,
    totalExpenses: 0,
    netIncome: 0,
    transactionCount: 0,
    incomeCount: 0,
    expenseCount: 0
  };
  
  const displaySummary = summary || defaultSummary;
  const isPositiveNet = displaySummary.netIncome >= 0;
  
  // Format period display
  const getPeriodDisplay = () => {
    if (!period) return '';
    
    if (period.month && period.year) {
      const monthName = new Date(0, period.month - 1).toLocaleString('default', { month: 'long' });
      return `${monthName} ${period.year}`;
    }
    
    if (period.startDate && period.endDate) {
      const startDate = new Date(period.startDate).toLocaleDateString();
      const endDate = new Date(period.endDate).toLocaleDateString();
      return `${startDate} - ${endDate}`;
    }
    
    return 'Custom Period';
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Receipt />
        Transaction Summary - {getPeriodDisplay()}
      </Typography>
      
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ textAlign: 'center' }}>
        <Box sx={{ flex: 1 }}>
          <Typography 
            variant="h4" 
            color="success.main"
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: 1,
              opacity: loading ? 0.5 : 1,
              transition: 'opacity 0.3s ease'
            }}
          >
            <TrendingUp />
            {formatCurrency(displaySummary.totalIncome)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Income ({displaySummary.incomeCount} transactions)
          </Typography>
        </Box>
        
        <Box sx={{ flex: 1 }}>
          <Typography 
            variant="h4" 
            color="error.main"
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: 1,
              opacity: loading ? 0.5 : 1,
              transition: 'opacity 0.3s ease'
            }}
          >
            <TrendingDown />
            {formatCurrency(displaySummary.totalExpenses)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Expenses ({displaySummary.expenseCount} transactions)
          </Typography>
        </Box>
        
        <Box sx={{ flex: 1 }}>
          <Typography 
            variant="h4" 
            color={isPositiveNet ? "success.main" : "error.main"}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: 1,
              opacity: loading ? 0.5 : 1,
              transition: 'opacity 0.3s ease'
            }}
          >
            {isPositiveNet ? <TrendingUp /> : <TrendingDown />}
            {isPositiveNet ? '+' : ''}{formatCurrency(displaySummary.netIncome)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Net Income
          </Typography>
        </Box>
        
        <Box sx={{ flex: 1 }}>
          <Typography 
            variant="h4" 
            color="primary.main"
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: 1,
              opacity: loading ? 0.5 : 1,
              transition: 'opacity 0.3s ease'
            }}
          >
            <AccountBalance />
            {displaySummary.transactionCount}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total Transactions
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
};

export default TransactionSummary;