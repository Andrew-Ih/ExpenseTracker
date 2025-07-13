import { Stack, Typography, Box } from '@mui/material';
import { VpnKey } from '@mui/icons-material';

const ResetPasswordHeader = () => (
  <Stack spacing={3} alignItems="center">
    <Box sx={{ p: 2, backgroundColor: 'primary.main', borderRadius: '50%' }}>
      <VpnKey sx={{ fontSize: 40, color: 'white' }} />
    </Box>
    <Typography variant="h4" fontWeight="bold" color="white">
      Reset Password
    </Typography>
    <Typography variant="body2" color="text.secondary" textAlign="center">
      Enter the verification code sent to your email and your new password
    </Typography>
  </Stack>
);

export default ResetPasswordHeader;