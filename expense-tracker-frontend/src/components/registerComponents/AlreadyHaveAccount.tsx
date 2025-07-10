import { Box, Typography, Link } from '@mui/material';
import NextLink from 'next/link';

const AlreadyHaveAccount = () => (
  <Box sx={{ mt: 3, textAlign: 'center' }}>
    <Typography variant="body2" color="text.secondary">
      Already have an account?{' '}
      <Link component={NextLink} href="/login" color="primary">
        Sign in
      </Link>
    </Typography>
  </Box>
);

export default AlreadyHaveAccount;