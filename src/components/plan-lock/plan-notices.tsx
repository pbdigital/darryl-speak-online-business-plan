'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { PartyPopper, X } from 'lucide-react';
import { CURRENT_PLAN_YEAR } from '@/lib/constants';
import { FREE_ACCESS_DAYS, joinUrl } from '@/config/power-agent-offer';

// Placeholder copy: DDS will sign off the final wording.

/** Quiet line in the plan header for free users. */
export function FreeAccessLine({ signedUpAt }: { signedUpAt: string; email?: string }) {
  const until = new Date(new Date(signedUpAt).getTime() + FREE_ACCESS_DAYS * 24 * 60 * 60 * 1000);
  const untilLabel = until.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC', // same on server and browser, so hydration matches
  });

  return (
    <div className="bg-[#0F172A] px-6 pt-4 text-center text-sm text-slate-400 md:px-12">
      Free online access until {untilLabel}.{' '}
      <a
        href={joinUrl({ placement: 'header' })}
        target="_blank"
        rel="noopener noreferrer"
        className="text-slate-200 underline underline-offset-2 hover:text-white"
      >
        Keep it with POWER AGENT®
      </a>
    </div>
  );
}

function Banner({ children, onDismiss }: { children: React.ReactNode; onDismiss: () => void }) {
  return (
    <div
      role="status"
      className="mb-6 flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex-1 text-slate-700">{children}</div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

const noopSubscribe = () => () => {};

function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** Members whose plan was brought forward from last year, until they dismiss it. */
export function BroughtForwardBanner({ userId }: { userId: string }) {
  const storageKey = `myplanforsuccess:brought-forward-dismissed:${CURRENT_PLAN_YEAR}:${userId}`;
  const [dismissedNow, setDismissedNow] = useState(false);
  // Hidden on the server; read from storage in the browser.
  const dismissedBefore = useSyncExternalStore(
    noopSubscribe,
    () => readStorage(storageKey) === '1',
    () => true
  );
  const visible = !dismissedNow && !dismissedBefore;

  if (!visible) return null;

  return (
    <Banner
      onDismiss={() => {
        setDismissedNow(true);
        try {
          localStorage.setItem(storageKey, '1');
        } catch {
          // Storage unavailable: it stays hidden for this visit only.
        }
      }}
    >
      We&apos;ve brought your {CURRENT_PLAN_YEAR - 1} plan forward. Review each section
      and update your numbers for {CURRENT_PLAN_YEAR}.
    </Banner>
  );
}

/** One-time welcome after a free user becomes a POWER AGENT (?welcome=power-agent). */
export function JoinedBanner() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Strip the param so a refresh or bookmark doesn't show it again.
    const url = new URL(window.location.href);
    url.searchParams.delete('welcome');
    window.history.replaceState(window.history.state, '', url.toString());
  }, []);

  if (!visible) return null;

  return (
    <Banner onDismiss={() => setVisible(false)}>
      <span className="flex items-center gap-2 font-semibold text-slate-900">
        <PartyPopper className="h-5 w-5 text-amber-500" />
        Welcome to POWER AGENT®. Your plan is yours for the year.
      </span>
    </Banner>
  );
}
