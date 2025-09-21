'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { AuthForm } from '@/components/auth-form';
import Logo from '@/components/logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

const testAccounts = [
  { email: 'test.user.one@example.com', password: 'password123' },
  { email: 'test.user.two@example.com', password: 'password123' },
];

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [testAccountLoading, setTestAccountLoading] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleTestAccountLogin = async (email: string, password: string) => {
    setTestAccountLoading(email);
    try {
      // First, try to sign in
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      // If sign-in fails because the user doesn't exist, create the account
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          // Firebase automatically signs in the user after creation
        } catch (creationError: any) {
          toast({
            title: 'Test Account Creation Error',
            description: creationError.message,
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: 'Authentication Error',
          description: error.message,
          variant: 'destructive',
        });
      }
    } finally {
      setTestAccountLoading(null);
    }
  };

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
        <Separator className="my-4" />
          <CardHeader className="text-center pt-0">
            <CardTitle className="text-lg font-headline">Test Accounts</CardTitle>
            <CardDescription>Use these accounts for quick access.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {testAccounts.map((account) => (
              <Card key={account.email} className="p-4 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">{account.email}</p>
                  <p className="text-xs text-muted-foreground">Password: {account.password}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTestAccountLogin(account.email, account.password)}
                  disabled={!!testAccountLoading}
                >
                  {testAccountLoading === account.email ? 'Signing In...' : 'Sign In'}
                </Button>
              </Card>
            ))}
          </CardContent>
      </Card>
    </main>
  );
}
