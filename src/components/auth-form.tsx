'use client';

import { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { ChromeIcon } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

const signupSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type AuthFormProps = {
  mode: 'login' | 'signup';
};

// This function will be called from the login page for test accounts
export const onTestAccountLogin = async (email: string, password: string) => {
  try {
    // First, try to sign in.
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    // If the user doesn't exist, create it.
    if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Let's create a default name for the test user.
      const name = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      await updateProfile(userCredential.user, { displayName: name });
    } else {
      // For other errors, re-throw them to be handled by the caller.
      throw error;
    }
  }
};


export function AuthForm({ mode }: AuthFormProps) {
  const [loading, setLoading] = useState(false);
  const schema = mode === 'login' ? loginSchema : signupSchema;
  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      if (mode === 'signup' && 'name' in data) {
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        await updateProfile(userCredential.user, { displayName: data.name });
      } else {
        await signInWithEmailAndPassword(auth, data.email, data.password);
      }
      // Redirect is handled by the page
    } catch (error: any) {
      toast({
        title: 'Authentication Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // Redirect is handled by the page
    } catch (error: any) {
      toast({
        title: 'Google Sign-In Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4">
          {mode === 'signup' && (
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Your Name" {...register('name')} disabled={loading} />
              {errors.name && <p className="text-sm text-destructive">{String(errors.name.message)}</p>}
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" {...register('email')} disabled={loading} />
            {errors.email && <p className="text-sm text-destructive">{String(errors.email.message)}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" {...register('password')} disabled={loading} />
            {errors.password && <p className="text-sm text-destructive">{String(errors.password.message)}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Processing...' : mode === 'login' ? 'Login' : 'Create Account'}
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>
      <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={loading}>
        <ChromeIcon className="mr-2 h-4 w-4" />
        Google
      </Button>
    </div>
  );
}
