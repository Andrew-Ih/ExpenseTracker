'use client';

import { useState, useEffect } from 'react';
import { Stack, Typography, Alert, CircularProgress, Paper, Box, Divider } from '@mui/material';
import { Person, Security, TrendingUp, DeleteForever } from '@mui/icons-material';
import { getUserProfile, updateUserProfile, deleteUserProfile } from '@/services/userService';
import { getTransactionSummary } from '@/services/transactionService';
import { getBudgets } from '@/services/budgetService';

interface UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface AccountStats {
  totalTransactions: number;
  totalBudgets: number;
}

const ProfileContainer = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [accountStats, setAccountStats] = useState<AccountStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string }>({});

  useEffect(() => {
    loadProfileData();
  });

  // Update state when userProfile changes
  useEffect(() => {
    if (userProfile) {
      setFirstName(userProfile.firstName || '');
      setLastName(userProfile.lastName || '');
    }
  }, [userProfile]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      setError(null);

      const profile = await getUserProfile();
      setUserProfile(profile);
      await loadAccountStatistics();

    } catch (err) {
      console.error('Error loading profile data:', err);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const loadAccountStatistics = async () => {
    try {
      const transactionSummary = await getTransactionSummary();
      const totalTransactions = transactionSummary.summary.transactionCount;
      const budgets = await getBudgets();
      const totalBudgets = budgets.length;

      setAccountStats({
        totalTransactions,
        totalBudgets
      });
    } catch (err) {
      console.error('Error loading account statistics:', err);
    }
  };

  const handleEdit = () => {
    setFirstName(userProfile?.firstName || '');
    setLastName(userProfile?.lastName || '');
    setErrors({});
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: { firstName?: string; lastName?: string } = {};

    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setUpdateLoading(true);
      setError(null);

      const updatedProfile = await updateUserProfile(JSON.stringify({ 
        firstName, 
        lastName, 
        email: userProfile?.email || '' 
      }));
      setUserProfile(updatedProfile);
      setIsEditing(false);

    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleChangePassword = () => {
    window.location.href = '/reset-password';
  };

  const handleAccountDeletion = async () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        setUpdateLoading(true);
        setError(null);

        await deleteUserProfile();
        window.location.href = '/';

      } catch (err) {
        console.error('Error deleting account:', err);
        setError('Failed to delete account');
      } finally {
        setUpdateLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ minHeight: '50vh' }}>
        <CircularProgress />
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Loading profile...
        </Typography>
      </Stack>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  if (!userProfile) {
    return (
      <Alert severity="error">
        Profile not found
      </Alert>
    );
  }

  return (
    <Stack spacing={3} sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Profile Settings
      </Typography>

      <Stack spacing={3}>
        {/* Top Row - 3 Cards */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ alignItems: 'stretch' }}>
          {/* Personal Information */}
          <Paper sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Person color="primary" />
              <Typography variant="h6">Personal Information</Typography>
            </Box>

            <Stack spacing={3} sx={{ flex: 1 }}>
              {/* Email - Read Only */}
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Email Address
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {userProfile.email}
                </Typography>
              </Box>

              <Divider />

              {/* Name Fields */}
              {isEditing ? (
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      First Name
                    </Typography>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: errors.firstName ? '1px solid #d32f2f' : '1px solid #ccc',
                        borderRadius: '4px',
                        fontSize: '16px'
                      }}
                    />
                    {errors.firstName && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                        {errors.firstName}
                      </Typography>
                    )}
                  </Box>

                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Last Name
                    </Typography>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: errors.lastName ? '1px solid #d32f2f' : '1px solid #ccc',
                        borderRadius: '4px',
                        fontSize: '16px'
                      }}
                    />
                    {errors.lastName && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                        {errors.lastName}
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <button
                      onClick={handleSave}
                      disabled={updateLoading}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#1976d2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: updateLoading ? 'not-allowed' : 'pointer',
                        opacity: updateLoading ? 0.7 : 1
                      }}
                    >
                      {updateLoading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={updateLoading}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: 'transparent',
                        color: '#666',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        cursor: updateLoading ? 'not-allowed' : 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </Box>
                </Stack>
              ) : (
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Display Name
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {userProfile.firstName} {userProfile.lastName}
                  </Typography>
                  <button
                    onClick={handleEdit}
                    style={{
                      marginTop: '8px',
                      padding: '6px 12px',
                      backgroundColor: 'transparent',
                      color: '#1976d2',
                      border: '1px solid #1976d2',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Edit
                  </button>
                </Box>
              )}
            </Stack>
          </Paper>

          {/* Account Statistics */}
          <Paper sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <TrendingUp color="primary" />
              <Typography variant="h6">Account Overview</Typography>
            </Box>

            <Stack spacing={3} sx={{ flex: 1 }}>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Total Transactions
                </Typography>
                <Typography variant="h4" color="primary">
                  {accountStats?.totalTransactions || 0}
                </Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Budget Categories
                </Typography>
                <Typography variant="h4" color="primary">
                  {accountStats?.totalBudgets || 0}
                </Typography>
              </Box>
            </Stack>
          </Paper>

          {/* Security Settings */}
          <Paper sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Security color="primary" />
              <Typography variant="h6">Security</Typography>
            </Box>

            <Stack spacing={3} sx={{ flex: 1 }}>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Password Management
                </Typography>
                <button
                  onClick={handleChangePassword}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#1976d2',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Change Password
                </button>
              </Box>

              <Divider />

              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Password Requirements
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • At least 8 characters long<br/>
                  • Contains uppercase and lowercase letters<br/>
                  • Contains at least one number<br/>
                  • Contains at least one special character
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Stack>

        {/* Bottom Row - Danger Zone */}
        <Paper sx={{ p: 3, border: '2px solid', borderColor: 'error.main', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <DeleteForever color="error" />
            <Typography variant="h6" color="error.main">Danger Zone</Typography>
          </Box>

          <Stack spacing={3}>
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Delete Account
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                This action will permanently delete your account and all associated data.
              </Typography>
              <button
                onClick={handleAccountDeletion}
                disabled={updateLoading}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#d32f2f',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: updateLoading ? 'not-allowed' : 'pointer',
                  opacity: updateLoading ? 0.7 : 1
                }}
              >
                {updateLoading ? 'Deleting...' : 'Delete Account'}
              </button>
            </Box>
          </Stack>
        </Paper>
      </Stack>
    </Stack>
  );
};

export default ProfileContainer; 