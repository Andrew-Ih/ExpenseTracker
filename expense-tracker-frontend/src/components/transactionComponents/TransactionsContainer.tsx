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
      endDate
    };
    
    fetchTransactions(monthFilters);
    fetchSummary(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear, fetchTransactions, fetchSummary]);

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
    // Refresh data based on current state
    if (filters.startDate || filters.endDate) {
      handleFilterChange(filters);
    } else {
      fetchCurrentMonthData();
    }
  };

  const handleFilterChange = useCallback(async (newFilters: TransactionQueryParams) => {
    setFilters(newFilters);
    
    // Fetch transactions with filters
    setLoading(true);
    setError(null);
    try {
      const result = await getTransactions(newFilters);
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
        startDate: newFilters.startDate || '',
        endDate: newFilters.endDate || '',
        month: 0, // Custom range doesn't have specific month
        year: 0   // Custom range doesn't have specific year
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleMonthYearChange = (month: number, year: number) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    setFilters({}); // Clear custom filters when changing month/year
  };

  const handleLoadMore = () => {
    if (pagination.hasMore && pagination.lastEvaluatedKey) {
      const newFilters = {
        ...filters,
        lastEvaluatedKey: pagination.lastEvaluatedKey
      };
      
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
    // Refresh summary after deletion
    if (filters.startDate || filters.endDate) {
      handleFilterChange(filters);
    } else {
      fetchSummary(selectedMonth, selectedYear);
    }
  };

  const handleTransactionUpdated = (updatedTransaction: Transaction) => {
    setTransactions(prev => 
      prev.map(t => t.transactionId === updatedTransaction.transactionId ? updatedTransaction : t)
    );
    // Refresh summary based on current filters or month/year
    if (filters.startDate || filters.endDate) {
      handleFilterChange(filters);
    } else {
      fetchSummary(selectedMonth, selectedYear);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Transactions
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
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
