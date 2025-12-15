'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
  loginSchema,
  getAuthErrorMessage,
  type LoginFormValues,
} from '@/components/auth/schemas/auth-schemas';

interface LoginScreenProps {
  email: string;
  onBack: () => void;
  onSuccess?: () => void;
}

export function LoginScreen({ email, onBack, onSuccess }: LoginScreenProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email,
      password: '',
      rememberMe: false,
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    setError(null);

    const supabase = createClient();

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (signInError) {
      setError(getAuthErrorMessage(signInError.message));
      setIsLoading(false);
      return;
    }

    if (onSuccess) {
      onSuccess();
    } else {
      router.push('/plan');
      router.refresh();
    }
  }

  async function handleForgotPassword() {
    setIsLoading(true);
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setIsLoading(false);

    if (error) {
      setError('Unable to send reset email. Please try again.');
      return;
    }

    setResetEmailSent(true);
  }

  return (
    <div className="space-y-8">
      <AuthHeader
        title="Welcome back"
        subtitle={`Log in using ${email}`}
        showBackButton
        onBack={onBack}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-100">
              {error}
            </div>
          )}

          {resetEmailSent && (
            <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700 border border-green-100">
              Check your email for a password reset link.
            </div>
          )}

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="h-12 text-base"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={isLoading}
              className="text-sm text-gray-600 hover:text-gray-900 hover:underline disabled:opacity-50 transition-colors"
            >
              Forgotten your password?
            </button>
          </div>

          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal cursor-pointer text-gray-600">
                  Remember me
                </FormLabel>
              </FormItem>
            )}
          />

          <Button type="submit" size="xl" className="w-full" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Log in'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
