"use client";

import { Grid2X2, Sparkles, Heart, Target } from "lucide-react";
import { StepContainer, StepHeader } from "@/components/business-plan/ui";

interface StepOverviewProps {
  onStart: () => void;
}

export function StepOverview({ onStart }: StepOverviewProps) {
  return (
    <StepContainer>
      <StepHeader
        part="Section 2"
        title="SWOT Analysis"
        highlightWord="SWOT"
        subtitle="Evaluate your position to build a resilient business strategy."
        icon={Grid2X2}
      />

      {/* What You'll Learn */}
      <div className="mb-10 space-y-4">
        <div className="flex items-start gap-4 rounded-2xl border-2 border-slate-100 bg-white p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f4f8]">
            <Sparkles className="h-5 w-5 text-[#1a2744]" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">What It Is</p>
            <p className="text-sm text-slate-600">
              SWOT stands for Strengths, Weaknesses, Opportunities, and Threats. It&apos;s a self-assessment tool to help you evaluate your current position in business.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-2xl border-2 border-slate-100 bg-white p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f4f8]">
            <Heart className="h-5 w-5 text-[#1a2744]" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">Why It Matters</p>
            <p className="text-sm text-slate-600">
              Awareness of your strengths and areas of improvement empowers you to take focused, effective action. It helps you play to your strengths while proactively addressing challenges.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-2xl border-2 border-slate-100 bg-white p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f4f8]">
            <Target className="h-5 w-5 text-[#1a2744]" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">How to Fill It Out</p>
            <p className="text-sm text-slate-600">
              Use the prompts to brainstorm your current strengths, weaknesses, external opportunities, and possible threats. For each, include action steps to maximize or address them.
            </p>
          </div>
        </div>
      </div>

      {/* SWOT Sections */}
      <div className="mb-10 overflow-hidden rounded-3xl border-2 border-slate-100 bg-white">
        <div className="border-b border-slate-100 bg-[#e8f4f8]/30 px-6 py-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#1a2744]">
            The 4 SWOT Quadrants
          </h3>
        </div>
        <div className="grid gap-3 p-6 md:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1a2744] text-xs font-bold text-white">
              S
            </span>
            <div>
              <p className="text-sm font-medium text-slate-700">Strengths</p>
              <p className="text-xs text-slate-500">Where can you leverage what you do well?</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1a2744] text-xs font-bold text-white">
              W
            </span>
            <div>
              <p className="text-sm font-medium text-slate-700">Weaknesses</p>
              <p className="text-xs text-slate-500">What needs to be accepted, delegated, or improved?</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1a2744] text-xs font-bold text-white">
              O
            </span>
            <div>
              <p className="text-sm font-medium text-slate-700">Opportunities</p>
              <p className="text-xs text-slate-500">What chances for growth or change exist?</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1a2744] text-xs font-bold text-white">
              T
            </span>
            <div>
              <p className="text-sm font-medium text-slate-700">Threats</p>
              <p className="text-xs text-slate-500">What could hold you back?</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <button
          onClick={onStart}
          className="group inline-flex items-center gap-2 rounded-full bg-[#1a2744] px-10 py-4 font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:bg-slate-700 hover:shadow-xl active:scale-[0.98]"
        >
          Start Analysis
        </button>
        <p className="mt-4 text-sm text-slate-500">
          Takes approximately 15-20 minutes to complete
        </p>
      </div>
    </StepContainer>
  );
}
