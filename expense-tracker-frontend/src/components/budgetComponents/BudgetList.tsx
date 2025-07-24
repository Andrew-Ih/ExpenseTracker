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
  LinearProgress
} from '@mui/material';
import { Edit, Delete, ContentCopy } from '@mui/icons-material';
import { Budget, deleteBudget, copyBudgetsToNextMonth } from '@/services/budgetService';
import { getTransactions, Transaction } from '@/services/transactionService';
import BudgetEditDialog from './BudgetEditDialog';

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
  const [copyLoading, setCopyLoading] = useState(false);

  useEffect(() => {
    const fetchBudgetProgress = async () => {
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

  const handleCopyToNextMonth = async () => {
    setCopyLoading(true);
    try {
      const currentDate = new Date(selectedMonth + '-01');
      const nextMonth = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
      const nextMonthStr = nextMonth.toISOString().slice(0, 7);
      
      await copyBudgetsToNextMonth(selectedMonth, nextMonthStr);
      alert(`Budgets copied to ${nextMonthStr} successfully!`);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to copy budgets');
    } finally {
      setCopyLoading(false);
    }
  };

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6">Budgets for:</Typography>
            <TextField
              type="month"
              value={selectedMonth}
              onChange={(e) => onMonthChange(e.target.value)}
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          <Button
            variant="outlined"
            startIcon={<ContentCopy />}
            onClick={handleCopyToNextMonth}
            disabled={copyLoading || budgets.length === 0}
            size="small"
          >
            {copyLoading ? 'Copying...' : 'Copy to Next Month'}
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell align="right">Budget Amount</TableCell>
                <TableCell align="right">Spent</TableCell>
                <TableCell align="right">Remaining</TableCell>
                <TableCell align="center">Progress</TableCell>
                <TableCell align="center">Actions</TableCell>
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
                      <TableCell>{budget.category}</TableCell>
                      <TableCell align="right">
                        <Typography color="primary.main">
                          ${budgetAmount.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography color={isOverBudget ? "error.main" : "text.primary"}>
                          ${spent.toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography color={remaining >= 0 ? "success.main" : "error.main"}>
                          ${Math.abs(remaining).toFixed(2)}
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
                          <Typography variant="caption" color="text.secondary">
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
