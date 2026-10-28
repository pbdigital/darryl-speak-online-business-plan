'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  signupSchema,
  getAuthErrorMessage,
  type SignupFormValues,
} from '@/components/auth/schemas/auth-schemas';

interface SignupScreenProps {
  email?: string;
  onBack: () => void;
}

export function SignupScreen({ email = '', onBack }: SignupScreenProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email,
      firstName: '',
      lastName: '',
      password: '',
      agreeToTerms: false as unknown as true,
    },
  });

  async function onSubmit(data: SignupFormValues) {
    setIsLoading(true);
    setError(null);

    const supabase = createClient();

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/confirm?next=/plan`,
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
        },
      },
    });

    if (signUpError) {
      setError(getAuthErrorMessage(signUpError.message));
      setIsLoading(false);
      return;
    }

    // With email confirmation on there is no session yet. Supabase answers
    // the same way whether or not the email already has an account, so this
    // screen never reveals who has signed up.
    if (!signUpData.session) {
      setSentTo(data.email);
      setIsLoading(false);
      return;
    }

    router.push('/plan');
    router.refresh();
  }

  if (sentTo) {
    return (
      <div className="space-y-6">
        <AuthHeader title="Check your email" showBackButton onBack={onBack} />
        <div className="space-y-3 text-center text-sm text-gray-600">
          <p>
            We sent a link to <span className="font-medium text-gray-900">{sentTo}</span>.
            Click it to confirm your email and open your plan.
          </p>
          <p>
            Nothing there after a few minutes? Check your spam folder. If you have
            signed up before, go back and log in with email instead.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AuthHeader
        title="Start your free plan"
        subtitle="Free for any real estate agent. You can start straight after confirming your email."
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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">First name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John"
                    autoComplete="given-name"
                    className="h-12 text-base"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Last name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Doe"
                    autoComplete="family-name"
                    className="h-12 text-base"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="Create a password (min 6 characters)"
                    autoComplete="new-password"
                    className="h-12 text-base"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="agreeToTerms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div>
                  <FormLabel className="text-sm font-normal cursor-pointer text-gray-600">
                    I agree to the{' '}
                    <a
                      href="https://darrylspeaks.com/terms-of-service"
                      className="text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Terms
                    </a>{' '}
                    and{' '}
                    <a
                      href="https://darrylspeaks.com/privacy-policy"
                      className="text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Privacy Policy
                    </a>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <Button type="submit" size="xl" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating your plan...' : 'Agree and start my plan'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
