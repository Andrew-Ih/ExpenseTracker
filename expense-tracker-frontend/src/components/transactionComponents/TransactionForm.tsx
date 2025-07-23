'use client';

import { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Alert,
  Stack,
  SelectChangeEvent
} from '@mui/material';
import { createTransaction, Transaction } from '@/services/transactionService';

interface TransactionFormProps {
  onTransactionAdded: () => void;
}

const categories = [
  'Food', 'Transportation', 'Housing', 'Utilities', 'Entertainment', 
  'Healthcare', 'Education', 'Shopping', 'Personal', 'Salary', 
  'Investment', 'Gift', 'Other'
];

const TransactionForm = ({ onTransactionAdded }: TransactionFormProps) => {
  const [formData, setFormData] = useState<Omit<Transaction, 'transactionId'>>({
    amount: 0,
    type: 'expense',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    if (name) {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await createTransaction(formData);
      setSuccess('Transaction created successfully!');
      onTransactionAdded();
      
      // Reset form
      setFormData({
        amount: 0,
        type: 'expense',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Add New Transaction
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            name="amount"
            label="Amount"
            type="number"
            value={formData.amount}
            onChange={handleTextFieldChange}
            required
            fullWidth
            inputProps={{ step: "0.01" }}
          />

          <FormControl fullWidth required>
            <InputLabel>Type</InputLabel>
            <Select
              name="type"
              value={formData.type}
              label="Type"
              onChange={handleSelectChange}
            >
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="expense">Expense</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth required>
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={formData.category}
              label="Category"
              onChange={handleSelectChange}
            >
              {categories.map(category => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            name="description"
            label="Description"
            value={formData.description}
            onChange={handleTextFieldChange}
            fullWidth
            multiline
            rows={2}
          />

          <TextField
            name="date"
            label="Date"
            type="date"
            value={formData.date}
            onChange={handleTextFieldChange}
            required
            fullWidth
            InputLabelProps={{ shrink: true }}
          />

          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? 'Creating...' : 'Create Transaction'}
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};

export default TransactionForm;