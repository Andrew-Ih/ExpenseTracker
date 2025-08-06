'use client';

import { useState, useEffect } from 'react';
import { Box, Stack, Alert, CircularProgress } from '@mui/material';
import DashboardWelcome from './DashboardWelcome';
import DashboardStats from './DashboardStats';
import DashboardTransactionSummary from './DashboardTransactionSummary';
import DashboardBudgetOverview from './DashboardBudgetOverview';
// import DashboardRecentTransactions from './DashboardRecentTransactions';
import { getUserProfile } from '@/services/userService';
import { getTransactionSummary, getAllTimeTransactionSummary } from '@/services/transactionService';
import { getBudgets } from '@/services/budgetService';
import { getTransactions, TransactionSummary } from '@/services/transactionService';
import { Budget } from '@/services/budgetService';

interface UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface DashboardStatsData {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  savingsRate: number;
}

interface TransactionSummaryResponse {
  summary: TransactionSummary;
  period: {
    month: number;
    year: number;
    startDate: string;
    endDate: string;
  };
}

const DashboardContainer = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStatsData | null>(null);
  const [transactionSummary, setTransactionSummary] = useState<TransactionSummaryResponse | null>(null);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  // const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load all data in parallel
      const [
        profileResult,
        summaryResult,
        allTimeResult,
        budgetsResult,
        // transactionsResult
      ] = await Promise.all([
        getUserProfile(),
        getTransactionSummary(), // Current month
        getAllTimeTransactionSummary(), // All-time data
        getBudgets(new Date().toISOString().slice(0, 7)),
        getTransactions({ limit: 5 }) // Get recent 5 transactions
      ]);

      setUserProfile(profileResult);
      setTransactionSummary(summaryResult);
      setBudgets(budgetsResult);
      // setRecentTransactions(transactionsResult.transactions || []);

      // Calculate dashboard stats using all-time data
      const stats: DashboardStatsData = {
        totalIncome: allTimeResult.summary?.totalIncome || 0,
        totalExpenses: allTimeResult.summary?.totalExpenses || 0,
        netIncome: allTimeResult.summary?.netIncome || 0,
        savingsRate: allTimeResult.summary?.totalIncome > 0 
          ? ((allTimeResult.summary?.netIncome || 0) / allTimeResult.summary?.totalIncome) * 100 
          : 0
      };
      setDashboardStats(stats);

    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', p: 3 }}>
      <DashboardWelcome userProfile={userProfile} />
      
      <DashboardStats stats={dashboardStats} />
      
      <Stack spacing={3} sx={{ mt: 2 }}>
        <Stack direction="row" spacing={3}>
          <Box sx={{ flex: 1 }}>
            <DashboardTransactionSummary 
              summary={transactionSummary?.summary || null} 
              period={transactionSummary?.period || null}
            />
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <DashboardBudgetOverview budgets={budgets} />
          </Box>
        </Stack>
        
        {/* <Box sx={{ width: '100%' }}>
          <DashboardRecentTransactions transactions={recentTransactions} />
        </Box> */}
      </Stack>
    </Box>
  );
};

export default DashboardContainer; 