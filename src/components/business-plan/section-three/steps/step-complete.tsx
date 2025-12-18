"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Trophy,
  DollarSign,
  Target,
  Phone,
  ListChecks,
} from "lucide-react";
import { useBusinessPlanStore } from "@/stores/business-plan-store";
import { StepContainer } from "@/components/business-plan/ui";
import { CURRENT_PLAN_YEAR } from "@/lib/constants";

interface StepCompleteProps {
  startTime?: number;
}

export function StepComplete({ startTime }: StepCompleteProps) {
  const [showReveal, setShowReveal] = useState(true);
  const [revealPhase, setRevealPhase] = useState(0);

  const { calculated, incomePlanning } = useBusinessPlanStore();

  const hasCap = (incomePlanning.brokerCapAmount || 0) > 0;
  const finalGci = hasCap ? calculated.adjustedGciNeeded : calculated.gciNeeded;

  // Calculate time spent
  const timeSpent = startTime
    ? Math.round((Date.now() - startTime) / 1000 / 60)
    : 0;

  // Elegant reveal sequence
  useEffect(() => {
    const timers = [
      setTimeout(() => setRevealPhase(1), 300),
      setTimeout(() => setRevealPhase(2), 800),
      setTimeout(() => setRevealPhase(3), 1300),
      setTimeout(() => setShowReveal(false), 2200),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  if (showReveal) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-gradient-to-b from-[#e8f4f8]/30 via-white to-white px-4">
        <div
          className={`mb-6 transition-all duration-500 ${
            revealPhase >= 1
              ? "scale-100 opacity-100"
              : "scale-75 opacity-0"
          }`}
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#1a2744]">
            {revealPhase >= 2 ? (
              <svg
                className="h-10 w-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  className="animate-draw-check"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                  style={{
                    strokeDasharray: 24,
                    strokeDashoffset: 24,
                  }}
                />
              </svg>
            ) : (
              <div className="h-10 w-10" />
            )}
          </div>
        </div>

        <h2
          className={`text-center text-2xl font-bold text-slate-900 transition-all duration-500 ${
            revealPhase >= 3
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0"
          }`}
        >
          Section Complete
        </h2>
      </div>
    );
  }

  return (
    <StepContainer>
      {/* Header */}
      <header className="relative mb-10">
        <div className="absolute -right-4 top-0 hidden opacity-10 md:right-0 md:block">
          <Trophy className="h-32 w-32 text-[#1a2744]" strokeWidth={1} />
        </div>

        <div className="relative z-10 mb-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#1a2744] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
            Complete
          </span>
        </div>

        <h1 className="relative z-10 mb-3 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
          Section{" "}
          <span className="relative">
            <span className="relative z-10">Complete</span>
            <span className="absolute bottom-1 left-0 -z-0 h-3 w-full bg-[#e8f4f8]" />
          </span>
        </h1>

        <p className="relative z-10 max-w-lg text-lg text-slate-600">
          You&apos;ve mapped out your entire income plan for {CURRENT_PLAN_YEAR}. Now it&apos;s time to make it happen.
        </p>
      </header>

      {/* Summary Card */}
      <div className="mb-10 overflow-hidden rounded-3xl border-2 border-slate-100 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-[#e8f4f8]/30 px-8 py-5">
          <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#1a2744]">
            <Trophy className="h-4 w-4" /> Your Income Plan Summary
          </h3>
        </div>
        <div className="grid gap-6 p-8 md:grid-cols-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f4f8]">
              <DollarSign className="h-5 w-5 text-[#1a2744]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(finalGci)}
              </div>
              <div className="text-xs text-slate-500">GCI Goal</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f4f8]">
              <Clock className="h-5 w-5 text-[#1a2744]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">
                {timeSpent > 0 ? `~${timeSpent}` : "—"}
              </div>
              <div className="text-xs text-slate-500">Minutes Invested</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f4f8]">
              <CheckCircle2 className="h-5 w-5 text-[#1a2744]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">3 of 5</div>
              <div className="text-xs text-slate-500">Sections Complete</div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <section className="mb-10">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f4f8]">
            <Target className="h-5 w-5 text-[#1a2744]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Your Key Numbers</h2>
            <p className="text-sm text-slate-500">The metrics that will drive your success</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border-2 border-slate-100 bg-white p-6 text-center">
            <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f4f8]">
              <DollarSign className="h-5 w-5 text-[#1a2744]" />
            </div>
            <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
              GCI Goal
            </p>
            <p className="text-2xl font-extrabold text-[#1a2744]">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(finalGci)}
            </p>
          </div>
          <div className="rounded-2xl border-2 border-slate-100 bg-white p-6 text-center">
            <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f4f8]">
              <Target className="h-5 w-5 text-[#1a2744]" />
            </div>
            <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
              Transactions Needed
            </p>
            <p className="text-2xl font-extrabold text-[#1a2744]">
              {calculated.totalTransactionsNeeded}
            </p>
          </div>
          <div className="rounded-2xl border-2 border-slate-100 bg-white p-6 text-center">
            <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f4f8]">
              <Phone className="h-5 w-5 text-[#1a2744]" />
            </div>
            <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
              Daily Reach-Outs
            </p>
            <p className="text-2xl font-extrabold text-[#1a2744]">
              {calculated.dailyReachOuts.toFixed(0)}
            </p>
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="mb-10">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f4f8]">
            <ListChecks className="h-5 w-5 text-[#1a2744]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">What&apos;s Next?</h2>
            <p className="text-sm text-slate-500">Your path to achieving these goals</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-4 rounded-2xl border-2 border-slate-100 bg-white p-5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1a2744] text-sm font-bold text-white">
              1
            </span>
            <div>
              <p className="font-semibold text-slate-900">Section 4: Mindset, Self-Care & Motivation</p>
              <p className="text-sm text-slate-500">Build the mental foundation for success</p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-2xl border-2 border-slate-100 bg-white p-5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1a2744] text-sm font-bold text-white">
              2
            </span>
            <div>
              <p className="font-semibold text-slate-900">Section 5: Accountability & Progress Tracking</p>
              <p className="text-sm text-slate-500">Create your action plan and tracking systems</p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-2xl border-2 border-slate-100 bg-white p-5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1a2744] text-sm font-bold text-white">
              3
            </span>
            <div>
              <p className="font-semibold text-slate-900">Start Tracking Daily Activities</p>
              <p className="text-sm text-slate-500">Review your progress weekly to stay on track</p>
            </div>
          </div>
        </div>
      </section>

      {/* Continue to Section 4 CTA */}
      <footer className="mt-12 rounded-2xl bg-gradient-to-r from-[#e8f4f8] to-white p-8 text-center">
        <p className="mb-4 text-sm font-medium text-slate-500">Ready for the next step?</p>
        <Link
          href="/plan/section-4"
          className="group inline-flex items-center gap-2 rounded-full bg-[#1a2744] px-8 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-lg transition-all hover:scale-[1.02] hover:bg-slate-700 hover:shadow-xl active:scale-[0.98]"
        >
          Continue to Section 4: Mindset
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
        <p className="mt-4 text-sm text-slate-400">
          Or return to the{" "}
          <Link href="/plan" className="text-slate-600 underline hover:text-slate-800">
            dashboard
          </Link>
        </p>
      </footer>
    </StepContainer>
  );
}
