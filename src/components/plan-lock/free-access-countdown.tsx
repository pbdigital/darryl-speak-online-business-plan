'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Clock, Printer } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { joinUrl } from '@/config/power-agent-offer';
import {
  countdownSeenKey,
  freeAccessEndsAt,
  freeDaysLeft,
  inCountdown,
} from '@/lib/free-access';

interface FreeAccessCountdownProps {
  userId: string;
  signedUpAt: string;
}

function alreadySeen(key: string): boolean {
  try {
    return localStorage.getItem(key) === '1';
  } catch {
    return false;
  }
}

function markSeen(key: string) {
  try {
    localStorage.setItem(key, '1');
  } catch {
    // Storage unavailable: it may show again on the next visit today.
  }
}

/**
 * Placeholder copy: DDS will sign off the final wording.
 *
 * In the last 7 calendar days of free online access, a free user sees this
 * once a day (their own calendar day, per browser) when they open their plan: how many days are left and a link to keep it
 * with POWER AGENT. Not on the print page or in admin.
 */
export function FreeAccessCountdown({ userId, signedUpAt }: FreeAccessCountdownProps) {
  const pathname = usePathname();
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  const onPlanPage =
    (pathname === '/plan' || pathname.startsWith('/plan/')) &&
    !pathname.startsWith('/plan/print');

  useEffect(() => {
    if (!onPlanPage) return;
    const now = new Date();
    if (!inCountdown(signedUpAt, now)) return;
    const left = freeDaysLeft(signedUpAt, now);
    const key = countdownSeenKey(userId, now);
    if (alreadySeen(key)) return;
    markSeen(key);
    // The date and browser storage only exist after mount, so this runs once
    // there rather than during render (which would differ from the server).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDaysLeft(left);
    setOpen(true);
  }, [onPlanPage, signedUpAt, userId]);

  if (daysLeft === null) return null;

  const endsOn = freeAccessEndsAt(signedUpAt).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  const title =
    daysLeft === 1
      ? 'Last day of your free online plan'
      : `${daysLeft} days left of your free online plan`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            <Clock className="h-6 w-6" aria-hidden="true" />
          </div>
          <DialogTitle className="text-xl text-slate-900">{title}</DialogTitle>
          <DialogDescription className="text-base text-slate-600">
            Your free online access ends{' '}
            {daysLeft === 1 ? 'today' : daysLeft === 2 ? `tomorrow, ${endsOn}` : `on ${endsOn}`}.
            After that your plan is read-only, and
            your printed copy is yours to keep. Join POWER AGENT® to keep working on
            your plan online all year, with coaching from Darryl every week.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col gap-2 sm:flex-col sm:space-x-0">
          <a
            href={joinUrl({ placement: `countdown-${daysLeft}` })}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="inline-flex h-11 w-full items-center justify-center rounded-md bg-[#28afb0] px-5 text-sm font-semibold text-white hover:bg-[#28afb0]/90"
          >
            Keep my plan with POWER AGENT®
          </a>
          <Link
            href="/plan/print"
            onClick={() => setOpen(false)}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-slate-200 px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Printer className="h-4 w-4" aria-hidden="true" />
            Print my plan
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="h-10 w-full text-sm text-slate-500 hover:text-slate-800"
          >
            Not now
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
