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
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { useSectionTwoStore, STEP_NAMES, type IncompleteStep } from "@/stores/section-two-store";
import { SwotGridSummary } from "../ui";
import { StepContainer } from "@/components/business-plan/ui";

interface StepCompleteProps {
  startTime?: number;
  onNavigateToStep?: (step: number) => void;
}

// Almost There View - shown when steps 1-4 are not all complete
function AlmostThereView({
  incompleteSteps,
  onNavigateToStep
}: {
  incompleteSteps: IncompleteStep[];
  onNavigateToStep?: (step: number) => void;
}) {
  const firstIncompleteStep = incompleteSteps[0];

  return (
    <StepContainer>
      {/* Header */}
      <header className="relative mb-10">
        <div className="relative z-10 mb-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
            <AlertCircle className="h-3 w-3" />
            Almost There
          </span>
        </div>

        <h1 className="relative z-10 mb-3 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
          A Few Things{" "}
          <span className="relative">
            <span className="relative z-10">Left</span>
            <span className="absolute bottom-1 left-0 -z-0 h-3 w-full bg-amber-100" />
          </span>
        </h1>

        <p className="relative z-10 max-w-lg text-lg text-slate-600">
          Complete these items to finish your SWOT Analysis.
        </p>
      </header>

      {/* Incomplete Steps List */}
      <div className="mb-10 overflow-hidden rounded-3xl border-2 border-amber-200 bg-white shadow-sm">
        <div className="border-b border-amber-100 bg-amber-50 px-8 py-5">
          <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-amber-700">
            <AlertCircle className="h-4 w-4" />
            {incompleteSteps.length} {incompleteSteps.length === 1 ? 'Step' : 'Steps'} Remaining
          </h3>
        </div>
        <div className="divide-y divide-slate-100">
          {incompleteSteps.map((step) => (
            <button
              key={step.stepNumber}
              onClick={() => onNavigateToStep?.(step.stepNumber)}
              className="flex w-full items-center justify-between px-8 py-5 text-left transition-colors hover:bg-slate-50"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">
                  {step.stepNumber}
                </div>
                <div>
                  <div className="font-semibold text-slate-900">
                    Step {step.stepNumber}: {step.stepName}
                  </div>
                  <div className="text-sm text-slate-500">
                    {step.missingCount} {step.missingCount === 1 ? 'item' : 'items'} remaining
                  </div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Primary CTA */}
      <div className="text-center">
        <button
          onClick={() => onNavigateToStep?.(firstIncompleteStep.stepNumber)}
          className="group inline-flex items-center gap-2 rounded-full bg-[#1a2744] px-8 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-lg transition-all hover:scale-[1.02] hover:bg-slate-700 hover:shadow-xl active:scale-[0.98]"
        >
          Go to Step {firstIncompleteStep.stepNumber}: {firstIncompleteStep.stepName}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
        <p className="mt-4 text-sm text-slate-400">
          Or return to the{" "}
          <Link href="/plan" className="text-slate-600 underline hover:text-slate-800">
            dashboard
          </Link>
        </p>
      </div>
    </StepContainer>
  );
}

// Section Complete View - shown when all steps 1-4 are complete
function SectionCompleteView({ startTime }: { startTime?: number }) {
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

export function StepComplete({ startTime, onNavigateToStep }: StepCompleteProps) {
  const [showReveal, setShowReveal] = useState(true);
  const [revealPhase, setRevealPhase] = useState(0);

  // Get completion state from store - get function reference to avoid infinite loop
  const getIncompleteSteps = useSectionTwoStore((state) => state.getIncompleteSteps);
  const incompleteSteps = getIncompleteSteps();

  // Check if all steps 1-4 are complete
  const allPriorStepsComplete = incompleteSteps.length === 0;

  // Elegant reveal sequence (only show if all prior steps are complete)
  useEffect(() => {
    if (!allPriorStepsComplete) {
      setShowReveal(false);
      return;
    }

    const timers = [
      setTimeout(() => setRevealPhase(1), 300),
      setTimeout(() => setRevealPhase(2), 800),
      setTimeout(() => setRevealPhase(3), 1300),
      setTimeout(() => setShowReveal(false), 2200),
    ];

    return () => timers.forEach(clearTimeout);
  }, [allPriorStepsComplete]);

  // Show "Almost There" view if prior steps are incomplete
  if (!allPriorStepsComplete) {
    return (
      <AlmostThereView
        incompleteSteps={incompleteSteps}
        onNavigateToStep={onNavigateToStep}
      />
    );
  }

  // Show reveal animation for celebration
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

  // Show full completion view
  return <SectionCompleteView startTime={startTime} />;
}
