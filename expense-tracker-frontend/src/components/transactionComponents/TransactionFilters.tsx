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
  // Collapse
} from '@mui/material';
import { FilterList, Clear, ChevronLeft, ChevronRight } from '@mui/icons-material';
// import { FilterList, Clear, ChevronLeft, ChevronRight, ExpandMore, ExpandLess, Refresh } from '@mui/icons-material';
import { TransactionQueryParams } from '@/services/transactionService';

interface TransactionFiltersProps {
  onFilterChange: (filters: TransactionQueryParams) => void;
  selectedMonth: number;
  selectedYear: number;
  onMonthYearChange: (month: number, year: number) => void;
  // onCustomDateRangeChange?: (startDate: string, endDate: string) => void;
  // onResetToCurrentMonth?: () => void;
  // isCustomDateRange?: boolean;
  // customDateRange?: { startDate: string; endDate: string } | null;
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
  // onCustomDateRangeChange,
  // onResetToCurrentMonth,
  // isCustomDateRange,
  // customDateRange
}: TransactionFiltersProps) => {
  const [filtersVisible, setFiltersVisible] = useState(false);
  // const [showCustomRange, setShowCustomRange] = useState(false);
  const [filters, setFilters] = useState<TransactionQueryParams>({});
  // const [customStartDate, setCustomStartDate] = useState('');
  // const [customEndDate, setCustomEndDate] = useState('');
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

  // const handleCustomDateSubmit = () => {
  //   if (customStartDate && customEndDate) {
  //     if (customStartDate > customEndDate) {
  //       alert('Start date must be before end date');
  //       return;
  //     }
  //     onCustomDateRangeChange(customStartDate, customEndDate);
  //     // Don't close the dropdown - let user keep it open if they want to adjust
  //   }
  // };

  // const formatCustomDateRange = () => {
  //   if (!customDateRange) return '';
    
  //   const startDate = new Date(customDateRange.startDate);
  //   const endDate = new Date(customDateRange.endDate);
    
  //   const formatDate = (date: Date) => {
  //     const day = date.getDate();
  //     const month = monthNames[date.getMonth()];
  //     const year = date.getFullYear();
  //     return `${day}${getDaySuffix(day)} ${month} ${year}`;
  //   };
    
  //   return (
  //     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
  //       <Box sx={{ 
  //         backgroundColor: 'primary.main', 
  //         color: 'primary.contrastText', 
  //         px: 1.5, 
  //         py: 0.5, 
  //         borderRadius: 1,
  //         fontSize: '0.875rem',
  //         fontWeight: 'medium'
  //       }}>
  //         {formatDate(startDate)}
  //       </Box>
  //       <Typography variant="h6" sx={{ color: 'text.secondary' }}>-</Typography>
  //       <Box sx={{ 
  //         backgroundColor: 'primary.main', 
  //         color: 'primary.contrastText', 
  //         px: 1.5, 
  //         py: 0.5, 
  //         borderRadius: 1,
  //         fontSize: '0.875rem',
  //         fontWeight: 'medium'
  //       }}>
  //         {formatDate(endDate)}
  //       </Box>
  //     </Box>
  //   );
  // };

  // const getDaySuffix = (day: number) => {
  //   if (day >= 11 && day <= 13) return 'th';
  //   switch (day % 10) {
  //     case 1: return 'st';
  //     case 2: return 'nd';
  //     case 3: return 'rd';
  //     default: return 'th';
  //   }
  // };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      {/* Custom Date Range Controls - Top Right */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        {/* Month/Year Navigation or Custom Date Range Display - Left side */}
        {/* {!isCustomDateRange ? ( */}
          <Stack direction="row" spacing={2} alignItems="center">
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
        {/* ) : ( */}
          {/* Show custom date range display */}
          {/* <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="h6">Transactions Period:</Typography>
            {formatCustomDateRange()}
          </Stack> */}
        {/* )} */}

        {/* Control buttons - Right side */}
        <Stack direction="row" spacing={1}>
          {/* <Button
            onClick={() => setShowCustomRange(!showCustomRange)}
            startIcon={showCustomRange ? <ExpandLess /> : <ExpandMore />}
            variant="outlined"
            size="small"
          >
            Custom Date Range
          </Button> */}
          {/* {isCustomDateRange && (
            <Button
              onClick={onResetToCurrentMonth}
              startIcon={<Refresh />}
              variant="outlined"
              size="small"
              color="secondary"
            >
              Reset
            </Button>
          )} */}
          <IconButton onClick={() => setFiltersVisible(!filtersVisible)}>
            <FilterList />
          </IconButton>
        </Stack>
      </Box>

      {/* Custom Date Range Form */}
      {/* <Collapse in={showCustomRange}>
        <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 3 }}>
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
      </Collapse> */}

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
