'use client';

import { 
  Paper, 
  Typography, 
  Stack, 
  Box,
  LinearProgress 
} from '@mui/material';
import { 
  Receipt, 
  AccountBalance, 
  CalendarToday,
  TrendingUp 
} from '@mui/icons-material';

interface UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AccountStats {
  totalTransactions: number;
  totalBudgets: number;
  accountAge: string;
}

interface AccountStatisticsProps {
  stats: AccountStats | null;
  userProfile: UserProfile | null;
}

const AccountStatistics = ({ stats, userProfile }: AccountStatisticsProps) => {
  if (!stats || !userProfile) {
    return null;
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <TrendingUp color="primary" />
        <Typography variant="h6">Account Statistics</Typography>
      </Box>

      <Stack spacing={3}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          {/* Transactions */}
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
              <Receipt color="primary" />
              <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
                {stats.totalTransactions}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Total Transactions
            </Typography>
          </Box>

          {/* Budgets */}
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
              <AccountBalance color="primary" />
              <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
                {stats.totalBudgets}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Total Budgets
            </Typography>
          </Box>

          {/* Account Age */}
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
              <CalendarToday color="primary" />
              <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
                {stats.accountAge}
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Account Age
            </Typography>
          </Box>
        </Stack>

        {/* Activity Summary */}
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Activity Summary
          </Typography>
          <Stack spacing={1}>
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">Transaction Activity</Typography>
                <Typography variant="body2" color="text.secondary">
                  {stats.totalTransactions} transactions
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={Math.min((stats.totalTransactions / 100) * 100, 100)} 
                sx={{ height: 6, borderRadius: 3 }}
              />
            </Box>
            
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">Budget Management</Typography>
                <Typography variant="body2" color="text.secondary">
                  {stats.totalBudgets} budgets
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={Math.min((stats.totalBudgets / 20) * 100, 100)} 
                sx={{ height: 6, borderRadius: 3 }}
              />
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
};

export default AccountStatistics; 