'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { CURRENT_PLAN_YEAR } from '@/lib/constants';
import { parseUtm, readCookie, UTM_COOKIE } from '@/lib/utm';
import { newMetaEventId, readMetaBrowserIds, trackMetaEvent } from '@/lib/meta-pixel';
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
import { AuthHeader, PasswordInput } from '@/components/auth/ui';
import {
  signupSchema,
  getAuthErrorMessage,
  type SignupFormValues,
} from '@/components/auth/schemas/auth-schemas';

const PRIVACY_URL =
  process.env.NEXT_PUBLIC_PRIVACY_URL || 'https://darrylspeaks.com/privacy-policy/';

const BENEFITS = [
  "Darryl's step-by-step plan",
  'Your numbers worked out for you',
  'Print it any time, and keep your copy',
  'No credit card needed',
];

// TODO: paste Sarah's exact "What happens after 30 days?" text from her 19 Nov email - Claude 20 Nov
const AFTER_30_DAYS_COPY = '[[COPY: after-30-days answer]]';

const TERMS_URL = 'https://darrylspeaks.com/terms-of-service';

interface SignupScreenProps {
  email?: string;
  onBack: () => void;
  onPowerAgentSso?: () => void;
}

export function SignupScreen({ email = '', onBack, onPowerAgentSso }: SignupScreenProps) {
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
    },
  });

  async function onSubmit(data: SignupFormValues) {
    setIsLoading(true);
    setError(null);

    const supabase = createClient();
    // Shared by the browser pixel event below and the server event sent at
    // email confirmation, so Meta counts the sign-up once.
    const metaEventId = newMetaEventId();

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/confirm?next=/plan`,
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
          ...parseUtm(readCookie(document.cookie, UTM_COOKIE)),
          ...readMetaBrowserIds(document.cookie),
          meta_event_id: metaEventId,
        },
      },
    });

    if (signUpError) {
      setError(getAuthErrorMessage(signUpError.message));
      setIsLoading(false);
      return;
    }

    // An email that already has an account comes back with no identities:
    // not a new sign-up, so it isn't reported to Meta.
    if (signUpData.user?.identities?.length) {
      trackMetaEvent('CompleteRegistration', metaEventId);
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
      <div className="space-y-4">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="-ml-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          onClick={onBack}
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </Button>
        <div className="space-y-2">
          <p className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
            Free for 30 days
          </p>
          <h1 className="text-balance text-2xl font-semibold tracking-tight text-gray-900">
            Build your {CURRENT_PLAN_YEAR} business plan with Darryl
          </h1>
        </div>
      </div>

      <ul className="space-y-2">
        {BENEFITS.map((benefit) => (
          <li key={benefit} className="flex items-center gap-3 text-sm text-gray-700">
            <Check className="h-4 w-4 shrink-0 text-green-600" aria-hidden="true" />
            {benefit}
          </li>
        ))}
      </ul>

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

          <div className="grid grid-cols-2 gap-3">
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
          </div>

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">Create a password</FormLabel>
                <FormControl>
                  <PasswordInput
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                    className="h-12 text-base"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" size="xl" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating your plan...' : 'Start My Free Plan'}
          </Button>

          <p className="text-center text-xs text-gray-500">
            By starting your plan, you agree to the{' '}
            <a
              href={TERMS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-700"
            >
              Terms
            </a>{' '}
            and{' '}
            <a
              href={PRIVACY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-700"
            >
              Privacy Policy
            </a>
            . We&apos;ll email you tips to put your plan to work, and you can unsubscribe any
            time.
          </p>
        </form>
      </Form>

      <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
        <p className="font-medium text-gray-900">What happens after 30 days?</p>
        <p className="mt-1">{AFTER_30_DAYS_COPY}</p>
      </div>

      {onPowerAgentSso && (
        <p className="text-center text-sm text-gray-600">
          Already a POWER AGENT®?{' '}
          <button
            type="button"
            onClick={onPowerAgentSso}
            className="font-medium text-gray-900 hover:underline"
          >
            Sign in here
          </button>
        </p>
      )}
    </div>
  );
}
