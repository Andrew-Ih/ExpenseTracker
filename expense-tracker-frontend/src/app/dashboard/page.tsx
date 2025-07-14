'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button, CircularProgress, Alert } from '@mui/material';
import { getUserProfile } from '@/services/userService';

interface UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
}

const Dashboard = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
      loadUserProfile();
    }
  }, [router]);

  const loadUserProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const profile = await getUserProfile();
      setUserProfile(profile);
      console.log('User profile loaded:', profile);
    } catch (error) {
      console.error('Failed to load profile:', error);
      setError('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    router.push('/');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      {loading && (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CircularProgress size={20} sx={{ mr: 1 }} />
          <Typography>Loading profile...</Typography>
        </Box>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {userProfile && (
        <Box sx={{ mb: 3, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            Welcome, {userProfile.firstName} {userProfile.lastName}!
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Email: {userProfile.email}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            User ID: {userProfile.userId}
          </Typography>
        </Box>
      )}
      
      <Typography variant="body1" sx={{ mb: 2 }}>
        Welcome to your expense tracker!
      </Typography>
      
      <Button variant="outlined" onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  );
};

export default Dashboard;
