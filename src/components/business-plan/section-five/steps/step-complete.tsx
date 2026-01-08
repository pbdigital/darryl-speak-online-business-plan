"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Target, Check, Clock, FileText, Trophy, Star, AlertCircle, ChevronRight, ArrowRight } from "lucide-react";
import { useSectionFiveStore, STEP_NAMES, type IncompleteStep } from "@/stores/section-five-store";
import { StepContainer } from "@/components/business-plan/ui";
import { CURRENT_PLAN_YEAR } from "@/lib/constants";

interface StepCompleteProps {
  startTime?: number;
  onNavigateToStep?: (step: number) => void;
}

// Almost There View - shown when steps 1-7 are not all complete
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
          Complete these items to finish your Business Plan.
        </p>
      </header>

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

// Section Complete View - shown when all steps 1-7 are complete
function SectionCompleteView({ startTime }: { startTime?: number }) {
  const { getFilledProjectNames, getFilledResources, data } = useSectionFiveStore();

  const filledProjectNames = getFilledProjectNames();
  const { current: filledCurrentResources, needed: filledNeededResources } = getFilledResources();

  const filledIdealClients = data.idealClients.filter((client) => client.name.trim()).length;
  const filledProspecting = data.prospectingActivities.filter((a) => a.activity.trim()).length;
  const filledMarketing = data.marketingActivities.filter((a) => a.activity.trim()).length;

  const hasCommitment =
    data.commitmentContract.agentName.trim() &&
    data.commitmentContract.transactionGoal !== null;

  const totalItems =
    filledProjectNames.length +
    filledCurrentResources.length +
    filledNeededResources.length +
    filledIdealClients +
    filledProspecting +
    filledMarketing;

  const timeSpent = startTime ? Math.round((Date.now() - startTime) / 1000 / 60) : 0;

  return (
    <StepContainer>
      <header className="relative mb-10">
        <div className="absolute -right-4 top-0 hidden opacity-10 md:right-0 md:block">
          <Trophy className="h-32 w-32 text-[#1a2744]" strokeWidth={1} />
        </div>

        <div className="relative z-10 mb-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#1a2744] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
            <Star className="h-3 w-3" /> Complete
          </span>
        </div>

        <h1 className="relative z-10 mb-3 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
          Business Plan{" "}
          <span className="relative">
            <span className="relative z-10">Complete!</span>
            <span className="absolute bottom-1 left-0 -z-0 h-3 w-full bg-[#e8f4f8]" />
          </span>
        </h1>

        <p className="relative z-10 max-w-lg text-lg text-slate-600">
          Congratulations! You&apos;ve completed your entire {CURRENT_PLAN_YEAR} Business Plan. You now have a comprehensive roadmap for success.
        </p>
      </header>

      <div className="mb-10 overflow-hidden rounded-3xl border-2 border-slate-100 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-[#e8f4f8]/30 px-8 py-5">
          <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#1a2744]">
            <Trophy className="h-4 w-4" /> Your Complete Business Plan
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
              <div className="text-2xl font-bold text-slate-900">{timeSpent > 0 ? `~${timeSpent}` : "—"}</div>
              <div className="text-xs text-slate-500">Minutes Invested</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f4f8]">
              <Trophy className="h-5 w-5 text-[#1a2744]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">5 of 5</div>
              <div className="text-xs text-slate-500">Sections Complete</div>
            </div>
          </div>
        </div>

        {hasCommitment && (
          <div className="border-t border-slate-100 bg-[#1a2744] px-8 py-6">
            <div className="flex items-center gap-3">
              <Star className="h-5 w-5 text-white/60" />
              <div>
                <div className="text-xs text-white/60">Your {CURRENT_PLAN_YEAR} Commitment</div>
                <div className="text-xl font-black text-white">
                  {data.commitmentContract.transactionGoal} Transactions
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mb-10 rounded-3xl border-2 border-slate-100 bg-white p-8">
        <h3 className="mb-6 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#1a2744]">
          Your Accountability System
        </h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#1a2744]">
              <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Project Matrix</p>
              <p className="text-sm text-slate-500">
                {filledProjectNames.length} project{filledProjectNames.length !== 1 ? "s" : ""} mapped with actionable tasks
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#1a2744]">
              <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Resources Assessed</p>
              <p className="text-sm text-slate-500">
                {filledCurrentResources.length} current and {filledNeededResources.length} needed resources identified
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#1a2744]">
              <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Ideal Clients Defined</p>
              <p className="text-sm text-slate-500">
                {filledIdealClients} ideal client profile{filledIdealClients !== 1 ? "s" : ""} created
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#1a2744]">
              <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Prospecting & Marketing</p>
              <p className="text-sm text-slate-500">
                {filledProspecting} prospecting and {filledMarketing} marketing activities planned
              </p>
            </div>
          </div>
          {hasCommitment && (
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#1a2744]">
                <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Commitment Signed</p>
                <p className="text-sm text-slate-500">
                  Goal: {data.commitmentContract.transactionGoal} transactions with{" "}
                  {data.commitmentContract.accountabilityPartnerName || "accountability partner"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mb-10 rounded-3xl border-2 border-[#1a2744]/10 bg-[#e8f4f8]/30 p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#1a2744]">
            <Target className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="mb-2 text-lg font-bold text-[#1a2744]">You Did It!</p>
            <p className="leading-relaxed text-slate-700">
              You&apos;ve completed your entire {CURRENT_PLAN_YEAR} Business Plan—from reflection to commitment. Now it&apos;s time to execute.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-10 rounded-3xl border-2 border-slate-100 bg-white p-8">
        <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-[#1a2744]">What&apos;s Next?</h3>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1a2744] text-xs font-bold text-white">1</span>
            <span className="text-slate-600">
              <strong className="text-[#1a2744]">Review your complete business plan</strong> from start to finish
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1a2744] text-xs font-bold text-white">2</span>
            <span className="text-slate-600">
              <strong className="text-[#1a2744]">Share your commitment</strong> with your accountability partner
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1a2744] text-xs font-bold text-white">3</span>
            <span className="text-slate-600">
              <strong className="text-[#1a2744]">Start working the Project Matrix</strong>—work across the top row daily
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1a2744] text-xs font-bold text-white">4</span>
            <span className="text-slate-600">
              <strong className="text-[#1a2744]">Revisit this plan quarterly</strong> to track progress and celebrate wins
            </span>
          </li>
        </ul>
      </div>

      <footer className="rounded-2xl bg-gradient-to-r from-[#e8f4f8] to-white p-8 text-center">
        <p className="mb-4 text-sm font-medium text-slate-500">Your {CURRENT_PLAN_YEAR} Business Plan is ready</p>
        <Link
          href="/plan"
          className="group inline-flex items-center gap-2 rounded-full bg-[#1a2744] px-8 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-lg transition-all hover:scale-[1.02] hover:bg-slate-700 hover:shadow-xl active:scale-[0.98]"
        >
          Return to Dashboard
        </Link>
      </footer>
    </StepContainer>
  );
}

export function StepComplete({ startTime, onNavigateToStep }: StepCompleteProps) {
  const [showReveal, setShowReveal] = useState(true);
  const [revealPhase, setRevealPhase] = useState(0);

  // Get function reference to avoid infinite loop
  const getIncompleteSteps = useSectionFiveStore((state) => state.getIncompleteSteps);
  const incompleteSteps = getIncompleteSteps();
  const allPriorStepsComplete = incompleteSteps.length === 0;

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

  if (!allPriorStepsComplete) {
    return (
      <AlmostThereView
        incompleteSteps={incompleteSteps}
        onNavigateToStep={onNavigateToStep}
      />
    );
  }

  if (showReveal) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center bg-gradient-to-b from-[#e8f4f8]/30 via-white to-white px-4">
        <div className={`mb-6 transition-all duration-500 ${revealPhase >= 1 ? "scale-100 opacity-100" : "scale-75 opacity-0"}`}>
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#1a2744]">
            {revealPhase >= 2 ? (
              <Trophy className="h-10 w-10 text-white animate-bounce" />
            ) : (
              <div className="h-10 w-10" />
            )}
          </div>
        </div>
        <h2 className={`text-center text-2xl font-bold text-slate-900 transition-all duration-500 ${revealPhase >= 3 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
          Business Plan Complete!
        </h2>
      </div>
    );
  }

  return <SectionCompleteView startTime={startTime} />;
}
