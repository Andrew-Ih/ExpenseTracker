'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Box, Stack } from '@mui/material';
import { confirmForgotPassword } from '@/lib/cognito';
import CodeInput from './formComponents/CodeInput';
import NewPasswordInput from './formComponents/NewPasswordInput';
import ConfirmPasswordInput from './formComponents/ConfirmPasswordInput';
import SubmitButton from './formComponents/SubmitButton';
import PasswordTooltip from '../common/theme/PasswordTooltip';

const ResetPasswordForm = () => {
  const [formData, setFormData] = useState({
    code: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    } else {
      router.push('/forgot-password');
    }
  }, [searchParams, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      await confirmForgotPassword(email, formData.code, formData.newPassword);
      alert('Password reset successful!');
      router.push('/login');
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message || 'Password reset failed');
      } else {
        alert('Password reset failed');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Stack spacing={3}>
        <CodeInput value={formData.code} onChange={handleChange} email={email} />
        <NewPasswordInput value={formData.newPassword} onChange={handleChange} />
        <ConfirmPasswordInput value={formData.confirmPassword} onChange={handleChange} /> 
        <PasswordTooltip />
        <SubmitButton loading={loading} />
      </Stack>
    </Box>
  );
};

export default ResetPasswordForm;