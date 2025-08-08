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
  Stack,
  Card,
  CardContent,
  Chip
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
      <Paper sx={{ p: { xs: 2, md: 3 }, mb: { xs: 2, md: 3 }, overflow: 'hidden' }}>
        {/* Month/Year Navigation */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" sx={{ mb: { xs: 2, md: 3 } }}>
          <Typography 
            variant="h6"
            sx={{
              fontSize: { xs: '1.25rem', md: '1.5rem' },
              fontWeight: 700
            }}
          >
            Budgets for:
          </Typography>
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

        {/* Desktop Table Layout */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
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
        </Box>

        {/* Mobile Card Layout */}
        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={32} />
            </Box>
          ) : budgets.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1">
                No budgets found for this month
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              {budgets.map((budget) => {
                const spent = budget.budgetId ? budgetProgress[budget.budgetId] || 0 : 0;
                const budgetAmount = parseFloat(budget.amount.toString());
                const remaining = budgetAmount - spent;
                const progressPercent = budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0;
                const isOverBudget = spent > budgetAmount;
                
                return (
                  <Card key={budget.budgetId} sx={{ p: 2 }}>
                    <CardContent sx={{ p: '0 !important' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontSize: '1.125rem',
                            fontWeight: 700
                          }}
                        >
                          {budget.category}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
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
                        </Box>
                      </Box>
                      
                      <Stack spacing={1.5}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" color="text.secondary">Budget Amount:</Typography>
                          <Typography color="primary.main" variant="body1" sx={{ fontWeight: 600 }}>
                            {formatCurrency(budgetAmount)}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" color="text.secondary">Spent:</Typography>
                          <Typography color={isOverBudget ? "error.main" : "text.primary"} variant="body1" sx={{ fontWeight: 600 }}>
                            {formatCurrency(spent)}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="body2" color="text.secondary">Remaining:</Typography>
                          <Typography color={remaining >= 0 ? "success.main" : "error.main"} variant="body1" sx={{ fontWeight: 600 }}>
                            {formatCurrency(remaining >= 0 ? remaining : 0)}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ mt: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="body2" color="text.secondary">Progress:</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {progressPercent.toFixed(0)}%
                            </Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={Math.min(progressPercent, 100)}
                            color={isOverBudget ? "error" : progressPercent > 80 ? "warning" : "success"}
                            sx={{ height: 6, borderRadius: 3 }}
                          />
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                );
              })}
            </Stack>
          )}
        </Box>
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
