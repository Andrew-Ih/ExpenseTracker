'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { confirmSignUp, resendConfirmationCode } from '@/lib/cognito';
import PageLayout from '@/components/common/layout/PageLayout';
import VerificationCard from '@/components/verificationComponents/VerificationCard';
import VerificationForm from '@/components/verificationComponents/VerificationForm';
import { createUser } from '@/services/userService';

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
    try {
      await confirmSignUp(email, code);
      const pendingUserData = localStorage.getItem('pendingUserData');
      
      if(pendingUserData) {
        await createUser(pendingUserData);
        localStorage.removeItem('pendingUserData');
        router.push('/login');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Verification failed');
      }
    }
  };

  const handleResendCode = async () => {
    try {
      await resendConfirmationCode(email);
      alert('Verification code sent!');
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Failed to resend code');
      }
    }
  };

  if (!email) {
    return null; // Will redirect
  }

  return (
    <PageLayout>
      <VerificationCard>
        <VerificationForm
          email={email}
          onVerify={handleVerify}
          onResendCode={handleResendCode}
        />
      </VerificationCard>
    </PageLayout>
  );
};

export default VerifyEmailPage;