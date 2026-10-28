'use client';

import { Button } from '@/components/ui/button';
import {
  AuthHeader,
  AuthFooter,
  AuthDivider,
  SsoButton,
} from '@/components/auth/ui';

interface InitialScreenProps {
  onPowerAgentSso?: () => void;
  onSignup: () => void;
  onEmailLogin: () => void;
  externalError?: string | null;
  onClearError?: () => void;
}

export function InitialScreen({
  onPowerAgentSso,
  onSignup,
  onEmailLogin,
  externalError,
  onClearError,
}: InitialScreenProps) {
  const error = externalError;
  const clearError = () => onClearError?.();

  return (
    <div className="space-y-8">
      <AuthHeader
        title="Your business plan"
        subtitle="Plan your year, step by step"
      />

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-100">
          {error}
        </div>
      )}

      {/* SSO Button */}
      <div className="space-y-3">
        <p className="text-center text-sm font-medium text-gray-700">
          POWER AGENT® members
        </p>
        <SsoButton
          provider="power-agent"
          onClick={() => {
            clearError();
            onPowerAgentSso?.();
          }}
          disabled={!onPowerAgentSso}
        />
      </div>

      <AuthDivider text="Not a member?" />

      {/* Free plan */}
      <div className="space-y-3">
        <Button
          type="button"
          size="xl"
          className="w-full"
          onClick={() => {
            clearError();
            onSignup();
          }}
        >
          Start your free plan
        </Button>
        <p className="text-center text-sm text-gray-500">
          Free for any real estate agent.
        </p>
        <p className="text-center text-sm text-gray-600">
          Already started one?{' '}
          <button
            type="button"
            onClick={() => {
              clearError();
              onEmailLogin();
            }}
            className="font-medium text-gray-900 hover:underline"
          >
            Log in with email
          </button>
        </p>
      </div>

      <AuthFooter className="pt-6" />
    </div>
  );
}
