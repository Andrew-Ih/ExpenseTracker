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
  SelectChangeEvent,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { createTransaction, createRecurringTransaction, Transaction, RecurringTransaction } from '@/services/transactionService';

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
  
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringConfig, setRecurringConfig] = useState({
    frequency: 'monthly' as 'monthly' | 'yearly' | 'bi-weekly',
    dayOfMonth: 1,
    monthOfYear: 1, // For yearly
    dayOfMonth2: 15, // For bi-weekly
    startMonth: new Date().getMonth() + 1,
    startYear: new Date().getFullYear(),
    endMonth: 12,
    endYear: new Date().getFullYear()
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

  const validateRecurringConfig = () => {
    const errors: string[] = [];
    
    // Basic field validation
    if (recurringConfig.dayOfMonth < 1 || recurringConfig.dayOfMonth > 31) {
      errors.push('Day of month must be between 1 and 31');
    }
    
    if (recurringConfig.frequency === 'yearly') {
      if (recurringConfig.startYear >= recurringConfig.endYear) {
        errors.push(`End year (${recurringConfig.endYear}) must be after start year (${recurringConfig.startYear})`);
      }
      if (!recurringConfig.monthOfYear || recurringConfig.monthOfYear < 1 || recurringConfig.monthOfYear > 12) {
        errors.push('Please select a valid month for yearly transactions');
      }
    } else {
      // Monthly and bi-weekly validation
      const startDate = new Date(recurringConfig.startYear, recurringConfig.startMonth - 1);
      const endDate = new Date(recurringConfig.endYear, recurringConfig.endMonth - 1);
      
      if (startDate >= endDate) {
        const startMonthName = new Date(0, recurringConfig.startMonth - 1).toLocaleString('default', { month: 'long' });
        const endMonthName = new Date(0, recurringConfig.endMonth - 1).toLocaleString('default', { month: 'long' });
        errors.push(`End date (${endMonthName} ${recurringConfig.endYear}) must be after start date (${startMonthName} ${recurringConfig.startYear})`);
      }
      
      if (recurringConfig.frequency === 'bi-weekly') {
        if (recurringConfig.dayOfMonth === recurringConfig.dayOfMonth2) {
          errors.push(`Both days cannot be the same (${recurringConfig.dayOfMonth}). Please choose different days`);
        }
        if (recurringConfig.dayOfMonth2 < 1 || recurringConfig.dayOfMonth2 > 31) {
          errors.push('Second day of month must be between 1 and 31');
        }
        const gap = Math.abs(recurringConfig.dayOfMonth - recurringConfig.dayOfMonth2);
        if (gap < 7) {
          errors.push(`Days are too close together (${gap} days apart). Consider at least 7 days apart for bi-weekly`);
        }
      }
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isRecurring) {
        // Client-side validation
        const validationErrors = validateRecurringConfig();
        if (validationErrors.length > 0) {
          setError(validationErrors.join('. '));
          setLoading(false);
          return;
        }
        
        const recurringData: RecurringTransaction = {
          templateData: formData,
          frequency: recurringConfig.frequency,
          dayOfMonth: recurringConfig.dayOfMonth,
          ...(recurringConfig.frequency === 'yearly' && { monthOfYear: recurringConfig.monthOfYear }),
          ...(recurringConfig.frequency === 'bi-weekly' && { dayOfMonth2: recurringConfig.dayOfMonth2 }),
          startMonth: recurringConfig.startMonth,
          startYear: recurringConfig.startYear,
          endMonth: recurringConfig.endMonth,
          endYear: recurringConfig.endYear
        };
        
        const result = await createRecurringTransaction(recurringData);
        setSuccess(`Recurring transaction created! Generated ${result.generatedCount} transactions.`);
      } else {
        await createTransaction(formData);
        setSuccess('Transaction created successfully!');
      }
      
      onTransactionAdded();
      
      // Reset form
      setFormData({
        amount: 0,
        type: 'expense',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      setIsRecurring(false);
      setRecurringConfig({
        frequency: 'monthly',
        dayOfMonth: 1,
        monthOfYear: 1,
        dayOfMonth2: 15,
        startMonth: new Date().getMonth() + 1,
        startYear: new Date().getFullYear(),
        endMonth: 12,
        endYear: new Date().getFullYear()
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

          {!isRecurring && (
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
          )}

          <FormControlLabel
            control={
              <Checkbox 
                checked={isRecurring} 
                onChange={(e) => setIsRecurring(e.target.checked)} 
              />
            }
            label="Make this a recurring transaction"
          />

          {isRecurring && (
            <>
              <FormControl fullWidth required>
                <InputLabel>Frequency</InputLabel>
                <Select
                  value={recurringConfig.frequency}
                  label="Frequency"
                  onChange={(e: SelectChangeEvent) => 
                    setRecurringConfig({...recurringConfig, frequency: e.target.value as 'monthly' | 'yearly' | 'bi-weekly'})
                  }
                >
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="yearly">Yearly</MenuItem>
                  <MenuItem value="bi-weekly">Bi-weekly (twice per month)</MenuItem>
                </Select>
              </FormControl>
              
              {recurringConfig.frequency === 'yearly' ? (
                <Stack direction="row" spacing={2}>
                  <TextField
                    type="number"
                    label="Day of Month"
                    value={recurringConfig.dayOfMonth}
                    onChange={(e) => setRecurringConfig({...recurringConfig, dayOfMonth: parseInt(e.target.value)})}
                    required
                    fullWidth
                    inputProps={{ min: 1, max: 31 }}
                  />
                  <FormControl fullWidth required>
                    <InputLabel>Month of Year</InputLabel>
                    <Select
                      value={recurringConfig.monthOfYear}
                      label="Month of Year"
                      onChange={(e: SelectChangeEvent<number>) => 
                        setRecurringConfig({...recurringConfig, monthOfYear: e.target.value as number})
                      }
                    >
                      {Array.from({length: 12}, (_, i) => (
                        <MenuItem key={i+1} value={i+1}>
                          {new Date(0, i).toLocaleString('default', { month: 'long' })}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              ) : recurringConfig.frequency === 'bi-weekly' ? (
                <Stack direction="row" spacing={2}>
                  <TextField
                    type="number"
                    label="First Day of Month"
                    value={recurringConfig.dayOfMonth}
                    onChange={(e) => setRecurringConfig({...recurringConfig, dayOfMonth: parseInt(e.target.value)})}
                    required
                    fullWidth
                    inputProps={{ min: 1, max: 31 }}
                  />
                  <TextField
                    type="number"
                    label="Second Day of Month"
                    value={recurringConfig.dayOfMonth2}
                    onChange={(e) => setRecurringConfig({...recurringConfig, dayOfMonth2: parseInt(e.target.value)})}
                    required
                    fullWidth
                    inputProps={{ min: 1, max: 31 }}
                  />
                </Stack>
              ) : (
                <TextField
                  type="number"
                  label="Day of Month"
                  value={recurringConfig.dayOfMonth}
                  onChange={(e) => setRecurringConfig({...recurringConfig, dayOfMonth: parseInt(e.target.value)})}
                  required
                  fullWidth
                  inputProps={{ min: 1, max: 31 }}
                  helperText="Day 31 will become last day of month for months with fewer days"
                />
              )}
              
              {recurringConfig.frequency === 'yearly' ? (
                <Stack direction="row" spacing={2}>
                  <TextField
                    type="number"
                    label="Start Year"
                    value={recurringConfig.startYear}
                    onChange={(e) => setRecurringConfig({...recurringConfig, startYear: parseInt(e.target.value)})}
                    required
                    fullWidth
                    inputProps={{ min: 2020, max: 2030 }}
                  />
                  <TextField
                    type="number"
                    label="End Year"
                    value={recurringConfig.endYear}
                    onChange={(e) => setRecurringConfig({...recurringConfig, endYear: parseInt(e.target.value)})}
                    required
                    fullWidth
                    inputProps={{ min: 2020, max: 2030 }}
                  />
                </Stack>
              ) : (
                <>
                  <Stack direction="row" spacing={2}>
                    <FormControl fullWidth required>
                      <InputLabel>Start Month</InputLabel>
                      <Select
                        value={recurringConfig.startMonth}
                        label="Start Month"
                        onChange={(e: SelectChangeEvent<number>) => 
                          setRecurringConfig({...recurringConfig, startMonth: e.target.value as number})
                        }
                      >
                        {Array.from({length: 12}, (_, i) => (
                          <MenuItem key={i+1} value={i+1}>
                            {new Date(0, i).toLocaleString('default', { month: 'long' })}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    
                    <TextField
                      type="number"
                      label="Start Year"
                      value={recurringConfig.startYear}
                      onChange={(e) => setRecurringConfig({...recurringConfig, startYear: parseInt(e.target.value)})}
                      required
                      fullWidth
                      inputProps={{ min: 2020, max: 2030 }}
                    />
                  </Stack>
                  
                  <Stack direction="row" spacing={2}>
                    <FormControl fullWidth required>
                      <InputLabel>End Month</InputLabel>
                      <Select
                        value={recurringConfig.endMonth}
                        label="End Month"
                        onChange={(e: SelectChangeEvent<number>) => 
                          setRecurringConfig({...recurringConfig, endMonth: e.target.value as number})
                        }
                      >
                        {Array.from({length: 12}, (_, i) => (
                          <MenuItem key={i+1} value={i+1}>
                            {new Date(0, i).toLocaleString('default', { month: 'long' })}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    
                    <TextField
                      type="number"
                      label="End Year"
                      value={recurringConfig.endYear}
                      onChange={(e) => setRecurringConfig({...recurringConfig, endYear: parseInt(e.target.value)})}
                      required
                      fullWidth
                      inputProps={{ min: 2020, max: 2030 }}
                    />
                  </Stack>
                </>
              )}
            </>
          )}

          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? 'Creating...' : isRecurring ? 'Create Recurring Transaction' : 'Create Transaction'}
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};

export default TransactionForm;
