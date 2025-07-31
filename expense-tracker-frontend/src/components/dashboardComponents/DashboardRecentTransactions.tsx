'use client';

import { Box, Paper, Typography, Stack, Chip, Divider } from '@mui/material';
import { Receipt, TrendingUp, TrendingDown, AccessTime } from '@mui/icons-material';
import { Transaction } from '@/services/transactionService';
import { formatCurrency } from '@/utils/formatCurrency';

interface DashboardRecentTransactionsProps {
  transactions: Transaction[];
}

const DashboardRecentTransactions = ({ transactions }: DashboardRecentTransactionsProps) => {
  const getTransactionIcon = (type: 'income' | 'expense') => {
    return type === 'income' ? <TrendingUp /> : <TrendingDown />;
  };

  const getTransactionColor = (type: 'income' | 'expense') => {
    return type === 'income' ? 'success.main' : 'error.main';
  };

  // const getTransactionIconBg = (type: 'income' | 'expense') => {
  //   return type === 'income' ? 'success.light' : 'error.light';
  // };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = [
      'primary.main',
      'secondary.main',
      'success.main',
      'warning.main',
      'info.main',
      'error.main'
    ];
    
    // Simple hash function to get consistent color for category
    let hash = 0;
    for (let i = 0; i < category.length; i++) {
      const char = category.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  if (transactions.length === 0) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Receipt />
          Recent Transactions
        </Typography>
        <Typography variant="body2" color="text.secondary">
          No recent transactions to display
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Receipt />
        Recent Transactions
      </Typography>
      
      <Stack spacing={2}>
        {transactions.map((transaction, index) => (
          <Box key={transaction.transactionId || index}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box 
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  // bgcolor: getTransactionIconBg(transaction.type),
                  color: getTransactionColor(transaction.type)
                }}
              >
                {getTransactionIcon(transaction.type)}
              </Box>
              
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                  <Typography variant="body1" fontWeight={500}>
                    {transaction.description}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    color={getTransactionColor(transaction.type)}
                    fontWeight={600}
                  >
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip 
                      label={transaction.category} 
                      size="small" 
                      sx={{ 
                        bgcolor: `${getCategoryColor(transaction.category)}20`,
                        color: getCategoryColor(transaction.category),
                        fontWeight: 500
                      }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTime sx={{ fontSize: 14, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(transaction.date)}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
            
            {index < transactions.length - 1 && (
              <Divider sx={{ mt: 2 }} />
            )}
          </Box>
        ))}
      </Stack>
    </Paper>
  );
};

export default DashboardRecentTransactions; 