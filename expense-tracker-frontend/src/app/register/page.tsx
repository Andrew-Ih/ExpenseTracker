'use client';

import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Stack,
  IconButton,
  InputAdornment,
  Link,
  ThemeProvider,
  createTheme
} from '@mui/material';
import { Visibility, VisibilityOff, Person, Email, Lock } from '@mui/icons-material';
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

const UserRegistration = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Implement registration logic
    setTimeout(() => setLoading(false), 2000);
  };

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
        <Card 
          sx={{ 
            maxWidth: 450, 
            width: '100%',
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(17, 24, 39, 0.8)',
            border: '1px solid rgba(75, 85, 99, 0.3)'
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={3} alignItems="center">
              <Typography variant="h4" fontWeight="bold" color="white">
                Create Account
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Join us and start tracking your expenses
              </Typography>
            </Stack>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  name="fullName"
                  label="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  name="email"
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ 
                    py: 1.5,
                    background: 'linear-gradient(45deg, #2563eb 30%, #3b82f6 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1d4ed8 30%, #2563eb 90%)',
                    }
                  }}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </Stack>
            </Box>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link component={NextLink} href="/login" color="primary">
                  Sign in
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </ThemeProvider>
  );
};

export default UserRegistration;