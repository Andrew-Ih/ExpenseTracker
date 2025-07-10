import { Box, Typography, Link } from '@mui/material';
import NextLink from 'next/link';

const LoginFooter = () => (
  <Box sx={{ mt: 3, textAlign: 'center' }}>
    <Typography variant="body2" color="text.secondary">
      Do not have an account?{' '}
      <Link component={NextLink} href="/register" color="primary">
        Sign up
      </Link>
    </Typography>
  </Box>
);

export default LoginFooter;