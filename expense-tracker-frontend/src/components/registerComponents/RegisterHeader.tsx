import { Stack, Typography } from '@mui/material';

const RegisterHeader = () => (
  <Stack spacing={3} alignItems="center">
    <Typography variant="h4" fontWeight="bold" color="white">
      Create Account
    </Typography>
    <Typography variant="body2" color="text.secondary" textAlign="center">
      Join us and start tracking your expenses
    </Typography>
  </Stack>
);

export default RegisterHeader;