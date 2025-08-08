'use client';

import { useState, useEffect } from 'react';
import { Stack, Typography, Alert, CircularProgress, Paper, Box, Divider, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Person, Security, DeleteForever } from '@mui/icons-material';
import { getUserProfile, updateUserProfile, deleteUserProfile } from '@/services/userService';
// import { getTransactionSummary } from '@/services/transactionService';
// import { getBudgets } from '@/services/budgetService';

interface UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
}

// interface AccountStats {
//   totalTransactions: number;
//   totalBudgets: number;
// }

const ProfileContainer = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  // const [accountStats, setAccountStats] = useState<AccountStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string }>({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);

  useEffect(() => {
    loadProfileData();
  }, []);

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
      // await loadAccountStatistics();

    } catch (err) {
      console.error('Error loading profile data:', err);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  // const loadAccountStatistics = async () => {
  //   try {
  //     const transactionSummary = await getTransactionSummary();
  //     const totalTransactions = transactionSummary.summary.transactionCount;
  //     const budgets = await getBudgets();
  //     const totalBudgets = budgets.length;

  //     setAccountStats({
  //       totalTransactions,
  //       totalBudgets
  //     });
  //   } catch (err) {
  //     console.error('Error loading account statistics:', err);
  //   }
  // };

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

  const handleAccountDeletion = () => {
    setDeleteModalOpen(true);
    setConfirmEmail('');
    setEmailError(null);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setConfirmEmail('');
    setEmailError(null);
  };

  const handleConfirmDelete = async () => {
    if (!userProfile) return;

    // Validate email
    if (confirmEmail.trim() !== userProfile.email.trim()) {
      setEmailError('Please enter your email address exactly as shown');
      return;
    }

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
      setDeleteModalOpen(false);
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
    <Box sx={{ 
      width: '100%', 
      maxWidth: 1200, 
      mx: 'auto',
      p: { xs: 1, md: 3 },
      overflowX: 'hidden'
    }}>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom
        sx={{
          fontSize: { xs: '1.75rem', md: '2.125rem' },
          fontWeight: 700,
          mb: { xs: 2, md: 3 }
        }}
      >
        Profile Settings
      </Typography>

      <Stack spacing={{ xs: 2, md: 3 }}>
        {/* Top Row - 2 Cards */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 2, md: 3 }} sx={{ alignItems: 'stretch' }}>
          {/* Personal Information */}
          <Paper sx={{ 
            p: { xs: 2, md: 3 }, 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: { xs: 2, md: 3 } }}>
              <Person color="primary" />
              <Typography 
                variant="h6"
                sx={{
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                  fontWeight: 700
                }}
              >
                Personal Information
              </Typography>
            </Box>

            <Stack spacing={{ xs: 2, md: 3 }} sx={{ flex: 1 }}>
              {/* Email - Read Only */}
              <Box>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  gutterBottom
                  sx={{
                    fontSize: { xs: '0.875rem', md: '1rem' }
                  }}
                >
                  Email Address
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontWeight: 600,
                    fontSize: { xs: '1rem', md: '1.125rem' }
                  }}
                >
                  {userProfile.email}
                </Typography>
              </Box>

              <Divider />

              {/* Name Fields */}
              {isEditing ? (
                <Stack spacing={2}>
                  <TextField
                    label="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                    fullWidth
                    size="small"
                  />
                  <TextField
                    label="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                    fullWidth
                    size="small"
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      onClick={handleSave}
                      disabled={updateLoading}
                      size="small"
                      sx={{
                        py: { xs: 1.5, md: 1 },
                        fontSize: { xs: '1rem', md: '1.125rem' }
                      }}
                    >
                      {updateLoading ? 'Saving...' : 'Save'}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleCancel}
                      disabled={updateLoading}
                      size="small"
                      sx={{
                        py: { xs: 1.5, md: 1 },
                        fontSize: { xs: '1rem', md: '1.125rem' }
                      }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Stack>
              ) : (
                <Box>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    gutterBottom
                    sx={{
                      fontSize: { xs: '0.875rem', md: '1rem' }
                    }}
                  >
                    Display Name
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontWeight: 600,
                      fontSize: { xs: '1rem', md: '1.125rem' }
                    }}
                  >
                    {userProfile.firstName} {userProfile.lastName}
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={handleEdit}
                    size="small"
                    sx={{ 
                      mt: 1,
                      py: { xs: 1.5, md: 1 },
                      fontSize: { xs: '1rem', md: '1.125rem' }
                    }}
                  >
                    Edit
                  </Button>
                </Box>
              )}
            </Stack>
          </Paper>

          {/* Security Settings */}
          <Paper sx={{ 
            p: { xs: 2, md: 3 }, 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: { xs: 2, md: 3 } }}>
              <Security color="primary" />
              <Typography 
                variant="h6"
                sx={{
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                  fontWeight: 700
                }}
              >
                Security
              </Typography>
            </Box>

            <Stack spacing={{ xs: 2, md: 3 }} sx={{ flex: 1 }}>
              <Box>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  gutterBottom
                  sx={{
                    fontSize: { xs: '0.875rem', md: '1rem' }
                  }}
                >
                  Password Management
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleChangePassword}
                  size="small"
                  sx={{
                    py: { xs: 1.5, md: 1 },
                    fontSize: { xs: '1rem', md: '1.125rem' }
                  }}
                >
                  Change Password
                </Button>
              </Box>

              <Divider />

              <Box>
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  gutterBottom
                  sx={{
                    fontSize: { xs: '0.875rem', md: '1rem' },
                    fontWeight: 600
                  }}
                >
                  Password Requirements
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: '0.875rem', md: '1rem' }
                  }}
                >
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
        <Paper sx={{ 
          p: { xs: 2, md: 3 }, 
          border: '2px solid', 
          borderColor: 'error.main', 
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: { xs: 2, md: 3 } }}>
            <DeleteForever color="error" />
            <Typography 
              variant="h6" 
              color="error.main"
              sx={{
                fontSize: { xs: '1.25rem', md: '1.5rem' },
                fontWeight: 700
              }}
            >
              Danger Zone
            </Typography>
          </Box>

          <Stack spacing={{ xs: 2, md: 3 }}>
            <Box>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                gutterBottom
                sx={{
                  fontSize: { xs: '0.875rem', md: '1rem' }
                }}
              >
                Delete Account
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  mb: 2,
                  fontSize: { xs: '0.875rem', md: '1rem' }
                }}
              >
                This action will permanently delete your account and all associated data.
              </Typography>
              <Button
                variant="contained"
                color="error"
                onClick={handleAccountDeletion}
                disabled={updateLoading}
                sx={{
                  py: { xs: 1.5, md: 1 },
                  fontSize: { xs: '1rem', md: '1.125rem' }
                }}
              >
                {updateLoading ? 'Deleting...' : 'Delete Account'}
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Stack>

      <Dialog open={deleteModalOpen} onClose={handleCloseDeleteModal} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: 'error.main' }}>
          Confirm Account Deletion
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3}>
            <Alert severity="error">
              <Typography variant="body2" fontWeight={500}>
                This action cannot be undone!
              </Typography>
              <Typography variant="body2">
                Once you delete your account, all your data will be permanently removed and cannot be recovered.
              </Typography>
            </Alert>

            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                To confirm deletion, please enter your email address exactly as shown:
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontWeight: 500 }}>
                {userProfile?.email}
              </Typography>
              <TextField
                label="Enter your email address"
                type="email"
                value={confirmEmail}
                onChange={(e) => {
                  setConfirmEmail(e.target.value);
                  if (emailError) setEmailError(null);
                }}
                error={!!emailError}
                helperText={emailError}
                fullWidth
                size="small"
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteModal} disabled={updateLoading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmDelete}
            disabled={updateLoading || confirmEmail.trim() !== (userProfile?.email || '').trim()}
          >
            {updateLoading ? 'Deleting...' : 'Confirm Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfileContainer; 