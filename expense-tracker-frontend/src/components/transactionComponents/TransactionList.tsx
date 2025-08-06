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
  DialogActions
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { Transaction, deleteTransaction } from '@/services/transactionService';
import TransactionEditDialog from './TransactionEditDialog';
import { formatCurrency } from '@/utils/formatCurrency';

interface TransactionListProps {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  onLoadMore: () => void;
  onDelete: (transactionId: string) => void;
  onUpdate: (transaction: Transaction) => void;
}

const TransactionList = ({ 
  transactions, 
  loading, 
  error, 
  hasMore, 
  onLoadMore,
  onDelete,
  onUpdate
}: TransactionListProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [expandedDescriptionId, setExpandedDescriptionId] = useState<string | null>(null);

  const handleEditClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedTransaction?.transactionId) return;
    
    setDeleteLoading(true);
    try {
      await deleteTransaction(selectedTransaction.transactionId);
      onDelete(selectedTransaction.transactionId);
      setDeleteDialogOpen(false);
    } catch (err) {
      console.error('Failed to delete transaction:', err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleTransactionUpdated = (updatedTransaction: Transaction) => {
    onUpdate(updatedTransaction);
    setEditDialogOpen(false);
  };

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.length === 0 && !loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography variant="body1" sx={{ py: 2 }}>
                      No transactions found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction) => (
                  <TableRow key={transaction.transactionId}>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>
                      <Typography
                        color={transaction.type === 'income' ? 'success.main' : 'error.main'}
                      >
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                      </Typography>
                    </TableCell>
                    <TableCell>{transaction.category}</TableCell>
                    <TableCell 
                      onClick={() => {
                        if (transaction.description?.length > 30 && transaction.transactionId) {
                          setExpandedDescriptionId(expandedDescriptionId === transaction.transactionId ? null : transaction.transactionId);
                        }
                      }}
                      sx={{ 
                        maxWidth: 200, 
                        cursor: transaction.description?.length > 30 ? 'pointer' : 'default',
                        ...(expandedDescriptionId === transaction.transactionId ? {
                          whiteSpace: 'normal',
                          wordBreak: 'break-word'
                        } : {
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap'
                        })
                      }}
                    >                      
                      <Typography 
                        noWrap={expandedDescriptionId !== transaction.transactionId}
                        title={expandedDescriptionId === transaction.transactionId ? '' : transaction.description}
                      >
                        {transaction.description}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography
                        color={transaction.type === 'income' ? 'success.main' : 'error.main'}
                      >
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(parseFloat(transaction.amount.toString()))}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton 
                        size="small" 
                        color="primary" 
                        onClick={() => handleEditClick(transaction)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error" 
                        onClick={() => handleDeleteClick(transaction)}
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

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        {hasMore && !loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <Button onClick={onLoadMore}>Load More</Button>
          </Box>
        )}
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this transaction?
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

      {/* Edit Transaction Dialog */}
      {selectedTransaction && (
        <TransactionEditDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          transaction={selectedTransaction}
          onUpdate={handleTransactionUpdated}
        />
      )}
    </>
  );
};

export default TransactionList;