'use client';

import React, { useState } from 'react';
import { 
  Paper, 
  Typography, 
  Stack, 
  TextField, 
  Button, 
  Box, 
  Chip,
  Divider 
} from '@mui/material';
import { Person, Edit, Save, Cancel } from '@mui/icons-material';

interface UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ProfileInformationProps {
  userProfile: UserProfile | null;
  onUpdate: (firstName: string, lastName: string) => Promise<void>;
  loading: boolean;
}

const ProfileInformation = ({ userProfile, onUpdate, loading }: ProfileInformationProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string }>({});

  // Update state when userProfile changes
  React.useEffect(() => {
    if (userProfile) {
      setFirstName(userProfile.firstName || '');
      setLastName(userProfile.lastName || '');
    }
  }, [userProfile]);

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
      await onUpdate(firstName.trim(), lastName.trim());
      setIsEditing(false);
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!userProfile) {
    return null;
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Person color="primary" />
        <Typography variant="h6">Personal Information</Typography>
      </Box>

      <Stack spacing={3}>
        {/* Email - Read Only */}
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Email Address
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {userProfile.email}
          </Typography>
          <Chip 
            label="Read Only" 
            size="small" 
            color="default" 
            variant="outlined"
            sx={{ mt: 1 }}
          />
        </Box>

        <Divider />

        {/* Name Fields */}
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Display Name
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {userProfile.firstName} {userProfile.lastName}
          </Typography>
        </Box>

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
                startIcon={<Save />}
                onClick={handleSave}
                disabled={loading}
                size="small"
              >
                Save Changes
              </Button>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={handleCancel}
                disabled={loading}
                size="small"
              >
                Cancel
              </Button>
            </Box>
          </Stack>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Edit />}
              onClick={handleEdit}
              size="small"
            >
              Edit Information
            </Button>
          </Box>
        )}

        <Divider />

        {/* Account Information */}
        <Stack spacing={2}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Account Created
            </Typography>
            <Typography variant="body1">
              {formatDate(userProfile.createdAt)}
            </Typography>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Last Updated
            </Typography>
            <Typography variant="body1">
              {formatDate(userProfile.updatedAt)}
            </Typography>
          </Box>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default ProfileInformation; 