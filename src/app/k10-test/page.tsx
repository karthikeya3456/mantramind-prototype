'use client';

import { K10TestForm } from '@/components/k10-test-form';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
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

        // The primary redirection logic is now handled by the AppLayout. This serves
        // as a direct safeguard for this specific page. If a user who has already
        // completed the test somehow lands here, redirect them.
        if (k10TestCompleted === true) {
            router.push('/wellness-assistant');
        }
    }, [user, authLoading, k10TestCompleted, router]);

    // Show a loading skeleton while we're checking auth status or if the user
    // has completed the test and is being redirected away. This prevents the
    // form from flashing on screen for users who shouldn't be here.
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
