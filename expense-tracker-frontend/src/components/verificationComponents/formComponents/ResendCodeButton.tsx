'use client';

import { Box, Button, Typography } from '@mui/material';

interface ResendCodeButtonProps {
  resending: boolean;
  onClick: () => void;
}

const ResendCodeButton = ({ resending, onClick }: ResendCodeButtonProps) => (
  <Box sx={{ textAlign: 'center' }}>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
      Did not receive the code?
    </Typography>
    <Button
      variant="text"
      onClick={onClick}
      disabled={resending}
      sx={{ color: 'primary.main' }}
    >
      {resending ? 'Sending...' : 'Resend Code'}
    </Button>
  </Box>
);

export default ResendCodeButton;