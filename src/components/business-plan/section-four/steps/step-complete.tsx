"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Smile, Check, Clock, FileText, Trophy } from "lucide-react";
import { useSectionFourStore } from "@/stores/section-four-store";
import { StepContainer } from "@/components/business-plan/ui";
import { CURRENT_PLAN_YEAR } from "@/lib/constants";

interface StepCompleteProps {
  startTime?: number;
}

export function StepComplete({ startTime }: StepCompleteProps) {
  const [showReveal, setShowReveal] = useState(true);
  const [revealPhase, setRevealPhase] = useState(0);

  const {
    getFilledAffirmations,
    getFilledBoundaries,
    getFilledSelfCare,
    getFilledSupport,
  } = useSectionFourStore();

  const filledAffirmations = getFilledAffirmations();
  const filledBoundaries = getFilledBoundaries();
  const filledSelfCare = getFilledSelfCare();
  const filledSupport = getFilledSupport();

  // Calculate total items filled
  const totalItems = filledAffirmations.length + filledBoundaries.length + filledSelfCare.length + filledSupport.length;

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
          Mindset{" "}
          <span className="relative">
            <span className="relative z-10">Complete</span>
            <span className="absolute bottom-1 left-0 -z-0 h-3 w-full bg-[#e8f4f8]" />
          </span>
        </h1>

        <p className="relative z-10 max-w-lg text-lg text-slate-600">
          You&apos;ve built your personal stability system. This foundation will keep you grounded, focused, and motivated throughout {CURRENT_PLAN_YEAR}.
        </p>
      </header>

      {/* Summary Card */}
      <div className="mb-10 overflow-hidden rounded-3xl border-2 border-slate-100 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-[#e8f4f8]/30 px-8 py-5">
          <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#1a2744]">
            <Smile className="h-4 w-4" /> Your Mindset Summary
          </h3>
        </div>
        <div className="grid gap-6 p-8 md:grid-cols-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f4f8]">
              <FileText className="h-5 w-5 text-[#1a2744]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{totalItems}</div>
              <div className="text-xs text-slate-500">Items Defined</div>
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
              <Trophy className="h-5 w-5 text-[#1a2744]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">4 of 5</div>
              <div className="text-xs text-slate-500">Sections Complete</div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Summary */}
      <div className="mb-10 rounded-3xl border-2 border-slate-100 bg-white p-8">
        <h3 className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#1a2744]">
          Your Mindset System
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#1a2744]">
              <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Motivating Affirmations</p>
              <p className="text-sm text-slate-500">
                {filledAffirmations.length} affirmation{filledAffirmations.length !== 1 ? "s" : ""} to reinforce your identity
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#1a2744]">
              <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Grounding Rituals</p>
              <p className="text-sm text-slate-500">
                Morning and evening routines defined
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#1a2744]">
              <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Boundaries & Self-Care</p>
              <p className="text-sm text-slate-500">
                {filledBoundaries.length} boundaries and {filledSelfCare.length} self-care commitments
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#1a2744]">
              <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Support Network</p>
              <p className="text-sm text-slate-500">
                {filledSupport.length} support resource{filledSupport.length !== 1 ? "s" : ""} identified
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reminder Box */}
      <div className="mb-10 rounded-3xl border-2 border-[#1a2744]/10 bg-[#e8f4f8]/30 p-8">
        <p className="leading-relaxed text-slate-700">
          <strong className="text-[#1a2744]">Remember:</strong> By clarifying what strengthens your mindset, protects your energy, and keeps you motivated, you&apos;ve created a foundation that supports consistent action. When the market shifts, when deals fall through, or when burnout creeps in, this system brings you back to center.
        </p>
      </div>

      {/* What's Next */}
      <div className="mb-10 rounded-3xl border-2 border-slate-100 bg-white p-8">
        <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-[#1a2744]">
          What&apos;s Next?
        </h3>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1a2744] text-xs font-bold text-white">
              1
            </span>
            <span className="text-slate-600">
              Complete <strong className="text-[#1a2744]">Section 5: Accountability & Progress Tracking</strong> to create your action plan and tracking systems
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1a2744] text-xs font-bold text-white">
              2
            </span>
            <span className="text-slate-600">
              Print or save your affirmations somewhere visible—read them every morning
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1a2744] text-xs font-bold text-white">
              3
            </span>
            <span className="text-slate-600">
              Share your boundaries with someone who will hold you accountable
            </span>
          </li>
        </ul>
      </div>

      {/* Continue to Section 5 CTA */}
      <footer className="rounded-2xl bg-gradient-to-r from-[#e8f4f8] to-white p-8 text-center">
        <p className="mb-4 text-sm font-medium text-slate-500">Ready for the final section?</p>
        <Link
          href="/plan/section-5"
          className="group inline-flex items-center gap-2 rounded-full bg-[#1a2744] px-8 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-lg transition-all hover:scale-[1.02] hover:bg-slate-700 hover:shadow-xl active:scale-[0.98]"
        >
          Continue to Section 5: Accountability
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
