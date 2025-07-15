'use client';

import { useState } from 'react';
import { Box, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';
import { signUp } from '@/lib/cognito';
import FullNameInput from './formComponents/FullNameInput';
import EmailInput from './formComponents/EmailInput';
import PasswordInput from './formComponents/PasswordInput';
import ConfirmPasswordInput from './formComponents/ConfirmPasswordInput';
import PasswordTooltip from '../common/theme/PasswordTooltip';
import SubmitButton from './formComponents/SubmitButton';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    setLoading(true);
    try {
      const result = await signUp(formData.email, formData.password, formData.fullName);
      
      const [firstName, ...lastNameParts] = formData.fullName.split(' ');
      const lastName = lastNameParts.join(' ') || '';
      
      localStorage.setItem('pendingUserData', JSON.stringify({
        userId: result.userSub,
        firstName,
        lastName,
        email: formData.email
      }));

      router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Stack spacing={3}>
        <FullNameInput value={formData.fullName} onChange={handleChange} />
        <EmailInput value={formData.email} onChange={handleChange} />
        <PasswordInput value={formData.password} onChange={handleChange} />
        <ConfirmPasswordInput value={formData.confirmPassword} onChange={handleChange} />
        <PasswordTooltip />
        <SubmitButton loading={loading} />
      </Stack>
    </Box>
  );
};

export default RegisterForm;