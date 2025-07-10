'use client';

import { Box, ThemeProvider } from '@mui/material';
import darkTheme from '../../components/common/theme/darkTheme';
import RegisterCard from '../../components/registerComponents/RegisterCard';

const UserRegistration = () => (
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
      <RegisterCard />
    </Box>
  </ThemeProvider>
);

export default UserRegistration;