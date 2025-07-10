'use client';

import { useState } from 'react';
import { Box, Stack } from '@mui/material';
import CodeInput from './formComponents/CodeInput';
import SubmitButton from './formComponents/SubmitButton';
import ResendCodeButton from './formComponents/ResendCodeButton';
import BackToLoginLink from './formComponents/BackToLoginLink';

interface VerificationFormProps {
  email: string;
  onVerify: (code: string) => Promise<void>;
  onResendCode: () => Promise<void>;
}

const VerificationForm = ({ email, onVerify, onResendCode }: VerificationFormProps) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return;

    setLoading(true);
    try {
      await onVerify(code);
    } catch (error) {
      console.error('Verification error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await onResendCode();
    } catch (error) {
      console.error('Resend error:', error);
    } finally {
      setResending(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Stack spacing={3}>
        <CodeInput value={code} onChange={handleCodeChange} email={email} />
        <SubmitButton loading={loading} disabled={code.length !== 6} />
        <ResendCodeButton resending={resending} onClick={handleResend} />
        <BackToLoginLink />
      </Stack>
    </Box>
  );
};

export default VerificationForm;