'use client';

import { Box, ThemeProvider } from '@mui/material';
import darkTheme from '../../components/common/theme/darkTheme';
import LoginCard from '../../components/loginComponents/LoginCard';

const UserLogin = () => {
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
        <LoginCard />
      </Box>
    </ThemeProvider>
  );
};

export default UserLogin;