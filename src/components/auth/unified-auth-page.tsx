'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { InitialScreen } from './screens';

export function UnifiedAuthPage() {
  const searchParams = useSearchParams();

  const [error, setError] = useState<string | null>(null);

  // Check for error parameter from SSO callback
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setError(decodeURIComponent(errorParam));
      // Clear the error from URL without triggering a navigation
      window.history.replaceState({}, '', '/login');
    }
  }, [searchParams]);

  const clearError = () => setError(null);

  const handlePowerAgentSso = () => {
    const ssoUrl = process.env.NEXT_PUBLIC_POWER_AGENT_SSO_URL;

    if (!ssoUrl) {
      setError('POWER AGENT® SSO is not configured.');
      return;
    }

    const redirectUri = `${window.location.origin}/api/auth/callback/power-agent`;
    window.location.href = `${ssoUrl}?redirect_uri=${encodeURIComponent(redirectUri)}`;
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-[420px]">
        {/* Logo above card */}
        <div className="flex justify-center mb-8">
          <Image
            src="/logo.svg"
            alt="MyPlanForSuccess"
            width={180}
            height={40}
            priority
          />
        </div>

        <div className="rounded-2xl bg-white px-10 py-10 shadow-sm border border-gray-100">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <InitialScreen
              onPowerAgentSso={handlePowerAgentSso}
              externalError={error}
              onClearError={clearError}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
