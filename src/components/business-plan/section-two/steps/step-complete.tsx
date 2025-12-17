"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Grid2X2,
  Trophy,
  Target,
} from "lucide-react";
import { useSectionTwoStore } from "@/stores/section-two-store";
import { SwotGridSummary } from "../ui";
import { StepContainer } from "@/components/business-plan/ui";

interface StepCompleteProps {
  startTime?: number;
}

export function StepComplete({ startTime }: StepCompleteProps) {
  const [showReveal, setShowReveal] = useState(true);
  const [revealPhase, setRevealPhase] = useState(0);

  // Get raw data from store (stable references)
  const strengths = useSectionTwoStore((state) => state.data.strengths);
  const weaknesses = useSectionTwoStore((state) => state.data.weaknesses);
  const opportunities = useSectionTwoStore((state) => state.data.opportunities);
  const threats = useSectionTwoStore((state) => state.data.threats);

  // Filter filled items with useMemo to avoid infinite loops
  const filledStrengths = useMemo(
    () => strengths.filter((s) => s.strength.trim()),
    [strengths]
  );
  const filledWeaknesses = useMemo(
    () => weaknesses.filter((w) => w.weakness.trim()),
    [weaknesses]
  );
  const filledOpportunities = useMemo(
    () => opportunities.filter((o) => o.possibility.trim()),
    [opportunities]
  );
  const filledThreats = useMemo(
    () => threats.filter((t) => t.threat.trim()),
    [threats]
  );

  // Calculate total items (not fields)
  const totalItems =
    filledStrengths.length +
    filledWeaknesses.length +
    filledOpportunities.length +
    filledThreats.length;

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
          Your strategic analysis is complete. Here&apos;s your SWOT at a glance.
        </p>
      </header>

      {/* Summary Card */}
      <div className="mb-10 overflow-hidden rounded-3xl border-2 border-slate-100 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-[#e8f4f8]/30 px-8 py-5">
          <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#1a2744]">
            <Trophy className="h-4 w-4" /> Your SWOT Summary
          </h3>
        </div>
        <div className="grid gap-6 p-8 md:grid-cols-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f4f8]">
              <Grid2X2 className="h-5 w-5 text-[#1a2744]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{totalItems}</div>
              <div className="text-xs text-slate-500">Items Identified</div>
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
              <div className="text-2xl font-bold text-slate-900">2 of 5</div>
              <div className="text-xs text-slate-500">Sections Complete</div>
            </div>
          </div>
        </div>
      </div>

      {/* SWOT Grid */}
      <section className="mb-10">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f4f8]">
            <Grid2X2 className="h-5 w-5 text-[#1a2744]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Your SWOT Matrix</h2>
            <p className="text-sm text-slate-500">Your strategic position at a glance</p>
          </div>
        </div>

        <SwotGridSummary
          strengths={filledStrengths}
          weaknesses={filledWeaknesses}
          opportunities={filledOpportunities}
          threats={filledThreats}
        />
      </section>

      {/* Strategic Actions */}
      <section className="mb-10">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f4f8]">
            <Target className="h-5 w-5 text-[#1a2744]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Strategic Actions</h2>
            <p className="text-sm text-slate-500">How to use your SWOT analysis</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center gap-3 rounded-2xl border-2 border-slate-100 bg-white p-4">
            <ArrowRight className="h-4 w-4 text-[#1a2744]" />
            <span className="text-sm text-slate-600">
              <strong className="text-slate-900">Leverage</strong> strengths to seize opportunities
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border-2 border-slate-100 bg-white p-4">
            <ArrowRight className="h-4 w-4 text-[#1a2744]" />
            <span className="text-sm text-slate-600">
              <strong className="text-slate-900">Improve</strong> weaknesses blocking growth
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border-2 border-slate-100 bg-white p-4">
            <ArrowRight className="h-4 w-4 text-[#1a2744]" />
            <span className="text-sm text-slate-600">
              <strong className="text-slate-900">Monitor</strong> threats exploiting gaps
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border-2 border-slate-100 bg-white p-4">
            <ArrowRight className="h-4 w-4 text-[#1a2744]" />
            <span className="text-sm text-slate-600">
              <strong className="text-slate-900">Defend</strong> with strengths against threats
            </span>
          </div>
        </div>
      </section>

      {/* Continue to Section 3 CTA */}
      <footer className="mt-12 rounded-2xl bg-gradient-to-r from-[#e8f4f8] to-white p-8 text-center">
        <p className="mb-4 text-sm font-medium text-slate-500">Ready for the next step?</p>
        <Link
          href="/plan/section-3"
          className="group inline-flex items-center gap-2 rounded-full bg-[#1a2744] px-8 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-lg transition-all hover:scale-[1.02] hover:bg-slate-700 hover:shadow-xl active:scale-[0.98]"
        >
          Continue to Section 3: Income Planning
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
