'use client';

import { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  CircularProgress,
  Alert,
  TextField,
  Box,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Stack,
  SelectChangeEvent
} from '@mui/material';
import { getBudgetSummary } from '@/services/budgetService';
import { getTransactions, Transaction } from '@/services/transactionService';
import { formatCurrency } from '@/utils/formatCurrency';

interface BudgetHistoryProps {
  selectedMonth: string;
}

interface MonthlySummary {
  month: string;
  totalBudgeted: number;
  totalSpent: number;
  overUnderBudget: number;
}

interface BudgetSummaryResponse {
  year: number;
  monthlySummaries: {
    month: string;
    totalBudgeted: number;
    totalSpent: number;
    overUnderBudget: number;
  }[];
  yearlyTotals: {
    totalBudgeted: number;
    totalSpent: number;
    totalSaved: number;
  };
}

const BudgetHistory = ({}: BudgetHistoryProps) => {
  const [summaries, setSummaries] = useState<MonthlySummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [yearInput, setYearInput] = useState(new Date().getFullYear().toString());
  const [startMonth, setStartMonth] = useState(1);
  const [endMonth, setEndMonth] = useState(12);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Update yearInput when selectedYear changes from external sources
  useEffect(() => {
    setYearInput(selectedYear.toString());
  }, [selectedYear]);

  useEffect(() => {
    const fetchYearlySummary = async () => {
      // Validate year input - only check if it's a valid 4-digit year
      if (!selectedYear || selectedYear.toString().length !== 4 || isNaN(selectedYear)) {
        setSummaries([]);
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        // Single API call to get budget summary
        const budgetSummary = await getBudgetSummary(selectedYear, startMonth, endMonth);
        
        // Get transaction data for the year range
        const startDate = `${selectedYear}-${startMonth.toString().padStart(2, '0')}-01`;
        const endDate = `${selectedYear}-${endMonth.toString().padStart(2, '0')}-31`;
        const transactionResult = await getTransactions({
          startDate,
          endDate,
          type: 'expense'
        });
        
        // Group transactions by month
        const transactionsByMonth: Record<string, number> = {};
        transactionResult.transactions.forEach((transaction: Transaction) => {
          const month = transaction.date.slice(0, 7); // YYYY-MM
          transactionsByMonth[month] = (transactionsByMonth[month] || 0) + parseFloat(transaction.amount.toString());
        });
        
        // Combine budget and transaction data
        const yearlyData: MonthlySummary[] = (budgetSummary as BudgetSummaryResponse).monthlySummaries.map((summary) => {
          const totalSpent = transactionsByMonth[summary.month] || 0;
          return {
            month: summary.month,
            totalBudgeted: summary.totalBudgeted,
            totalSpent,
            overUnderBudget: summary.totalBudgeted - totalSpent
          };
        });
        
        setSummaries(yearlyData);
      } catch (err) {
        console.error('Budget history error:', err);
        setSummaries([]);
        setError(null); // Don't show error, just show empty state
      } finally {
        setLoading(false);
      }
    };

    fetchYearlySummary();
  }, [selectedYear, startMonth, endMonth]);

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  // Calculate totals for summary
  const totalBudgeted = summaries.reduce((sum, s) => sum + s.totalBudgeted, 0);
  const totalSpent = summaries.reduce((sum, s) => sum + s.totalSpent, 0);
  const totalSaved = totalBudgeted - totalSpent;

  return (
    <>
      {/* Summary Cards */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Budget History Summary</Typography>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ textAlign: 'center' }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" color="primary.main">
                {formatCurrency(totalBudgeted)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Budgeted
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" color={totalSpent > totalBudgeted ? "error.main" : "text.primary"}>
                {formatCurrency(totalSpent)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Spent
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" color={totalSaved >= 0 ? "success.main" : "error.main"}>
                {formatCurrency(Math.abs(totalSaved))}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {totalSaved >= 0 ? 'Total Saved' : 'Total Over Budget'}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <Typography variant="h6">Budget Summary for:</Typography>
          <TextField
            type="number"
            label="Year"
            value={yearInput}
            onChange={(e) => {
              const value = e.target.value;
              setYearInput(value); // Always update display
              if (value.length === 4 && !isNaN(parseInt(value))) {
                setSelectedYear(parseInt(value));
              }
            }}
            size="small"
            sx={{ minWidth: 100, maxWidth: 120 }}
          />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>From Month</InputLabel>
            <Select
              value={startMonth}
              label="From Month"
              onChange={(e: SelectChangeEvent<number>) => setStartMonth(e.target.value as number)}
            >
              {monthNames.map((month, index) => (
                <MenuItem key={index} value={index + 1}>{month}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>To Month</InputLabel>
            <Select
              value={endMonth}
              label="To Month"
              onChange={(e: SelectChangeEvent<number>) => setEndMonth(e.target.value as number)}
            >
              {monthNames.map((month, index) => (
                <MenuItem key={index} value={index + 1}>{month}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      
      <TableContainer>
        <Table sx={{ tableLayout: 'fixed' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '15%', fontSize: '1rem', fontWeight: 'bold' }}>Month</TableCell>
              <TableCell align="right" sx={{ width: '20%', fontSize: '1rem', fontWeight: 'bold' }}>Total Budgeted</TableCell>
              <TableCell align="right" sx={{ width: '20%', fontSize: '1rem', fontWeight: 'bold' }}>Total Spent</TableCell>
              <TableCell align="right" sx={{ width: '20%', fontSize: '1rem', fontWeight: 'bold' }}>Over/Under Budget</TableCell>
              <TableCell align="center" sx={{ width: '25%', fontSize: '1rem', fontWeight: 'bold' }}>Progress</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <CircularProgress size={24} sx={{ my: 2 }} />
                </TableCell>
              </TableRow>
            ) : summaries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body1" sx={{ py: 4 }}>
                    {!selectedYear || selectedYear.toString().length !== 4 || isNaN(selectedYear)
                      ? 'Please enter a valid 4-digit year'
                      : 'No budget history available for this period'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              summaries.map((summary) => {
                const progressPercent = summary.totalBudgeted > 0 ? (summary.totalSpent / summary.totalBudgeted) * 100 : 0;
                const isOverBudget = summary.totalSpent > summary.totalBudgeted;
                const monthIndex = parseInt(summary.month.split('-')[1]) - 1;
                
                return (
                  <TableRow key={summary.month}>
                    <TableCell sx={{ fontWeight: 'medium', fontSize: '1rem' }}>
                      {monthNames[monthIndex]}
                    </TableCell>
                    <TableCell align="right" sx={{ px: 2 }}>
                      <Typography color="primary.main" variant="body1" sx={{ fontWeight: 'medium' }}>
                        {formatCurrency(summary.totalBudgeted)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ px: 2 }}>
                      <Typography color={isOverBudget ? "error.main" : "text.primary"} variant="body1" sx={{ fontWeight: 'medium' }}>
                        {formatCurrency(summary.totalSpent)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ px: 2 }}>
                      <Typography color={summary.overUnderBudget >= 0 ? "success.main" : "error.main"} variant="body1" sx={{ fontWeight: 'medium' }}>
                        {summary.overUnderBudget >= 0 ? '+' : '-'}{formatCurrency(Math.abs(summary.overUnderBudget))}
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ px: 3 }}>
                      <Box sx={{ width: '100%', maxWidth: 150, mx: 'auto' }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={Math.min(progressPercent, 100)}
                          color={isOverBudget ? "error" : progressPercent > 80 ? "warning" : "success"}
                          sx={{ mb: 0.5, height: 6, borderRadius: 3 }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                          {progressPercent.toFixed(0)}%
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      </Paper>
    </>
  );
};

export default BudgetHistory;
