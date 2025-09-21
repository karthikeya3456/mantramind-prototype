'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { AuthForm, onTestAccountLogin } from '@/components/auth-form';
import Logo from '@/components/logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const testAccounts = [
  { email: 'judge-1@example.com', password: 'password123' },
  { email: 'judge-2@example.com', password: 'password123' },
];

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [testAccountLoading, setTestAccountLoading] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleTestLogin = async (email: string, password: string) => {
    setTestAccountLoading(email);
    try {
      await onTestAccountLogin(email, password);
      // Redirect is handled by the page's useEffect
    } catch (error: any) {
      toast({
        title: 'Authentication Error',
        description: "Could not sign in with the test account. Please try signing up manually or contact support if the issue persists.",
        variant: 'destructive',
      });
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
        <CardHeader className="pt-0">
          <CardTitle className="text-lg text-center">For Judging Purposes</CardTitle>
          <CardDescription className="text-center">Use these test accounts to explore the app.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {testAccounts.map((account) => (
            <Card key={account.email} className="bg-muted/50 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium">{account.email}</p>
                        <p className="text-xs text-muted-foreground">Password: {account.password}</p>
                    </div>
                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleTestLogin(account.email, account.password)}
                        disabled={!!testAccountLoading}
                        >
                        {testAccountLoading === account.email ? <Loader2 className="animate-spin" /> : 'Sign In'}
                    </Button>
                </div>
            </Card>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}
