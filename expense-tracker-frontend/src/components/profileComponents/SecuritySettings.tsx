'use client';

import { 
  Paper, 
  Typography, 
  Stack, 
  Button, 
  Box,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider 
} from '@mui/material';
import { 
  Security, 
  Lock, 
  CheckCircle,
  Info 
} from '@mui/icons-material';

const SecuritySettings = () => {
  const handleChangePassword = () => {
    // Navigate to reset password page
    window.location.href = '/reset-password';
  };

  const passwordRequirements = [
    'At least 8 characters long',
    'Contains at least one uppercase letter',
    'Contains at least one lowercase letter',
    'Contains at least one number',
    'Contains at least one special character'
  ];

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Security color="primary" />
        <Typography variant="h6">Security & Account Management</Typography>
      </Box>

      <Stack spacing={3}>
        {/* Password Management */}
        <Box>
          <Typography variant="body1" fontWeight={500} gutterBottom>
            Password Management
          </Typography>
          <Stack spacing={2}>
            <Button
              variant="outlined"
              startIcon={<Lock />}
              onClick={handleChangePassword}
              sx={{ alignSelf: 'flex-start' }}
            >
              Change Password
            </Button>
            
            <Alert severity="info" icon={<Info />}>
              Password changes require email verification for security purposes.
            </Alert>
          </Stack>
        </Box>

        <Divider />

        {/* Password Requirements */}
        <Box>
          <Typography variant="body1" fontWeight={500} gutterBottom>
            Password Requirements
          </Typography>
          <List dense>
            {passwordRequirements.map((requirement, index) => (
              <ListItem key={index} sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <CheckCircle color="success" fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary={requirement}
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        <Divider />

        {/* Security Information */}
        <Box>
          <Typography variant="body1" fontWeight={500} gutterBottom>
            Security Features
          </Typography>
          <Stack spacing={1}>
            <Typography variant="body2" color="text.secondary">
              • JWT token-based authentication
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Secure password hashing with AWS Cognito
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • HTTPS encryption for all data transmission
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • User data isolation in DynamoDB
            </Typography>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
};

export default SecuritySettings; 