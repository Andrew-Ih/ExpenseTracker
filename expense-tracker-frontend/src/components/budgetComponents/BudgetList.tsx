'use client';

import { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  IconButton,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { Budget, deleteBudget } from '@/services/budgetService';
import { getTransactions, Transaction } from '@/services/transactionService';
import BudgetEditDialog from './BudgetEditDialog';
import { formatCurrency } from '@/utils/formatCurrency';

interface BudgetListProps {
  budgets: Budget[];
  loading: boolean;
  error: string | null;
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  onDelete: (budgetId: string) => void;
  onUpdate: (budget: Budget) => void;
}

const BudgetList = ({ 
  budgets, 
  loading, 
  error, 
  selectedMonth,
  onMonthChange,
  onDelete,
  onUpdate
}: BudgetListProps) => {
  const [budgetProgress, setBudgetProgress] = useState<Record<string, number>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);


  useEffect(() => {
    const fetchBudgetProgress = async () => {
      // Validate year from selectedMonth - only proceed if it's a valid 4-digit year
      const year = selectedMonth.split('-')[0];
      if (!year || year.length !== 4 || isNaN(parseInt(year))) {
        setBudgetProgress({});
        return;
      }

      const progress: Record<string, number> = {};
      
      for (const budget of budgets) {
        try {
          const startDate = `${selectedMonth}-01`;
          const endDate = `${selectedMonth}-31`;
          
          const result = await getTransactions({
            startDate,
            endDate,
            category: budget.category,
            type: 'expense'
          });
          
          const totalSpent = result.transactions.reduce((sum: number, transaction: Transaction) => 
            sum + parseFloat(transaction.amount.toString()), 0
          );
          
          if (budget.budgetId) {
            progress[budget.budgetId] = totalSpent;
          }
        } catch (error) {
          console.error('Error fetching progress for', budget.category, error);
        }
      }
      
      setBudgetProgress(progress);
    };

    if (budgets.length > 0) {
      fetchBudgetProgress();
    }
  }, [budgets, selectedMonth]);

  const handleEditClick = (budget: Budget) => {
    setSelectedBudget(budget);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (budget: Budget) => {
    setSelectedBudget(budget);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedBudget?.budgetId) return;
    
    setDeleteLoading(true);
    try {
      await deleteBudget(selectedBudget.budgetId);
      onDelete(selectedBudget.budgetId);
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error('Failed to delete budget:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleBudgetUpdated = (updatedBudget: Budget) => {
    onUpdate(updatedBudget);
    setEditDialogOpen(false);
  };



  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Typography variant="h6">Budgets for:</Typography>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Month</InputLabel>
            <Select
              value={parseInt(selectedMonth.split('-')[1])}
              label="Month"
              onChange={(e: SelectChangeEvent<number>) => {
                const year = selectedMonth.split('-')[0];
                const month = (e.target.value as number).toString().padStart(2, '0');
                onMonthChange(`${year}-${month}`);
              }}
            >
              <MenuItem value={1}>January</MenuItem>
              <MenuItem value={2}>February</MenuItem>
              <MenuItem value={3}>March</MenuItem>
              <MenuItem value={4}>April</MenuItem>
              <MenuItem value={5}>May</MenuItem>
              <MenuItem value={6}>June</MenuItem>
              <MenuItem value={7}>July</MenuItem>
              <MenuItem value={8}>August</MenuItem>
              <MenuItem value={9}>September</MenuItem>
              <MenuItem value={10}>October</MenuItem>
              <MenuItem value={11}>November</MenuItem>
              <MenuItem value={12}>December</MenuItem>
            </Select>
          </FormControl>
          <TextField
            type="number"
            label="Year"
            value={parseInt(selectedMonth.split('-')[0])}
            onChange={(e) => {
              const month = selectedMonth.split('-')[1];
              const year = e.target.value;
              onMonthChange(`${year}-${month}`);
            }}
            size="small"
            sx={{ minWidth: 100, maxWidth: 120 }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: '1rem', fontWeight: 'bold' }}>Category</TableCell>
                <TableCell align="right" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>Budget Amount</TableCell>
                <TableCell align="right" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>Spent</TableCell>
                <TableCell align="right" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>Remaining</TableCell>
                <TableCell align="center" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>Progress</TableCell>
                <TableCell align="center" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : budgets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body1" sx={{ py: 2 }}>
                      No budgets found for this month
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                budgets.map((budget) => {
                  const spent = budget.budgetId ? budgetProgress[budget.budgetId] || 0 : 0;
                  const budgetAmount = parseFloat(budget.amount.toString());
                  const remaining = budgetAmount - spent;
                  const progressPercent = budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0;
                  const isOverBudget = spent > budgetAmount;
                  
                  return (
                    <TableRow key={budget.budgetId}>
                      <TableCell sx={{ fontSize: '1rem' }}>{budget.category}</TableCell>
                      <TableCell align="right">
                        <Typography color="primary.main" variant="body1" sx={{ fontWeight: 'medium' }}>
                          {formatCurrency(budgetAmount)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography color={isOverBudget ? "error.main" : "text.primary"} variant="body1" sx={{ fontWeight: 'medium' }}>
                          {formatCurrency(spent)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography color={remaining >= 0 ? "success.main" : "error.main"} variant="body1" sx={{ fontWeight: 'medium' }}>
                          {formatCurrency(remaining >= 0 ? remaining : 0)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center" sx={{ minWidth: 120 }}>
                        <Box sx={{ width: '100%' }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={Math.min(progressPercent, 100)}
                            color={isOverBudget ? "error" : progressPercent > 80 ? "warning" : "success"}
                            sx={{ mb: 0.5 }}
                          />
                          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                            {progressPercent.toFixed(0)}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton 
                          size="small" 
                          color="primary" 
                          onClick={() => handleEditClick(budget)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error" 
                          onClick={() => handleDeleteClick(budget)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this budget?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            disabled={deleteLoading}
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Budget Dialog */}
      {selectedBudget && (
        <BudgetEditDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          budget={selectedBudget}
          onUpdate={handleBudgetUpdated}
        />
      )}
    </>
  );
};

export default BudgetList;
