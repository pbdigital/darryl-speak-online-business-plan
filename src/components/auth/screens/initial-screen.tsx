'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  AuthHeader,
  AuthFooter,
  AuthDivider,
  SsoButton,
} from '@/components/auth/ui';
import {
  emailSchema,
  type EmailFormValues,
} from '@/components/auth/schemas/auth-schemas';

interface InitialScreenProps {
  onLoginRoute: (email: string) => void;
  onPowerAgentSso?: () => void;
  externalError?: string | null;
  onClearError?: () => void;
}

export function InitialScreen({
  onLoginRoute,
  onPowerAgentSso,
  externalError,
  onClearError,
}: InitialScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync external error with local state
  useEffect(() => {
    if (externalError) {
      setError(externalError);
    }
  }, [externalError]);

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });

  const clearError = () => {
    setError(null);
    onClearError?.();
  };

  async function onSubmit(data: EmailFormValues) {
    setIsLoading(true);
    clearError();

    try {
      const response = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      });

      const result = await response.json();

      if (result.success) {
        // If user created their account via Power Agent SSO, they must use SSO to login
        if (result.data.exists && result.data.isPowerAgentLinked) {
          setError(
            'This account was created with POWER AGENT®. Please use the "Continue with POWER AGENT®" button above to sign in.'
          );
          return;
        }

        if (result.data.exists) {
          onLoginRoute(data.email);
        } else {
          setError(
            'This platform is exclusive to Power Agents. Please use the "Continue with POWER AGENT®" button above to sign in.'
          );
          return;
        }
      } else {
        setError(result.errors?.[0]?.message || 'An error occurred');
      }
    } catch {
      setError('Unable to continue. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <AuthHeader title="Log in" />

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-100">
          {error}
        </div>
      )}

      {/* SSO Buttons */}
      <div className="space-y-3">
        <SsoButton
          provider="power-agent"
          onClick={onPowerAgentSso}
          disabled={!onPowerAgentSso}
        />
      </div>

      <AuthDivider />

      {/* Email Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="h-12 text-base"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      clearError();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" size="xl" className="w-full" disabled={isLoading}>
            {isLoading ? 'Checking...' : 'Continue'}
          </Button>
        </form>
      </Form>

      <AuthFooter className="pt-6" />
    </div>
  );
}
