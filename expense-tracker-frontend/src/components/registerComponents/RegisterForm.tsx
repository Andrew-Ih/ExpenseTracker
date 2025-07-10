'use client';

import { useState } from 'react';
import { Box, Stack } from '@mui/material';
import FullNameInput from './formComponents/FullNameInput';
import EmailInput from './formComponents/EmailInput';
import PasswordInput from './formComponents/PasswordInput';
import ConfirmPasswordInput from './formComponents/ConfirmPasswordInput';
import PasswordTooltip from './PasswordTooltip';
import SubmitButton from './formComponents/SubmitButton';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
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