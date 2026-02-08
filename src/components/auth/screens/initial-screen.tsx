'use client';

import { useState, useEffect } from 'react';
import {
  AuthHeader,
  AuthFooter,
  SsoButton,
} from '@/components/auth/ui';

interface InitialScreenProps {
  onPowerAgentSso?: () => void;
  externalError?: string | null;
  onClearError?: () => void;
}

export function InitialScreen({
  onPowerAgentSso,
  externalError,
  onClearError,
}: InitialScreenProps) {
  const [error, setError] = useState<string | null>(null);

  // Sync external error with local state
  useEffect(() => {
    if (externalError) {
      setError(externalError);
    }
  }, [externalError]);

  return (
    <div className="space-y-8">
      <AuthHeader title="Log in" />

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-100">
          {error}
        </div>
      )}

      {/* SSO Button */}
      <div className="space-y-3">
        <SsoButton
          provider="power-agent"
          onClick={() => {
            setError(null);
            onClearError?.();
            onPowerAgentSso?.();
          }}
          disabled={!onPowerAgentSso}
        />
      </div>

      <AuthFooter className="pt-6" />
    </div>
  );
}
