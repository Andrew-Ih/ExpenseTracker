import { Stack, Typography } from '@mui/material';

const LoginHeader = () => (
  <Stack spacing={3} alignItems="center">
    <Typography variant="h4" fontWeight="bold" color="white">
      Welcome Back
    </Typography>
    <Typography variant="body2" color="text.secondary" textAlign="center">
      Sign in to your account
    </Typography>
  </Stack>
);

export default LoginHeader;