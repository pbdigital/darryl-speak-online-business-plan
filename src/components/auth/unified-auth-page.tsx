'use client';

import { useState } from 'react';
import { InitialScreen, LoginScreen, SignupScreen } from './screens';

type AuthScreen = 'initial' | 'login' | 'signup';

interface AuthState {
  screen: AuthScreen;
  email: string;
}

export function UnifiedAuthPage() {
  const [state, setState] = useState<AuthState>({
    screen: 'initial',
    email: '',
  });

  const goToLogin = (email: string) =>
    setState({ screen: 'login', email });

  const goToSignup = (email: string) =>
    setState({ screen: 'signup', email });

  const goToInitial = () =>
    setState({ screen: 'initial', email: '' });

  const renderScreen = () => {
    switch (state.screen) {
      case 'login':
        return <LoginScreen email={state.email} onBack={goToInitial} />;
      case 'signup':
        return <SignupScreen email={state.email} onBack={goToInitial} />;
      default:
        return (
          <InitialScreen onLoginRoute={goToLogin} onSignupRoute={goToSignup} />
        );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary p-4">
      <div className="w-full max-w-md">
        <div className="rounded-xl bg-white p-8 shadow-lg">
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
