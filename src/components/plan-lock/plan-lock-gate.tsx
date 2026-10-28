'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { PLAN_LOCKED_EVENT } from '@/lib/api';
import { PlanLockedScreen } from './plan-locked-screen';

interface PlanLockGateProps {
  locked: boolean;
  children: React.ReactNode;
}

/**
 * Shows the locked screen instead of any plan editing page while the user's
 * plan is locked. The print page stays reachable. Also switches to the locked
 * screen if the server refuses a save because the plan was locked mid-session.
 */
export function PlanLockGate({ locked, children }: PlanLockGateProps) {
  const pathname = usePathname();
  const [lockedLive, setLockedLive] = useState(false);

  useEffect(() => {
    const onLocked = () => setLockedLive(true);
    window.addEventListener(PLAN_LOCKED_EVENT, onLocked);
    return () => window.removeEventListener(PLAN_LOCKED_EVENT, onLocked);
  }, []);

  const isEditPath =
    (pathname === '/plan' || pathname.startsWith('/plan/')) &&
    !pathname.startsWith('/plan/print');

  if ((locked || lockedLive) && isEditPath) {
    return <PlanLockedScreen />;
  }

  return <>{children}</>;
}
