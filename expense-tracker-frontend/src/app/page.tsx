'use client';

import { Box, Stack, ThemeProvider, } from '@mui/material';
import darkTheme from '../components/common/theme/darkTheme';
import SignUpButton from '../components/homeComponents/SignUpButton';
import SignInButton from '../components/homeComponents/SignInButton';
import HeroIcon from '../components/homeComponents/HeroIcon';
import HeroText from '../components/homeComponents/HeroText';
import FooterMessage from '../components/homeComponents/FooterMessage';

export default function Home() {
  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2
        }}
      >
        <Box sx={{ textAlign: 'center', maxWidth: 600 }}>
          <HeroIcon />
          <HeroText />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
            <SignInButton />
            <SignUpButton />
          </Stack>
          <FooterMessage />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
  