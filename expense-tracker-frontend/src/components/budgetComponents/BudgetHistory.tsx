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
import { getBudgetHistory, Budget } from '@/services/budgetService';
import { getTransactions, Transaction } from '@/services/transactionService';

interface BudgetHistoryProps {
  selectedMonth: string;
}

interface MonthlySummary {
  month: string;
  totalBudgeted: number;
  totalSpent: number;
  overUnderBudget: number;
}

const BudgetHistory = ({}: BudgetHistoryProps) => {
  const [summaries, setSummaries] = useState<MonthlySummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [startMonth, setStartMonth] = useState(1);
  const [endMonth, setEndMonth] = useState(12);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    const fetchYearlySummary = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const yearlyData: MonthlySummary[] = [];
        
        for (let month = startMonth; month <= endMonth; month++) {
          const monthStr = `${selectedYear}-${month.toString().padStart(2, '0')}`;
          
          // Get budgets for the month
          const budgetResult = await getBudgetHistory([monthStr]);
          const budgets = budgetResult[0]?.budgets || [];
          const totalBudgeted = budgets.reduce((sum: number, budget: Budget) => 
            sum + parseFloat(budget.amount.toString()), 0
          );
          
          // Get transactions for the month
          const startDate = `${monthStr}-01`;
          const endDate = `${monthStr}-31`;
          const transactionResult = await getTransactions({
            startDate,
            endDate,
            type: 'expense'
          });
          
          const totalSpent = transactionResult.transactions.reduce((sum: number, transaction: Transaction) => 
            sum + parseFloat(transaction.amount.toString()), 0
          );
          
          const overUnderBudget = totalBudgeted - totalSpent;
          
          yearlyData.push({
            month: monthStr,
            totalBudgeted,
            totalSpent,
            overUnderBudget
          });
        }
        
        setSummaries(yearlyData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch budget history');
      } finally {
        setLoading(false);
      }
    };

    fetchYearlySummary();
  }, [selectedYear, startMonth, endMonth]);

  if (loading) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
      </Paper>
    );
  }

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
                ${totalBudgeted.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Budgeted
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" color={totalSpent > totalBudgeted ? "error.main" : "text.primary"}>
                ${totalSpent.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Spent
              </Typography>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" color={totalSaved >= 0 ? "success.main" : "error.main"}>
                ${Math.abs(totalSaved).toFixed(2)}
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
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            size="small"
            inputProps={{ min: 2020, max: 2030 }}
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
              <TableCell sx={{ width: '15%' }}>Month</TableCell>
              <TableCell align="right" sx={{ width: '20%' }}>Total Budgeted</TableCell>
              <TableCell align="right" sx={{ width: '20%' }}>Total Spent</TableCell>
              <TableCell align="right" sx={{ width: '20%' }}>Over/Under Budget</TableCell>
              <TableCell align="center" sx={{ width: '25%' }}>Progress</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {summaries.map((summary) => {
              const progressPercent = summary.totalBudgeted > 0 ? (summary.totalSpent / summary.totalBudgeted) * 100 : 0;
              const isOverBudget = summary.totalSpent > summary.totalBudgeted;
              const monthIndex = parseInt(summary.month.split('-')[1]) - 1;
              
              return (
                <TableRow key={summary.month}>
                  <TableCell sx={{ fontWeight: 'medium' }}>
                    {monthNames[monthIndex]}
                  </TableCell>
                  <TableCell align="right" sx={{ px: 2 }}>
                    <Typography color="primary.main" variant="body2" sx={{ fontWeight: 'medium' }}>
                      ${summary.totalBudgeted.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ px: 2 }}>
                    <Typography color={isOverBudget ? "error.main" : "text.primary"} variant="body2" sx={{ fontWeight: 'medium' }}>
                      ${summary.totalSpent.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ px: 2 }}>
                    <Typography color={summary.overUnderBudget >= 0 ? "success.main" : "error.main"} variant="body2" sx={{ fontWeight: 'medium' }}>
                      {summary.overUnderBudget >= 0 ? '+' : '-'}${Math.abs(summary.overUnderBudget).toFixed(2)}
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
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                        {progressPercent.toFixed(0)}%
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      </Paper>
    </>
  );
};

export default BudgetHistory;
