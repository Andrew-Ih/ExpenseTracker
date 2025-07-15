'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Typography, 
  Button, 
  CircularProgress, 
  Alert, 
  TextField,
  Stack,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { getUserProfile, updateUserProfile, deleteUserProfile } from '@/services/userService';

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
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Form state for updates
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: ''
  });

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
      setFormData({
        firstName: profile.firstName,
        lastName: profile.lastName
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
      setError('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setUpdating(true);
    setError(null);
    setSuccess(null);
    
    try {
      const userData = JSON.stringify(formData);
      await updateUserProfile(userData);
      
      // Reload profile to get updated data
      await loadUserProfile();
      setEditMode(false);
      setSuccess('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      setError('Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    setError(null);
    
    try {
      await deleteUserProfile();
      localStorage.removeItem('accessToken');
      alert('Account deleted successfully');
      router.push('/');
    } catch (error) {
      console.error('Failed to delete profile:', error);
      setError('Failed to delete account');
      setDeleting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    router.push('/');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
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

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      
      {userProfile && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              User Profile
            </Typography>
            
            {!editMode ? (
              // Display Mode
              <Stack spacing={2}>
                <Typography variant="body1">
                  <strong>Name:</strong> {userProfile.firstName} {userProfile.lastName}
                </Typography>
                <Typography variant="body1">
                  <strong>Email:</strong> {userProfile.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>User ID:</strong> {userProfile.userId}
                </Typography>
                
                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <Button 
                    variant="contained" 
                    onClick={() => setEditMode(true)}
                  >
                    Edit Profile
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="error"
                    onClick={handleDeleteProfile}
                    disabled={deleting}
                  >
                    {deleting ? 'Deleting...' : 'Delete Account'}
                  </Button>
                </Stack>
              </Stack>
            ) : (
              // Edit Mode
              <Stack spacing={3}>
                <TextField
                  name="firstName"
                  label="First Name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  fullWidth
                />
                <TextField
                  name="lastName"
                  label="Last Name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  fullWidth
                />
                
                <Stack direction="row" spacing={2}>
                  <Button 
                    variant="contained" 
                    onClick={handleUpdateProfile}
                    disabled={updating}
                  >
                    {updating ? 'Updating...' : 'Save Changes'}
                  </Button>
                  <Button 
                    variant="outlined" 
                    onClick={() => {
                      setEditMode(false);
                      setFormData({
                        firstName: userProfile.firstName,
                        lastName: userProfile.lastName
                      });
                    }}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            )}
          </CardContent>
        </Card>
      )}
      
      <Divider sx={{ my: 3 }} />
      
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
