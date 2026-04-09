'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getRole } from '@/lib/auth';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      const role = getRole();
      router.replace(role === 'ADMIN' ? '/dashboard' : '/my-tasks');
    } else {
      router.replace('/login');
    }
  }, [router]);

  return <LoadingSpinner />;
}
