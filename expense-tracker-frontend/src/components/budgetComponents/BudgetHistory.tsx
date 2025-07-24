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
  Alert
} from '@mui/material';
import { getBudgetHistory, Budget } from '@/services/budgetService';

interface BudgetHistoryProps {
  selectedMonth: string;
}

interface MonthlyBudgetData {
  month: string;
  budgets: Budget[];
}

const BudgetHistory = ({ selectedMonth }: BudgetHistoryProps) => {
  const [history, setHistory] = useState<MonthlyBudgetData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get last 6 months including current
        const currentDate = new Date(selectedMonth + '-01');
        const months = [];
        
        for (let i = 5; i >= 0; i--) {
          const date = new Date(currentDate);
          date.setMonth(date.getMonth() - i);
          months.push(date.toISOString().slice(0, 7));
        }
        
        const result = await getBudgetHistory(months);
        setHistory(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch budget history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [selectedMonth]);

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

  // Get all unique categories across all months
  const allCategories = [...new Set(
    history.flatMap(monthData => 
      monthData.budgets.map((budget: Budget) => budget.category)
    )
  )];

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Budget History (Last 6 Months)
      </Typography>
      
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              {history.map((monthData, index) => (
                <TableCell key={`${monthData.month}-${index}`} align="right">
                  {new Date(monthData.month + '-01').toLocaleDateString('en-US', { 
                    month: 'short', 
                    year: 'numeric' 
                  })}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {allCategories.map(category => (
              <TableRow key={category}>
                <TableCell>{category}</TableCell>
                {history.map((monthData, index) => {
                  const budget = monthData.budgets.find((b: Budget) => b.category === category);
                  return (
                    <TableCell key={`${monthData.month}-${index}`} align="right">
                      {budget ? `$${parseFloat(budget.amount.toString()).toFixed(2)}` : '-'}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
            <TableRow sx={{ borderTop: 2, borderColor: 'divider' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
              {history.map((monthData, index) => {
                const total = monthData.budgets.reduce((sum: number, budget: Budget) => 
                  sum + parseFloat(budget.amount.toString()), 0
                );
                return (
                  <TableCell key={`${monthData.month}-${index}`} align="right" sx={{ fontWeight: 'bold' }}>
                    ${total.toFixed(2)}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default BudgetHistory;
