'use client';

import { useState, useEffect } from 'react';
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
  IconButton,
  SelectChangeEvent,
  Stack,
  Collapse
} from '@mui/material';
import { FilterList, Clear, ChevronLeft, ChevronRight, ExpandMore, ExpandLess } from '@mui/icons-material';
import { TransactionQueryParams } from '@/services/transactionService';

interface TransactionFiltersProps {
  onFilterChange: (filters: TransactionQueryParams) => void;
  selectedMonth: number;
  selectedYear: number;
  onMonthYearChange: (month: number, year: number) => void;
}

const categories = [
  'All', 'Food', 'Transportation', 'Housing', 'Utilities', 'Entertainment', 
  'Healthcare', 'Education', 'Shopping', 'Personal', 'Salary', 
  'Investment', 'Gift', 'Other'
];

const TransactionFilters = ({ onFilterChange, selectedMonth, selectedYear, onMonthYearChange }: TransactionFiltersProps) => {
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [filters, setFilters] = useState<TransactionQueryParams>({});
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [yearInput, setYearInput] = useState(selectedYear.toString());

  // Update yearInput when selectedYear changes from external sources (like arrow buttons)
  useEffect(() => {
    setYearInput(selectedYear.toString());
  }, [selectedYear]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

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
    setCustomStartDate('');
    setCustomEndDate('');
    setShowCustomRange(false);
    onFilterChange({});
  };

  const handlePreviousMonth = () => {
    if (selectedMonth === 1) {
      onMonthYearChange(12, selectedYear - 1);
    } else {
      onMonthYearChange(selectedMonth - 1, selectedYear);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      onMonthYearChange(1, selectedYear + 1);
    } else {
      onMonthYearChange(selectedMonth + 1, selectedYear);
    }
  };

  const handleCustomDateSubmit = () => {
    if (customStartDate && customEndDate) {
      if (customStartDate > customEndDate) {
        alert('Start date must be before end date');
        return;
      }
      const customFilters = { startDate: customStartDate, endDate: customEndDate };
      setFilters(customFilters);
      onFilterChange(customFilters);
      setShowCustomRange(false);
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      {/* Month/Year Navigation */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h6">Transactions for:</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={handlePreviousMonth} size="small">
            <ChevronLeft />
          </IconButton>
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Month</InputLabel>
            <Select
              value={selectedMonth}
              label="Month"
              onChange={(e: SelectChangeEvent<number>) => 
                onMonthYearChange(e.target.value as number, selectedYear)
              }
            >
              {monthNames.map((month, index) => (
                <MenuItem key={index} value={index + 1}>{month}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            type="number"
            label="Year"
            value={yearInput}
            onChange={(e) => {
              const value = e.target.value;
              setYearInput(value); // Always update display
              if (value.length === 4 && !isNaN(parseInt(value))) {
                onMonthYearChange(selectedMonth, parseInt(value));
              }
            }}
            size="small"
            sx={{ minWidth: 100, maxWidth: 120 }}
          />
          
          <IconButton onClick={handleNextMonth} size="small">
            <ChevronRight />
          </IconButton>
        </Box>
      </Stack>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Filters</Typography>
        <IconButton onClick={() => setFiltersVisible(!filtersVisible)}>
          <FilterList />
        </IconButton>
      </Box>

      {filtersVisible && (
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
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
          </Stack>
          
          {/* Custom Date Range Toggle */}
          <Button
            onClick={() => setShowCustomRange(!showCustomRange)}
            startIcon={showCustomRange ? <ExpandLess /> : <ExpandMore />}
            variant="outlined"
            size="small"
          >
            Custom Date Range
          </Button>

          {/* Custom Date Range Form */}
          <Collapse in={showCustomRange}>
            <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="end">
                <TextField
                  type="date"
                  label="Start Date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  type="date"
                  label="End Date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
                <Button 
                  variant="contained" 
                  onClick={handleCustomDateSubmit}
                  disabled={!customStartDate || !customEndDate}
                  size="small"
                >
                  Apply Range
                </Button>
              </Stack>
            </Box>
          </Collapse>
          
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
        </Stack>
      )}
    </Paper>
  );
};

export default TransactionFilters;
