'use client';

import { useState } from 'react';
import { Box, Stack } from '@mui/material';
import EmailInput from './formComponents/EmailInput';
import SubmitButton from './formComponents/SubmitButton';
import { useRouter } from 'next/navigation';
import { forgotPassword } from '@/lib/cognito';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email);
      alert('Reset code sent to your email!');
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message || 'Failed to send reset code');
      } else {
        alert('Failed to send reset code');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Stack spacing={3}>
        <EmailInput value={email} onChange={handleChange} />
        <SubmitButton loading={loading} />
      </Stack>
    </Box>
  );
};

export default ForgotPasswordForm;