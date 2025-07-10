import { Box, Link } from '@mui/material';

const ForgotPasswordLink = () => (
  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
    <Link href="/forgot-password" color="primary" variant="body2">
      Forgot password?
    </Link>
  </Box>
);

export default ForgotPasswordLink;