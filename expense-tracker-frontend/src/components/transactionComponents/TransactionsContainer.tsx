'use client';

import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Paper, Tabs, Tab } from '@mui/material';
import TransactionList from './TransactionList';
import TransactionForm from './TransactionForm';
import TransactionFilters from './TransactionFilters';
import TransactionSummary from './TransactionSummary';
import { getTransactions, getTransactionSummary, Transaction, TransactionQueryParams, TransactionSummary as TransactionSummaryType } from '@/services/transactionService';

const TransactionsContainer = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [filters, setFilters] = useState<TransactionQueryParams>({});
  const [pagination, setPagination] = useState<{ hasMore: boolean, lastEvaluatedKey: string | null }>({
    hasMore: false,
    lastEvaluatedKey: null
  });
  
  // Summary state
  const [summary, setSummary] = useState<TransactionSummaryType | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  
  // Date selection state
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [summaryPeriod, setSummaryPeriod] = useState<{
    month: number;
    year: number;
    startDate: string;
    endDate: string;
  } | null>(null);

  const fetchTransactions = useCallback(async (queryParams: TransactionQueryParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getTransactions(queryParams);
      setTransactions(result.transactions);
      setPagination(result.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSummary = useCallback(async (month?: number, year?: number, period?: string) => {
    setSummaryLoading(true);
    setSummaryError(null);
    try {
      const result = await getTransactionSummary(month, year, period);
      setSummary(result.summary);
      setSummaryPeriod(result.period);
    } catch (err) {
      setSummaryError(err instanceof Error ? err.message : 'Failed to fetch summary');
      setSummary(null);
      setSummaryPeriod(null);
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  const fetchCurrentMonthData = useCallback(() => {
    const startDate = new Date(selectedYear, selectedMonth - 1, 1).toISOString().split('T')[0];
    const endDate = new Date(selectedYear, selectedMonth, 0).toISOString().split('T')[0];
    
    const monthFilters = {
      startDate,
      endDate,
      ...filters // Include any active filters
    };
    
    fetchTransactions(monthFilters);
    fetchSummary(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear, filters, fetchTransactions, fetchSummary]);

  useEffect(() => {
    fetchCurrentMonthData();
  }, [fetchCurrentMonthData]);

  useEffect(() => {
    if (activeTab === 0) {
      fetchCurrentMonthData();
    }
  }, [activeTab, fetchCurrentMonthData]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleTransactionAdded = () => {
    fetchCurrentMonthData();
  };

  const handleFilterChange = useCallback(async (newFilters: TransactionQueryParams) => {
    setFilters(newFilters);
    
    // Combine filters with date range
    const combinedFilters: TransactionQueryParams = { ...newFilters };
    
    // Use selected month/year
    const startDate = new Date(selectedYear, selectedMonth - 1, 1).toISOString().split('T')[0];
    const endDate = new Date(selectedYear, selectedMonth, 0).toISOString().split('T')[0];
    combinedFilters.startDate = startDate;
    combinedFilters.endDate = endDate;
    
    // Fetch transactions with combined filters
    setLoading(true);
    setError(null);
    try {
      const result = await getTransactions(combinedFilters);
      setTransactions(result.transactions);
      setPagination(result.pagination);
      
      // Calculate summary from filtered transactions
      const calculatedSummary = {
        totalIncome: result.transactions
          .filter((t: Transaction) => t.type === 'income')
          .reduce((sum: number, t: Transaction) => sum + parseFloat(t.amount.toString()), 0),
        totalExpenses: result.transactions
          .filter((t: Transaction) => t.type === 'expense')
          .reduce((sum: number, t: Transaction) => sum + parseFloat(t.amount.toString()), 0),
        transactionCount: result.transactions.length,
        incomeCount: result.transactions.filter((t: Transaction) => t.type === 'income').length,
        expenseCount: result.transactions.filter((t: Transaction) => t.type === 'expense').length,
        netIncome: 0
      };
      
      calculatedSummary.netIncome = calculatedSummary.totalIncome - calculatedSummary.totalExpenses;
      
      setSummary(calculatedSummary);
      
      setSummaryPeriod({
        startDate: '',
        endDate: '',
        month: selectedMonth,
        year: selectedYear
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  }, [selectedMonth, selectedYear]);

  const handleMonthYearChange = (month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    // Keep existing filters but apply them to new month
    if (Object.keys(filters).length > 0) {
      handleFilterChange(filters);
    } else {
      fetchCurrentMonthData();
    }
  };

  const handleLoadMore = () => {
    if (pagination.hasMore && pagination.lastEvaluatedKey) {
      const newFilters = {
        ...filters,
        lastEvaluatedKey: pagination.lastEvaluatedKey
      };
      
      // Add date range to load more filters
      const startDate = new Date(selectedYear, selectedMonth - 1, 1).toISOString().split('T')[0];
      const endDate = new Date(selectedYear, selectedMonth, 0).toISOString().split('T')[0];
      newFilters.startDate = startDate;
      newFilters.endDate = endDate;
      
      setLoading(true);
      getTransactions(newFilters)
        .then(result => {
          setTransactions(prev => [...prev, ...result.transactions]);
          setPagination(result.pagination);
        })
        .catch(err => {
          setError(err instanceof Error ? err.message : 'Failed to load more transactions');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const handleTransactionDeleted = (transactionId: string) => {
    setTransactions(prev => prev.filter(t => t.transactionId !== transactionId));
    fetchSummary(selectedMonth, selectedYear);
  };

  const handleTransactionUpdated = (updatedTransaction: Transaction) => {
    setTransactions(prev => 
      prev.map(t => t.transactionId === updatedTransaction.transactionId ? updatedTransaction : t)
    );
    fetchSummary(selectedMonth, selectedYear);
  };

  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: 1200, 
      mx: 'auto',
      p: { xs: 1, md: 3 },
      overflowX: 'hidden' // Prevent horizontal scrolling
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
        Transactions
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          centered
          sx={{
            '& .MuiTab-root': {
              fontSize: { xs: '0.875rem', md: '1rem' },
              fontWeight: 600,
              minHeight: { xs: 48, md: 56 }
            }
          }}
        >
          <Tab label="View Transactions" />
          <Tab label="Add Transaction" />
        </Tabs>
      </Paper>

      {activeTab === 0 && (
        <>
          <TransactionSummary
            summary={summary}
            loading={summaryLoading}
            error={summaryError}
            period={summaryPeriod}
          />

          <TransactionFilters 
            onFilterChange={handleFilterChange}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            onMonthYearChange={handleMonthYearChange}
          />
          
          <TransactionList 
            transactions={transactions} 
            loading={loading} 
            error={error} 
            hasMore={pagination.hasMore}
            onLoadMore={handleLoadMore}
            onDelete={handleTransactionDeleted}
            onUpdate={handleTransactionUpdated}
          />
        </>
      )}

      {activeTab === 1 && (
        <TransactionForm onTransactionAdded={handleTransactionAdded} />
      )}
    </Box>
  );
};

export default TransactionsContainer;
