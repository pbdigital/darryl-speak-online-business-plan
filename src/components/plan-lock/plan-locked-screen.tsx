'use client';

import { useSyncExternalStore } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Check, Lock } from 'lucide-react';
import { LogoutButton } from '@/app/(dashboard)/plan/logout-button';
import { useHydrateAllStores } from '@/hooks/use-hydrate-all-stores';
import { useSectionProgress } from '@/hooks/use-section-progress';
import { useBusinessPlanStore } from '@/stores/business-plan-store';
import {
  FREE_ACCESS_DAYS,
  MEMBER_BENEFITS,
  TESTIMONIALS,
  joinUrl,
} from '@/config/power-agent-offer';

interface PlanLockedScreenProps {
  email: string;
  firstName: string | null;
}

const money = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);

const noopSubscribe = () => () => {};

const whole = (value: number) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value);

// Placeholder copy: DDS will sign off the final wording.
export function PlanLockedScreen({ firstName }: PlanLockedScreenProps) {
  // Store values differ between server and browser, so show them after mount.
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );

  useHydrateAllStores();
  const { completedSections, totalSections } = useSectionProgress();
  const calculated = useBusinessPlanStore((state) => state.calculated);
  const workDaysPerWeek = useBusinessPlanStore(
    (state) => state.incomePlanning.workDaysPerWeek
  );

  const hasNumbers =
    mounted &&
    calculated.targetTakeHomeIncome > 0 &&
    calculated.totalTransactionsNeeded > 0;
  const conversationsPerWeek = calculated.dailyConversations * (workDaysPerWeek || 5);

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      <section className="bg-[#0F172A] px-6 pb-32 pt-12 text-white md:px-12">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Image src="/logo-white.svg" alt="Darryl Davis Seminars" width={140} height={40} />
          <div className="text-slate-900">
            <LogoutButton />
          </div>
        </div>
      </section>

      <main className="relative z-10 mx-auto -mt-20 w-full max-w-3xl space-y-6 px-6 pb-20 md:px-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:p-12">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
            <Lock className="h-6 w-6 text-slate-700" />
          </div>

          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
            {firstName ? `${firstName}, your plan is saved` : 'Your plan is saved'}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Your {FREE_ACCESS_DAYS} days of free online access have ended, so your
            plan can no longer be edited. Everything you wrote is safe, and you can
            view and print it any time.
          </p>

          {mounted && completedSections > 0 && (
            <p className="mt-4 text-base font-medium text-slate-900">
              You finished {completedSections} of {totalSections} sections. That&apos;s
              real work.
            </p>
          )}

          {hasNumbers && (
            <div className="mt-8">
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                The plan you set for your next 12 months
              </p>
              <dl className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-4">
                  <dt className="text-sm text-slate-600">Take-home income goal</dt>
                  <dd className="mt-1 text-2xl font-bold text-slate-900">
                    {money(calculated.targetTakeHomeIncome)}
                  </dd>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <dt className="text-sm text-slate-600">Transactions to get there</dt>
                  <dd className="mt-1 text-2xl font-bold text-slate-900">
                    {whole(calculated.totalTransactionsNeeded)}
                  </dd>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <dt className="text-sm text-slate-600">Conversations a week</dt>
                  <dd className="mt-1 text-2xl font-bold text-slate-900">
                    {whole(Math.ceil(conversationsPerWeek))}
                  </dd>
                </div>
              </dl>
            </div>
          )}

          <h2 className="mt-10 text-xl font-bold text-slate-900">
            {hasNumbers
              ? 'Become a POWER AGENT® to keep your plan and get help hitting these numbers'
              : 'Become a POWER AGENT® to keep your plan and get help hitting it'}
          </h2>
          <ul className="mt-4 space-y-3">
            {MEMBER_BENEFITS.map((benefit) => (
              <li key={benefit.title} className="flex gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <span className="text-slate-600">
                  <span className="font-semibold text-slate-900">{benefit.title}.</span>{' '}
                  {benefit.detail}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={joinUrl({ placement: 'lock-screen' })}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-[#0F172A] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
            >
              Become a POWER AGENT®
            </a>
            <Link
              href="/plan/print"
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50"
            >
              View and print your plan
            </Link>
          </div>
        </div>

        {TESTIMONIALS.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {TESTIMONIALS.map((testimonial) => (
              <figure
                key={testimonial.name}
                className="rounded-2xl border border-slate-200 bg-white p-6"
              >
                <blockquote className="text-slate-700">“{testimonial.quote}”</blockquote>
                <figcaption className="mt-3 text-sm text-slate-500">
                  <span className="font-semibold text-slate-900">{testimonial.name}</span>
                  {testimonial.detail && `, ${testimonial.detail}`}
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
