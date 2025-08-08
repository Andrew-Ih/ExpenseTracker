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
  Stack
} from '@mui/material';
import { FilterList, Clear, ChevronLeft, ChevronRight } from '@mui/icons-material';
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

const TransactionFilters = ({ 
  onFilterChange, 
  selectedMonth, 
  selectedYear, 
  onMonthYearChange
}: TransactionFiltersProps) => {
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filters, setFilters] = useState<TransactionQueryParams>({});
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

  return (
    <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3, overflow: 'hidden' }}>
      {/* Month/Year Navigation */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        alignItems: { xs: 'stretch', sm: 'center' }, 
        gap: { xs: 2, sm: 0 },
        mb: 3 
      }}>
        {/* Left side - Month/Year Navigation */}
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={{ xs: 1, sm: 2 }} 
          alignItems={{ xs: 'stretch', sm: 'center' }}
          sx={{ flex: 1 }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              fontSize: { xs: '1rem', md: '1.25rem' },
              fontWeight: 600
            }}
          >
            Transactions for:
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            justifyContent: { xs: 'center', sm: 'flex-start' }
          }}>
            <IconButton onClick={handlePreviousMonth} size="small">
              <ChevronLeft />
            </IconButton>
            
            <FormControl size="small" sx={{ minWidth: { xs: 120, md: 140 } }}>
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
              sx={{ minWidth: { xs: 80, md: 100 }, maxWidth: { xs: 100, md: 120 } }}
            />
            
            <IconButton onClick={handleNextMonth} size="small">
              <ChevronRight />
            </IconButton>
          </Box>
        </Stack>

        {/* Right side - Filter button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton 
            onClick={() => setFiltersVisible(!filtersVisible)}
            sx={{ 
              bgcolor: filtersVisible ? 'primary.main' : 'transparent',
              color: filtersVisible ? 'primary.contrastText' : 'inherit',
              '&:hover': {
                bgcolor: filtersVisible ? 'primary.dark' : 'action.hover'
              }
            }}
          >
            <FilterList />
          </IconButton>
        </Box>
      </Box>

      {/* Filter Controls */}
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
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'flex-end', 
            gap: 2 
          }}>
            <Button 
              variant="outlined" 
              startIcon={<Clear />} 
              onClick={handleClearFilters}
              fullWidth={false}
              sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' } }}
            >
              Clear
            </Button>
            <Button 
              variant="contained" 
              onClick={handleApplyFilters}
              fullWidth={false}
              sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' } }}
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
