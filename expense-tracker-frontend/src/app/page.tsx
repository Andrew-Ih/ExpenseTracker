'use client';

import {
  Box,
  Typography,
  Button,
  Stack,
  ThemeProvider,
  createTheme
} from '@mui/material';
import { AccountBalanceWallet, TrendingUp } from '@mui/icons-material';
import NextLink from 'next/link';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2563eb',
    },
    background: {
      default: '#030712',
      paper: '#111827',
    },
  },
});

export default function Home() {
  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2
        }}
      >
        <Box sx={{ textAlign: 'center', maxWidth: 600 }}>
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
            <AccountBalanceWallet sx={{ fontSize: 80, color: 'primary.main' }} />
          </Box>
          
          <Typography 
            variant="h2" 
            fontWeight="bold" 
            color="white" 
            sx={{ mb: 2 }}
          >
            Expense Tracker
          </Typography>
          
          <Typography 
            variant="h5" 
            color="text.secondary" 
            sx={{ mb: 6 }}
          >
            Take control of your finances and track your expenses efficiently
          </Typography>
          
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={3} 
            justifyContent="center"
          >
            <Button
              component={NextLink}
              href="/login"
              variant="contained"
              size="large"
              sx={{
                py: 2,
                px: 4,
                background: 'linear-gradient(45deg, #2563eb 30%, #3b82f6 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1d4ed8 30%, #2563eb 90%)',
                }
              }}
            >
              Sign In
            </Button>
            
            <Button
              component={NextLink}
              href="/register"
              variant="outlined"
              size="large"
              sx={{
                py: 2,
                px: 4,
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.light',
                  backgroundColor: 'rgba(37, 99, 235, 0.1)'
                }
              }}
            >
              Sign Up
            </Button>
          </Stack>
          
          <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <TrendingUp sx={{ color: 'text.secondary', mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Start your financial journey today
            </Typography>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
  