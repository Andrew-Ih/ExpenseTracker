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
  SelectChangeEvent,
  Stack
} from '@mui/material';
import { Edit, Delete, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Budget, deleteBudget } from '@/services/budgetService';
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
  budgetProgress: Record<string, number>;
}

const BudgetList = ({ 
  budgets, 
  loading, 
  error, 
  selectedMonth,
  onMonthChange,
  onDelete,
  onUpdate,
  budgetProgress
}: BudgetListProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [yearInput, setYearInput] = useState(selectedMonth.split('-')[0]);

  // Update yearInput when selectedMonth changes from external sources
  useEffect(() => {
    setYearInput(selectedMonth.split('-')[0]);
  }, [selectedMonth]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentMonth = parseInt(selectedMonth.split('-')[1]);
  const currentYear = parseInt(selectedMonth.split('-')[0]);

  const handlePreviousMonth = () => {
    if (currentMonth === 1) {
      onMonthChange(`${currentYear - 1}-12`);
    } else {
      const newMonth = (currentMonth - 1).toString().padStart(2, '0');
      onMonthChange(`${currentYear}-${newMonth}`);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      onMonthChange(`${currentYear + 1}-01`);
    } else {
      const newMonth = (currentMonth + 1).toString().padStart(2, '0');
      onMonthChange(`${currentYear}-${newMonth}`);
    }
  };

  const handleYearChange = (newYear: number) => {
    const month = selectedMonth.split('-')[1];
    onMonthChange(`${newYear}-${month}`);
  };

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
        {/* Month/Year Navigation */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h6">Budgets for:</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton onClick={handlePreviousMonth} size="small">
              <ChevronLeft />
            </IconButton>
            
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Month</InputLabel>
              <Select
                value={currentMonth}
                label="Month"
                onChange={(e: SelectChangeEvent<number>) => {
                  const newMonth = (e.target.value as number).toString().padStart(2, '0');
                  onMonthChange(`${currentYear}-${newMonth}`);
                }}
              >
                {monthNames.map((month, index) => (
                  <MenuItem key={index} value={index + 1}>{month}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Box sx={{ position: 'relative' }}>
              <TextField
                type="number"
                label="Year"
                value={yearInput}
                onChange={(e) => {
                  const value = e.target.value;
                  setYearInput(value); // Always update display
                  if (value.length === 4 && !isNaN(parseInt(value))) {
                    handleYearChange(parseInt(value));
                  }
                }}
                size="small"
                sx={{ minWidth: 100, maxWidth: 120 }}
              />
            </Box>
            
            <IconButton onClick={handleNextMonth} size="small">
              <ChevronRight />
            </IconButton>
          </Box>
        </Stack>

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
