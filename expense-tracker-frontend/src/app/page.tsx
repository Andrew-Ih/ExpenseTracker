'use client';

import { Box, Stack } from '@mui/material';
import PageLayout from '../components/common/layout/PageLayout';
import SignUpButton from '../components/homeComponents/SignUpButton';
import SignInButton from '../components/homeComponents/SignInButton';
import HeroIcon from '../components/homeComponents/HeroIcon';
import HeroText from '../components/homeComponents/HeroText';
import FooterMessage from '../components/homeComponents/FooterMessage';

export default function Home() {
  return (
    <PageLayout>
      <Box sx={{ textAlign: 'center', maxWidth: 600 }}>
        <HeroIcon />
        <HeroText />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
          <SignInButton />
          <SignUpButton />
        </Stack>
        <FooterMessage />
      </Box>
    </PageLayout>
  );
}