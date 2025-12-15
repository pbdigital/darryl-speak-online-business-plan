'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { InitialScreen, LoginScreen, SignupScreen } from './screens';

type AuthScreen = 'initial' | 'login' | 'signup';

interface AuthState {
  screen: AuthScreen;
  email: string;
  error: string | null;
}

export function UnifiedAuthPage() {
  const searchParams = useSearchParams();

  const [state, setState] = useState<AuthState>({
    screen: 'initial',
    email: '',
    error: null,
  });

  // Check for error parameter from SSO callback
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      setState((prev) => ({
        ...prev,
        error: decodeURIComponent(errorParam),
      }));
      // Clear the error from URL without triggering a navigation
      window.history.replaceState({}, '', '/login');
    }
  }, [searchParams]);

  const goToLogin = (email: string) =>
    setState({ screen: 'login', email, error: null });

  const goToSignup = (email: string) =>
    setState({ screen: 'signup', email, error: null });

  const goToInitial = () =>
    setState({ screen: 'initial', email: '', error: null });

  const clearError = () =>
    setState((prev) => ({ ...prev, error: null }));

  const handlePowerAgentSso = () => {
    const ssoUrl = process.env.NEXT_PUBLIC_POWER_AGENT_SSO_URL;

    if (!ssoUrl) {
      setState((prev) => ({
        ...prev,
        error: 'Power Agent SSO is not configured.',
      }));
      return;
    }

    const redirectUri = `${window.location.origin}/api/auth/callback/power-agent`;
    window.location.href = `${ssoUrl}?redirect_uri=${encodeURIComponent(redirectUri)}`;
  };

  const renderScreen = () => {
    switch (state.screen) {
      case 'login':
        return <LoginScreen email={state.email} onBack={goToInitial} />;
      case 'signup':
        return <SignupScreen email={state.email} onBack={goToInitial} />;
      default:
        return (
          <InitialScreen
            onLoginRoute={goToLogin}
            onSignupRoute={goToSignup}
            onPowerAgentSso={handlePowerAgentSso}
            externalError={state.error}
            onClearError={clearError}
          />
        );
    }
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
          <div
            key={state.screen}
            className="animate-in fade-in slide-in-from-bottom-4 duration-300"
          >
            {renderScreen()}
          </div>
        </div>
      </div>
    </div>
  );
}
