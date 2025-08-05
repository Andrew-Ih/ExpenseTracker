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

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const BudgetForm = ({ onBudgetAdded }: BudgetFormProps) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // 1-12
  const currentYear = currentDate.getFullYear();

  const [formData, setFormData] = useState<Omit<Budget, 'budgetId'>>({
    category: '',
    amount: 0,
    month: `${currentYear}-${currentMonth.toString().padStart(2, '0')}`
  });
  
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [yearInput, setYearInput] = useState(currentYear.toString());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    category?: string;
    amount?: string;
    month?: string;
    year?: string;
  }>({});

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

  const handleMonthChange = (e: SelectChangeEvent<number>) => {
    const month = e.target.value as number;
    setSelectedMonth(month);
    const monthStr = month.toString().padStart(2, '0');
    setFormData(prev => ({ ...prev, month: `${selectedYear}-${monthStr}` }));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setYearInput(value);
    
    // Only update the form data if it's a valid year
    const year = parseInt(value);
    if (!isNaN(year) && year >= 2000 && year <= 3000) {
      setSelectedYear(year);
      const monthStr = selectedMonth.toString().padStart(2, '0');
      setFormData(prev => ({ ...prev, month: `${year}-${monthStr}` }));
    }
  };

  const validateForm = () => {
    const errors: {
      category?: string;
      amount?: string;
      month?: string;
      year?: string;
    } = {};

    // Validate category
    if (!formData.category) {
      errors.category = 'Category is required';
    }

    // Validate amount
    if (!formData.amount || formData.amount <= 0) {
      errors.amount = 'Amount must be greater than 0';
    }

    // Validate year
    const year = parseInt(yearInput);
    if (!yearInput || yearInput.trim() === '') {
      errors.year = 'Year is required';
    } else if (isNaN(year)) {
      errors.year = 'Year must be a valid number';
    } else if (year < 2000 || year > 3000) {
      errors.year = 'Year must be between 2000 and 3000';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    setValidationErrors({});

    // Validate form before submission
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      await createBudget(formData);
      setSuccess('Budget created successfully!');
      onBudgetAdded();
      
      // Reset form
      setFormData({
        category: '',
        amount: 0,
        month: `${currentYear}-${currentMonth.toString().padStart(2, '0')}`
      });
      setSelectedMonth(currentMonth);
      setSelectedYear(currentYear);
      setYearInput(currentYear.toString());
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
          <FormControl fullWidth required error={!!validationErrors.category}>
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
            {validationErrors.category && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                {validationErrors.category}
              </Typography>
            )}
          </FormControl>

          <TextField
            name="amount"
            label="Budget Amount"
            type="number"
            value={formData.amount}
            onChange={handleTextFieldChange}
            required
            fullWidth
            error={!!validationErrors.amount}
            helperText={validationErrors.amount}
            inputProps={{ step: "0.01", min: "0.01" }}
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <FormControl fullWidth required>
              <InputLabel>Month</InputLabel>
              <Select
                value={selectedMonth}
                label="Month"
                onChange={handleMonthChange}
              >
                {monthNames.map((month, index) => (
                  <MenuItem key={index} value={index + 1}>{month}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Year"
              type="number"
              value={yearInput}
              onChange={handleYearChange}
              required
              fullWidth
              error={!!validationErrors.year}
              helperText={validationErrors.year}
              inputProps={{ 
                min: "2000", 
                max: "3000",
                step: "1"
              }}
            />
          </Stack>

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
