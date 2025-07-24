'use client';

import { useState } from 'react';
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
  TextField
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { Budget, deleteBudget } from '@/services/budgetService';
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

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
          <TextField
            type="month"
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            size="small"
            InputLabelProps={{ shrink: true }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell align="right">Budget Amount</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : budgets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <Typography variant="body1" sx={{ py: 2 }}>
                      No budgets found for this month
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                budgets.map((budget) => (
                  <TableRow key={budget.budgetId}>
                    <TableCell>{budget.category}</TableCell>
                    <TableCell align="right">
                      <Typography color="primary.main">
                        ${parseFloat(budget.amount.toString()).toFixed(2)}
                      </Typography>
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
                ))
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
