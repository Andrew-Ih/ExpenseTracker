'use client';

import { Suspense } from 'react';
import PageLayout from '@/components/common/layout/PageLayout';
import ResetPasswordCard from '@/components/resetPasswordComponents/ResetPasswordCard';

const ResetPasswordContent = () => {
  return (
    <PageLayout>
      <ResetPasswordCard />
    </PageLayout>
  );
};

const ResetPasswordPage = () => {
  return (
    <Suspense fallback={
      <PageLayout>
        <div>Loading...</div>
      </PageLayout>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
};

export default ResetPasswordPage;