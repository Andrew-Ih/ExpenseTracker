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
import { createBudget, Budget } from '@/services/budgetService';

interface BudgetFormProps {
  onBudgetAdded: () => void;
}

const categories = [
  'Food', 'Transportation', 'Housing', 'Utilities', 'Entertainment', 
  'Healthcare', 'Education', 'Shopping', 'Personal', 'Other'
];

const BudgetForm = ({ onBudgetAdded }: BudgetFormProps) => {
  const [formData, setFormData] = useState<Omit<Budget, 'budgetId'>>({
    category: '',
    amount: 0,
    month: new Date().toISOString().slice(0, 7)
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
      await createBudget(formData);
      setSuccess('Budget created successfully!');
      onBudgetAdded();
      
      // Reset form
      setFormData({
        category: '',
        amount: 0,
        month: new Date().toISOString().slice(0, 7)
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create budget');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Create New Budget
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
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
            name="amount"
            label="Budget Amount"
            type="number"
            value={formData.amount}
            onChange={handleTextFieldChange}
            required
            fullWidth
            inputProps={{ step: "0.01", min: "0.01" }}
          />

          <TextField
            name="month"
            label="Month"
            type="month"
            value={formData.month}
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
            {loading ? 'Creating...' : 'Create Budget'}
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};

export default BudgetForm;
