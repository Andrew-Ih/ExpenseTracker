import { Box, Link } from '@mui/material';
import NextLink from 'next/link';

const BackToLoginLink = () => (
  <Box sx={{ mt: 3, textAlign: 'center' }}>
    <Link component={NextLink} href="/login" color="primary" variant="body2">
      Back to Login
    </Link>
  </Box>
);

export default BackToLoginLink;