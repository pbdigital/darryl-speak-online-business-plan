'use client';

import { useState } from 'react';
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
  onSignupRoute: (email: string) => void;
  onPowerAgentSso?: () => void;
}

export function InitialScreen({
  onLoginRoute,
  onSignupRoute,
  onPowerAgentSso,
}: InitialScreenProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(data: EmailFormValues) {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      });

      const result = await response.json();

      if (result.success) {
        if (result.data.exists) {
          onLoginRoute(data.email);
        } else {
          onSignupRoute(data.email);
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
    <div className="space-y-6">
      <AuthHeader title="Log in or sign up" />

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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Checking...' : 'Continue'}
          </Button>
        </form>
      </Form>

      <AuthFooter className="pt-4" />
    </div>
  );
}
