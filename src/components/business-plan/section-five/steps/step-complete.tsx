"use client";

import { Target, Check, Trophy } from "lucide-react";
import { useSectionFiveStore } from "@/stores/section-five-store";
import { StepContainer } from "@/components/business-plan/ui";

export function StepComplete() {
  const {
    getFilledProjectNames,
    getFilledResources,
    data,
  } = useSectionFiveStore();

  const filledProjectNames = getFilledProjectNames();
  const { current: filledCurrentResources, needed: filledNeededResources } =
    getFilledResources();

  // Count filled ideal clients (at least has a name)
  const filledIdealClients = data.idealClients.filter(
    (client) => client.name.trim()
  ).length;

  // Count prospecting activities with at least activity name
  const filledProspecting = data.prospectingActivities.filter(
    (a) => a.activity.trim()
  ).length;

  // Count marketing activities with at least activity name
  const filledMarketing = data.marketingActivities.filter(
    (a) => a.activity.trim()
  ).length;

  // Check if commitment contract is signed
  const hasCommitment =
    data.commitmentContract.agentName.trim() &&
    data.commitmentContract.transactionGoal !== null;

  return (
    <StepContainer>
      {/* Success Hero - Extra celebratory for final section */}
      <div className="mb-8 rounded-3xl bg-gradient-to-br from-[#1a2744] to-[#2d3e5f] p-8 text-center text-white shadow-xl md:p-12">
        <div className="mb-4 inline-flex rounded-full bg-white/10 p-4">
          <Trophy className="h-12 w-12" />
        </div>
        <h2 className="mb-2 text-3xl font-extrabold md:text-4xl">
          Business Plan Complete!
        </h2>
        <p className="text-lg text-slate-300">
          Congratulations! You&apos;ve completed your entire 2026 Business Plan.
          You now have a comprehensive roadmap for success.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl border-2 border-slate-100 bg-white p-6 text-center">
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
            Projects
          </p>
          <p className="text-2xl font-extrabold text-[#1a2744]">
            {filledProjectNames.length}
          </p>
        </div>
        <div className="rounded-2xl border-2 border-slate-100 bg-white p-6 text-center">
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
            Ideal Clients
          </p>
          <p className="text-2xl font-extrabold text-[#1a2744]">
            {filledIdealClients}
          </p>
        </div>
        <div className="rounded-2xl border-2 border-slate-100 bg-white p-6 text-center">
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
            Prospecting
          </p>
          <p className="text-2xl font-extrabold text-[#1a2744]">
            {filledProspecting}
          </p>
        </div>
        <div className="rounded-2xl border-2 border-slate-100 bg-white p-6 text-center">
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
            Marketing
          </p>
          <p className="text-2xl font-extrabold text-[#1a2744]">
            {filledMarketing}
          </p>
        </div>
      </div>

      {/* Section Summary */}
      <div className="mb-8 rounded-2xl border-2 border-slate-100 bg-white p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-700">
          Your Accountability System Summary
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-slate-700">
              <Check className="h-3 w-3 text-white" strokeWidth={3} />
            </div>
            <div>
              <p className="font-medium text-slate-900">Project Matrix</p>
              <p className="text-sm text-slate-500">
                {filledProjectNames.length} project{filledProjectNames.length !== 1 ? "s" : ""} mapped with
                actionable tasks
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-slate-700">
              <Check className="h-3 w-3 text-white" strokeWidth={3} />
            </div>
            <div>
              <p className="font-medium text-slate-900">Resources Assessed</p>
              <p className="text-sm text-slate-500">
                {filledCurrentResources.length} current and {filledNeededResources.length} needed
                resources identified
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-slate-700">
              <Check className="h-3 w-3 text-white" strokeWidth={3} />
            </div>
            <div>
              <p className="font-medium text-slate-900">Ideal Clients Defined</p>
              <p className="text-sm text-slate-500">
                {filledIdealClients} ideal client profile{filledIdealClients !== 1 ? "s" : ""} created
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-slate-700">
              <Check className="h-3 w-3 text-white" strokeWidth={3} />
            </div>
            <div>
              <p className="font-medium text-slate-900">Prospecting & Marketing</p>
              <p className="text-sm text-slate-500">
                {filledProspecting} prospecting and {filledMarketing} marketing activities planned
              </p>
            </div>
          </div>
          {hasCommitment && (
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-slate-700">
                <Check className="h-3 w-3 text-white" strokeWidth={3} />
              </div>
              <div>
                <p className="font-medium text-slate-900">Commitment Signed</p>
                <p className="text-sm text-slate-500">
                  Goal: {data.commitmentContract.transactionGoal} transactions with{" "}
                  {data.commitmentContract.accountabilityPartnerName || "accountability partner"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Celebration Box */}
      <div className="mb-8 rounded-2xl border-2 border-[#1a2744]/20 bg-[#e8f4f8]/30 p-6">
        <div className="flex items-start gap-3">
          <Target className="mt-0.5 h-6 w-6 flex-shrink-0 text-[#1a2744]" />
          <div>
            <p className="font-bold text-[#1a2744]">
              You Did It!
            </p>
            <p className="text-sm leading-relaxed text-slate-700">
              You&apos;ve completed your entire 2026 Business Plan—from reflection to commitment.
              This document represents your strategy, your goals, and your promise to yourself.
              Now it&apos;s time to execute.
            </p>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="rounded-2xl border-2 border-slate-100 bg-white p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-700">
          What&apos;s Next?
        </h3>
        <ul className="space-y-3 text-sm text-slate-600">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1a2744] text-xs font-bold text-white">
              1
            </span>
            <span>
              <strong className="text-[#1a2744]">Review your complete business plan</strong> from
              start to finish—all 5 sections now form your roadmap for 2026
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1a2744] text-xs font-bold text-white">
              2
            </span>
            <span>
              <strong className="text-[#1a2744]">Share your commitment</strong> with your
              accountability partner and schedule regular check-ins
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1a2744] text-xs font-bold text-white">
              3
            </span>
            <span>
              <strong className="text-[#1a2744]">Start working the Project Matrix</strong>—remember
              to work across the top row daily
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1a2744] text-xs font-bold text-white">
              4
            </span>
            <span>
              <strong className="text-[#1a2744]">Revisit this plan quarterly</strong> to track
              progress, adjust strategies, and celebrate wins
            </span>
          </li>
        </ul>
      </div>
    </StepContainer>
  );
}
