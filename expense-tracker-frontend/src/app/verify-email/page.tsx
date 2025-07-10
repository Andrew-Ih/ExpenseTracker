'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Box,
  ThemeProvider,
  createTheme
} from '@mui/material';
import VerificationCard from '@/components/verificationComponents/VerificationCard';
import VerificationForm from '@/components/verificationComponents/VerificationForm';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2563eb',
    },
    background: {
      default: '#030712',
      paper: '#111827',
    },
  },
});

const VerifyEmailPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState('');

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    } else {
      // Redirect to register if no email provided
      router.push('/register');
    }
  }, [searchParams, router]);

  const handleVerify = async (code: string) => {
    // TODO: Implement email verification API call
    console.log('Verifying code:', code, 'for email:', email);
    
    // Mock verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Redirect to dashboard on success
    router.push('/dashboard');
  };

  const handleResendCode = async () => {
    // TODO: Implement resend code API call
    console.log('Resending code to:', email);
    
    // Mock resend
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  if (!email) {
    return null; // Will redirect
  }

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
        <VerificationCard>
          <VerificationForm
            email={email}
            onVerify={handleVerify}
            onResendCode={handleResendCode}
          />
        </VerificationCard>
      </Box>
    </ThemeProvider>
  );
};

export default VerifyEmailPage;