'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { InitialScreen, LoginScreen, SignupScreen } from './screens';

type Screen = 'initial' | 'signup' | 'login';

export function UnifiedAuthPage() {
  const searchParams = useSearchParams();

  // Error passed back by the SSO callback or an expired email link
  const [error, setError] = useState<string | null>(() => {
    const errorParam = searchParams.get('error');
    return errorParam ? decodeURIComponent(errorParam) : null;
  });
  const [screen, setScreen] = useState<Screen>(
    searchParams.get('mode') === 'signup' ? 'signup' : 'initial'
  );

  // Clear the error from the URL without triggering a navigation
  useEffect(() => {
    if (searchParams.get('error')) {
      window.history.replaceState({}, '', '/login');
    }
  }, [searchParams]);

  const clearError = () => setError(null);

  const handlePowerAgentSso = () => {
    const ssoUrl = process.env.NEXT_PUBLIC_POWER_AGENT_SSO_URL;

    if (!ssoUrl) {
      setError('POWER AGENT® SSO is not configured.');
      setScreen('initial');
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

        <div className="rounded-2xl bg-white px-6 py-10 sm:px-10 shadow-sm border border-gray-100">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            {screen === 'signup' && (
              <SignupScreen
                onBack={() => setScreen('initial')}
                onPowerAgentSso={handlePowerAgentSso}
              />
            )}
            {screen === 'login' && (
              <LoginScreen onBack={() => setScreen('initial')} />
            )}
            {screen === 'initial' && (
              <InitialScreen
                onPowerAgentSso={handlePowerAgentSso}
                onSignup={() => setScreen('signup')}
                onEmailLogin={() => setScreen('login')}
                externalError={error}
                onClearError={clearError}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
