'use client';

import { useState } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Grid, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  IconButton,
  SelectChangeEvent
} from '@mui/material';
import { FilterList, Clear } from '@mui/icons-material';
import { TransactionQueryParams } from '@/services/transactionService';

interface TransactionFiltersProps {
  onFilterChange: (filters: TransactionQueryParams) => void;
}

const categories = [
  'All', 'Food', 'Transportation', 'Housing', 'Utilities', 'Entertainment', 
  'Healthcare', 'Education', 'Shopping', 'Personal', 'Salary', 
  'Investment', 'Gift', 'Other'
];

const TransactionFilters = ({ onFilterChange }: TransactionFiltersProps) => {
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filters, setFilters] = useState<TransactionQueryParams>({});

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name) {
      if (value === '') {
        const newFilters = { ...filters };
        delete newFilters[name as keyof TransactionQueryParams];
        setFilters(newFilters);
      } else {
        setFilters(prev => ({ ...prev, [name]: value }));
      }
    }
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    if (name) {
      if (value === 'All') {
        const newFilters = { ...filters };
        delete newFilters[name as keyof TransactionQueryParams];
        setFilters(newFilters);
      } else {
        setFilters(prev => ({ ...prev, [name]: value }));
      }
    }
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
  };

  const handleClearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Filters</Typography>
        <IconButton onClick={() => setFiltersVisible(!filtersVisible)}>
          <FilterList />
        </IconButton>
      </Box>

      {filtersVisible && (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              name="startDate"
              label="Start Date"
              type="date"
              value={filters.startDate || ''}
              onChange={handleTextFieldChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              name="endDate"
              label="End Date"
              type="date"
              value={filters.endDate || ''}
              onChange={handleTextFieldChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                name="type"
                value={filters.type || 'All'}
                label="Type"
                onChange={handleSelectChange}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="income">Income</MenuItem>
                <MenuItem value="expense">Expense</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={filters.category || 'All'}
                label="Category"
                onChange={handleSelectChange}
              >
                {categories.map(category => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button 
                variant="outlined" 
                startIcon={<Clear />} 
                onClick={handleClearFilters}
              >
                Clear
              </Button>
              <Button 
                variant="contained" 
                onClick={handleApplyFilters}
              >
                Apply Filters
              </Button>
            </Box>
          </Grid>
        </Grid>
      )}
    </Paper>
  );
};

export default TransactionFilters;