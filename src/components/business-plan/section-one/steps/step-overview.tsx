"use client";

import { BookOpen, Sparkles, Heart, Target } from "lucide-react";
import { StepContainer, StepHeader } from "@/components/business-plan/ui";

interface StepOverviewProps {
  onStart: () => void;
}

export function StepOverview({ onStart }: StepOverviewProps) {
  return (
    <StepContainer>
      <StepHeader
        part="Section 1"
        title="Annual Reflection & Intention Setting"
        highlightWord="Reflection"
        subtitle="The foundation of your success starts with understanding where you've been over the past 12 months."
        icon={BookOpen}
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
              This section is your opportunity to thoughtfully (and honestly) reflect on the past 12 months and set goals for the next 12 months with intentionality and purpose.
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
              By understanding where you&apos;ve been, you can better plan where you&apos;re going. Self-awareness fosters clarity, motivation, and meaningful progress.
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
              Answer the prompts as honestly and fully as possible. Take your time, and feel free to revisit this section throughout the year.
            </p>
          </div>
        </div>
      </div>

      {/* 2-Part Process */}
      <div className="mb-10 overflow-hidden rounded-3xl border-2 border-slate-100 bg-white">
        <div className="border-b border-slate-100 bg-[#e8f4f8]/30 px-6 py-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#1a2744]">
            This Section Includes
          </h3>
        </div>
        <div className="grid gap-3 p-6 md:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1a2744] text-xs font-bold text-white">
              1A
            </span>
            <p className="text-sm font-medium text-slate-700">Past 12 Months in Review</p>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1a2744] text-xs font-bold text-white">
              1B
            </span>
            <p className="text-sm font-medium text-slate-700">New Year&apos;s Reflection Worksheet</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <button
          onClick={onStart}
          className="group inline-flex items-center gap-2 rounded-full bg-[#1a2744] px-10 py-4 font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:bg-slate-700 hover:shadow-xl active:scale-[0.98]"
        >
          Start Reflection
        </button>
        <p className="mt-4 text-sm text-slate-500">
          Takes approximately 20-30 minutes to complete
        </p>
      </div>
    </StepContainer>
  );
}
