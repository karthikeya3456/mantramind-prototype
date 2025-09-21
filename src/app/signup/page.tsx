'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { AuthForm } from '@/components/auth-form';
import Logo from '@/components/logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';


export default function SignupPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Redirect logic is handled here for new signups.
        if (user) {
            // For new signups, always go to profile setup first. The app layout
            // will then handle the subsequent redirect to the K-10 test.
            router.push('/welcome/profile');
        }
    }, [user, router]);
    
    // Show a loading skeleton if we are checking auth or if the user is signed in and we're redirecting.
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
          <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
          <CardDescription>Join MantraMind and start your wellness journey</CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm mode="signup" />
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/" className="underline text-primary/90 hover:text-primary">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
