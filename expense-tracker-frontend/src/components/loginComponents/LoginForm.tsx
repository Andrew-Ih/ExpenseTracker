'use client';

import { useState } from 'react';
import { Box, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';
import { signIn } from '@/lib/cognito';
import EmailInput from './formComponents/EmailInput';
import PasswordInput from './formComponents/PasswordInput';
import SubmitButton from './formComponents/SubmitButton';
import ForgotPasswordLink from './formComponents/ForgotPasswordLink';

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signIn(formData.email, formData.password);
      if (result.AuthenticationResult?.AccessToken) {
        localStorage.setItem('accessToken', result.AuthenticationResult.AccessToken);
        router.push('/dashboard');
      }
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'name' in error &&
        (error as { name?: string }).name === 'UserNotConfirmedException'
      ) {
        router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
      } else {
        alert(
          typeof error === 'object' && error !== null && 'message' in error
            ? (error as { message?: string }).message
            : 'Login failed'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Stack spacing={3}>
        <EmailInput value={formData.email} onChange={handleChange} />
        <PasswordInput value={formData.password} onChange={handleChange} />
        <ForgotPasswordLink />
        <SubmitButton loading={loading} />
      </Stack>
    </Box>
  );
};

export default LoginForm;