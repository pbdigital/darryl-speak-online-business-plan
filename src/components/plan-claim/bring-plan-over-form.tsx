'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const GENERIC_ERROR = 'Something went wrong. Please try again.';

async function post(path: string, body: object): Promise<{ ok: boolean; message?: string; redirect?: string }> {
  try {
    const response = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return await response.json();
  } catch {
    return { ok: false, message: GENERIC_ERROR };
  }
}

/** Email, then code. On success the browser is signed in to the free plan's account. */
export function BringPlanOverForm() {
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendCode(event?: React.FormEvent) {
    event?.preventDefault();
    setBusy(true);
    setError(null);
    const result = await post('/api/auth/claim-plan/send', { email });
    setBusy(false);
    if (!result.ok) {
      setError(result.message ?? GENERIC_ERROR);
      return;
    }
    setCode('');
    setStep('code');
  }

  async function checkCode(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    const result = await post('/api/auth/claim-plan/verify', { code });
    if (!result.ok) {
      setBusy(false);
      setError(result.message ?? GENERIC_ERROR);
      return;
    }
    window.location.assign(result.redirect ?? '/plan');
  }

  const errorBox = error && (
    <div role="alert" className="rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-600">
      {error}
    </div>
  );

  if (step === 'email') {
    return (
      <form onSubmit={sendCode} className="space-y-5">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-slate-900">Bring over your free plan</h1>
          <p className="text-base leading-relaxed text-slate-600">
            Enter the email you used for your free plan. We&apos;ll send a 6-digit code to that
            inbox so we know it&apos;s you.
          </p>
        </div>
        {errorBox}
        <div className="space-y-2">
          <Label htmlFor="claim-email">Email for your free plan</Label>
          <Input
            id="claim-email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            className="h-12 text-base"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <Button type="submit" size="xl" className="w-full" disabled={busy}>
          {busy ? 'Sending...' : 'Send my code'}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={checkCode} className="space-y-5">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">Check your email</h1>
        <p className="text-base leading-relaxed text-slate-600">
          If there&apos;s a free plan under <span className="font-medium text-slate-900">{email}</span>,
          a 6-digit code is on its way. It works for 10 minutes.
        </p>
      </div>
      {errorBox}
      <div className="space-y-2">
        <Label htmlFor="claim-code">6-digit code</Label>
        <Input
          id="claim-code"
          inputMode="numeric"
          autoComplete="one-time-code"
          required
          maxLength={7}
          placeholder="123456"
          className="h-12 text-center text-xl tracking-[0.4em]"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>
      <Button type="submit" size="xl" className="w-full" disabled={busy}>
        {busy ? 'Bringing it over...' : 'Bring my plan over'}
      </Button>
      <p className="text-center text-sm text-slate-500">
        Didn&apos;t get it? Check your spam folder, or{' '}
        <button type="button" onClick={() => sendCode()} disabled={busy} className="underline hover:text-slate-800">
          send a new code
        </button>{' '}
        or{' '}
        <button
          type="button"
          onClick={() => {
            setError(null);
            setStep('email');
          }}
          disabled={busy}
          className="underline hover:text-slate-800"
        >
          try a different email
        </button>
        .
      </p>
    </form>
  );
}
