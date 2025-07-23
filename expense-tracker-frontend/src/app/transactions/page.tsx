'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageLayout from '@/components/common/layout/PageLayout';
import TransactionsContainer from '@/components/transactionComponents/TransactionsContainer';

const TransactionsPage = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <PageLayout centered={false}>
      <TransactionsContainer />
    </PageLayout>
  );
};

export default TransactionsPage;