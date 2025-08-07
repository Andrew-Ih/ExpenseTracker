import { Box, Link } from '@mui/material';
import NextLink from 'next/link';

const ForgotPasswordLink = () => (
  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
    <Link component={NextLink} href="/forgot-password" color="primary" variant="body2">
      Forgot password?
    </Link>
  </Box>
);

export default ForgotPasswordLink;