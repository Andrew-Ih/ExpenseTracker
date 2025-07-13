'use client';

import { Box, ThemeProvider } from '@mui/material';
import darkTheme from '../../components/common/theme/darkTheme';
import ForgotPasswordCard from '../../components/forgotPasswordComponents/ForgotPasswordCard';

const ForgotPasswordPage = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <ForgotPasswordCard />
      </Box>
    </ThemeProvider>
  );
};

export default ForgotPasswordPage;