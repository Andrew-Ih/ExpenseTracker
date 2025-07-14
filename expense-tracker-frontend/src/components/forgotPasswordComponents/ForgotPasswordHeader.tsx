import { Stack, Typography, Box } from '@mui/material';
import { LockReset } from '@mui/icons-material';

const ForgotPasswordHeader = () => (
  <Stack spacing={3} alignItems="center">
    <Box sx={{ p: 2, backgroundColor: 'primary.main', borderRadius: '50%' }}>
      <LockReset sx={{ fontSize: 40, color: 'white' }} />
    </Box>
    <Typography variant="h4" fontWeight="bold" color="white">
      Reset Password
    </Typography>
    <Typography variant="body2" color="text.secondary" textAlign="center">
      Enter your email address and we will send you a code to reset your password
    </Typography>
  </Stack>
);

export default ForgotPasswordHeader;