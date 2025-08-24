'use client';

import { 
  Paper, 
  Typography, 
  Stack, 
  Button, 
  Box,
  Divider
} from '@mui/material';
import { 
  Security, 
  Description,
  Storage,
  OpenInNew 
} from '@mui/icons-material';

interface AccountStats {
  totalTransactions: number;
  totalBudgets: number;
  accountAge: string;
}

interface DataPrivacyProps {
  stats: AccountStats | null;
}

const DataPrivacy = ({ stats }: DataPrivacyProps) => {
  const handlePrivacyPolicy = () => {
    // For now, just show an alert - in production this would link to actual privacy policy
    alert('Privacy Policy page would be implemented here');
  };

  const handleTermsOfService = () => {
    // For now, just show an alert - in production this would link to actual terms
    alert('Terms of Service page would be implemented here');
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
        <Security color="primary" />
        <Typography variant="h6">Data & Privacy</Typography>
      </Box>

      <Stack spacing={3}>
        {/* Data Usage Summary */}
        <Box>
          <Typography variant="body1" fontWeight={500} gutterBottom>
            Data Usage Summary
          </Typography>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Storage color="action" />
              <Typography variant="body2" color="text.secondary">
                Your account contains:
              </Typography>
            </Box>
            
            <Stack spacing={1} sx={{ pl: 3 }}>
              <Typography variant="body2" color="text.secondary">
                • {stats?.totalTransactions || 0} financial transactions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • {stats?.totalBudgets || 0} budget categories
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Account data for {stats?.accountAge || 'unknown'} period
              </Typography>
            </Stack>
          </Stack>
        </Box>

        <Divider />

        {/* Privacy & Terms Links */}
        <Box>
          <Typography variant="body1" fontWeight={500} gutterBottom>
            Legal Information
          </Typography>
          <Stack spacing={2}>
            <Button
              variant="outlined"
              startIcon={<Security />}
              endIcon={<OpenInNew />}
              onClick={handlePrivacyPolicy}
              sx={{ alignSelf: 'flex-start' }}
            >
              Privacy Policy
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<Description />}
              endIcon={<OpenInNew />}
              onClick={handleTermsOfService}
              sx={{ alignSelf: 'flex-start' }}
            >
              Terms of Service
            </Button>
          </Stack>
        </Box>

        <Divider />

        {/* Data Protection Information */}
        <Box>
          <Typography variant="body1" fontWeight={500} gutterBottom>
            Data Protection
          </Typography>
          <Stack spacing={1}>
            <Typography variant="body2" color="text.secondary">
              • Your data is stored securely in AWS DynamoDB
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • All data is encrypted in transit and at rest
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • User data is isolated and private to your account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • You can delete your account and all associated data at any time
            </Typography>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
};

export default DataPrivacy; 