"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, FileText, Sparkles, Star } from "lucide-react";
import { WorkbookTextarea, WorkbookInput, AnimatedCheckmark, AnswerSummary } from "../ui";
import { useSectionOneStore } from "@/stores/section-one-store";

interface StepCompleteProps {
  startTime?: number;
}

export function StepComplete({ startTime }: StepCompleteProps) {
  const [showReveal, setShowReveal] = useState(true);
  const [revealPhase, setRevealPhase] = useState(0);

  // Get data from store
  const filledFieldCount = useSectionOneStore((state) => state.getFilledFieldCount());
  const mantra = useSectionOneStore((state) => state.data.mantra);

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
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <div
          className={`mb-6 transition-all duration-500 ${
            revealPhase >= 1
              ? "scale-100 opacity-100"
              : "scale-75 opacity-0"
          }`}
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
            {revealPhase >= 2 ? (
              <svg
                className="h-10 w-10 text-emerald-500"
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
    <div className="animate-fade-in-up mx-auto max-w-3xl px-4">
      <div className="mb-10 text-center">
        <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-emerald-600">
          Complete
        </span>
        <h2 className="mb-2 text-3xl font-extrabold text-slate-900">
          Reflection Complete
        </h2>
        <p className="text-slate-500">
          You&apos;ve done meaningful work. Now seal it with intention.
        </p>
      </div>

      {/* Summary Card - Elegant sage tones */}
      <div className="mb-10 overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-slate-50 shadow-sm">
        <div className="border-b border-emerald-100 bg-white/50 px-8 py-5">
          <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-emerald-800">
            <Sparkles className="h-4 w-4" /> Your Reflection Summary
          </h3>
        </div>
        <div className="grid gap-6 p-8 md:grid-cols-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
              <FileText className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{filledFieldCount}</div>
              <div className="text-xs text-slate-500">Questions Answered</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
              <Clock className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">
                {timeSpent > 0 ? `~${timeSpent}` : "—"}
              </div>
              <div className="text-xs text-slate-500">Minutes Invested</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">1 of 5</div>
              <div className="text-xs text-slate-500">Sections Complete</div>
            </div>
          </div>
        </div>

        {/* Mantra Display */}
        {mantra && (
          <div className="border-t border-emerald-100 bg-white/30 px-8 py-6">
            <div className="flex items-center gap-3">
              <Star className="h-5 w-5 text-emerald-600" />
              <div>
                <div className="text-xs text-slate-500">Your 2026 Mantra</div>
                <div className="text-xl font-black uppercase tracking-wide text-slate-900">
                  {mantra}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Answer Summary - Collapsible review */}
      <AnswerSummary />

      {/* Celebration Questions - Subtle styling */}
      <div className="mb-10 rounded-2xl border border-slate-100 bg-slate-50/50 p-8">
        <h3 className="mb-8 text-sm font-bold uppercase tracking-wider text-slate-700">
          Celebration & Encouragement
        </h3>
        <div className="space-y-2">
          <WorkbookTextarea
            label="How will you celebrate milestones along the way?"
            fieldName="celebrationMethod"
            placeholder="Dinner at my favorite restaurant after every 5 transactions. Weekend trip at $100k GCI..."
            rows={3}
          />
          <WorkbookTextarea
            label="What words of encouragement would you give to your future self?"
            fieldName="encouragementMessage"
            placeholder="Dear future me: Remember why you started. Every 'no' is closer to a 'yes'. You've got this..."
            rows={3}
          />
        </div>
      </div>

      {/* Signature Section - Refined */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-slate-900">
          Your Commitment
        </h3>
        <p className="mb-4 text-sm leading-relaxed text-slate-500">
          By signing below, I commit to honoring these reflections and working
          toward the intentions I&apos;ve set for 2026. This is a living
          document—revisit it throughout the year.
        </p>
        <p className="mb-8 text-xs italic text-slate-400">
          Your signature here is symbolic—a personal promise to yourself.
          Simply type your name to acknowledge your commitment.
        </p>
        <div className="grid gap-8 md:grid-cols-2">
          <WorkbookInput label="Signature" fieldName="signature" placeholder="Type your full name" />
          <WorkbookInput label="Date" fieldName="completionDate" placeholder="Today's date (e.g., Dec 12, 2025)" type="text" />
        </div>
      </div>

      {/* Continue to Section 2 CTA */}
      <div className="mt-12 text-center">
        <Link
          href="/plan/section-2"
          className="group inline-flex items-center gap-2 rounded-full bg-emerald-600 px-8 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-lg transition-all hover:bg-emerald-700 hover:shadow-xl"
        >
          Continue to Section 2: SWOT Analysis
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
        <p className="mt-3 text-sm text-slate-400">
          Or return to the{" "}
          <Link href="/plan" className="text-slate-600 underline hover:text-slate-800">
            dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}
