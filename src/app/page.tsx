'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { AuthForm } from '@/components/auth-form';
import Logo from '@/components/logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function LoginPage() {
  const { user, loading, k10TestCompleted } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Wait until auth state is loaded

    if (user) {
      // The redirect logic is now centralized in the AppLayout
      // This simply pushes to the wellness assistant, and the layout will handle
      // redirecting to the K10 test if needed.
      router.push('/wellness-assistant');
    }
  }, [user, loading, router]);

  // Show a loading state while auth is being checked or if the user is logged in and redirecting
  if (loading || user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-10 w-48 mx-auto" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mb-8">
        <Logo />
      </div>
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
          <CardDescription>Sign in to access your wellness companion</CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm mode="login" />
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline text-primary/90 hover:text-primary">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
