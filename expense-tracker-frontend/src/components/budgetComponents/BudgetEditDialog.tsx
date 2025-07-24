'use client';

import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Stack,
  Alert,
  SelectChangeEvent
} from '@mui/material';
import { Budget, updateBudget } from '@/services/budgetService';

interface BudgetEditDialogProps {
  open: boolean;
  onClose: () => void;
  budget: Budget;
  onUpdate: (budget: Budget) => void;
}

const categories = [
  'Food', 'Transportation', 'Housing', 'Utilities', 'Entertainment', 
  'Healthcare', 'Education', 'Shopping', 'Personal', 'Other'
];

const BudgetEditDialog = ({ 
  open, 
  onClose, 
  budget, 
  onUpdate 
}: BudgetEditDialogProps) => {
  const [formData, setFormData] = useState<Budget>({ ...budget });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFormData({ ...budget });
  }, [budget]);

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

  const handleSubmit = async () => {
    if (!formData.budgetId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { budgetId, ...updateData } = formData;
      const result = await updateBudget(budgetId, updateData);
      onUpdate(result.budget);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update budget');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Budget</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Stack spacing={3} sx={{ mt: 1 }}>
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
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BudgetEditDialog;
