'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Tabs, Tab, Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import Link from 'next/link';
import TransactionList from './TransactionList';
import TransactionForm from './TransactionForm';
import TransactionFilters from './TransactionFilters';
import { getTransactions, Transaction, TransactionQueryParams } from '@/services/transactionService';

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

  const fetchTransactions = async (queryParams: TransactionQueryParams = {}) => {
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
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleTransactionAdded = () => {
    fetchTransactions(filters);
  };

  const handleFilterChange = (newFilters: TransactionQueryParams) => {
    setFilters(newFilters);
    fetchTransactions(newFilters);
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
  };

  const handleTransactionUpdated = (updatedTransaction: Transaction) => {
    setTransactions(prev => 
      prev.map(t => t.transactionId === updatedTransaction.transactionId ? updatedTransaction : t)
    );
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">
          Transactions
        </Typography>
        <Button
          component={Link}
          href="/dashboard"
          startIcon={<ArrowBack />}
          variant="outlined"
        >
          Back to Dashboard
        </Button>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} centered>
          <Tab label="View Transactions" />
          <Tab label="Add Transaction" />
        </Tabs>
      </Paper>

      {activeTab === 0 && (
        <>
          <TransactionFilters onFilterChange={handleFilterChange} />
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