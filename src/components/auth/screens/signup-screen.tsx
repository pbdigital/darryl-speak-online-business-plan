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
  email: string;
  onBack: () => void;
  onSuccess?: () => void;
}

export function SignupScreen({ email, onBack, onSuccess }: SignupScreenProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

    const { error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
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

    if (onSuccess) {
      onSuccess();
    } else {
      router.push('/plan');
      router.refresh();
    }
  }

  return (
    <div className="space-y-8">
      <AuthHeader title="Sign up for free" showBackButton onBack={onBack} />

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
                    readOnly
                    className="h-12 text-base bg-gray-50 text-gray-500"
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
            {isLoading ? 'Creating account...' : 'Agree and sign up'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
