'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { AuthHeader, PasswordInput } from '@/components/auth/ui';
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from '@/components/auth/schemas/auth-schemas';
import { CheckCircle2 } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    // Check if we have a valid session (user clicked reset link)
    async function checkSession() {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      setIsValidSession(!!session);
    }
    checkSession();
  }, []);

  async function onSubmit(data: ResetPasswordFormValues) {
    setIsLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({
      password: data.password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    setIsSuccess(true);
    setTimeout(() => {
      router.push('/plan');
      router.refresh();
    }, 2000);
  }

  // Loading state while checking session
  if (isValidSession === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary p-4">
        <div className="w-full max-w-md">
          <div className="rounded-xl bg-white p-8 shadow-lg">
            <div className="text-center text-muted-foreground">
              Loading...
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No valid session - show error
  if (!isValidSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary p-4">
        <div className="w-full max-w-md">
          <div className="rounded-xl bg-white p-8 shadow-lg">
            <AuthHeader title="Invalid or Expired Link" />
            <div className="mt-4 text-center">
              <p className="text-muted-foreground mb-4">
                This password reset link is invalid or has expired. Please request a new one.
              </p>
              <Button onClick={() => router.push('/login')} className="w-full">
                Back to Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary p-4">
        <div className="w-full max-w-md">
          <div className="rounded-xl bg-white p-8 shadow-lg">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold text-primary">
                Password Updated
              </h1>
              <p className="text-muted-foreground">
                Your password has been successfully updated. Redirecting you to your plan...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary p-4">
      <div className="w-full max-w-md">
        <div className="rounded-xl bg-white p-8 shadow-lg">
          <div className="space-y-6">
            <AuthHeader
              title="Reset Your Password"
              subtitle="Enter your new password below"
            />

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                  <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="Enter your new password"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <PasswordInput
                          placeholder="Confirm your new password"
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
