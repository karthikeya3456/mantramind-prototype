'use client';

import { K10TestForm } from '@/components/k10-test-form';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function K10TestPage() {
    const { user, loading: authLoading, k10TestCompleted } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            router.push('/');
            return;
        }

        if (k10TestCompleted === true) {
            router.push('/dashboard');
        }
    }, [user, authLoading, k10TestCompleted, router]);

    if (authLoading || k10TestCompleted === null || k10TestCompleted === true) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background p-4">
                <div className="w-full max-w-2xl space-y-4">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-96 w-full" />
                </div>
            </div>
        );
    }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl">
        <K10TestForm />
      </div>
    </div>
  );
}
