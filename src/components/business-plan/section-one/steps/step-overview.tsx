"use client";

import { BookOpen, Clock } from "lucide-react";
import { SectionCover, DefinitionBox } from "../ui";

interface StepOverviewProps {
  onStart: () => void;
}

export function StepOverview({ onStart }: StepOverviewProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-6xl px-5 duration-700">
      <SectionCover
        number="1"
        title="Annual Reflection & Intention Setting"
        subtitle="The foundation of your 2026 success starts with understanding your 2025 journey."
        icon={BookOpen}
        progress={0}
      />

      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-8 space-y-8">
          <DefinitionBox
            title="What It Is"
            content="This section is your opportunity to thoughtfully (and honestly) reflect on the past year and set goals for the year ahead with intentionality and purpose."
          />
          <DefinitionBox
            title="Why It Matters"
            content="By understanding where you've been, you can better plan where you're going. Self-awareness fosters clarity, motivation, and meaningful progress."
          />
          <DefinitionBox
            title="How to Fill It Out"
            content="Answer the prompts as honestly and fully as possible. Take your time, and feel free to revisit this section throughout the year."
          />
        </div>

        {/* Optional questions note */}
        <div className="mb-8 rounded-xl border border-amber-100 bg-amber-50/50 px-6 py-4 text-center">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> All questions in this section are optional. Answer what feels meaningful to you.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
          <p className="mb-6 text-slate-600">
            This section includes two parts: <strong>Last Year in Review</strong> (your production numbers and reflection questions) and the <strong>New Year&apos;s Reflection &amp; Intention-Setting Worksheet</strong> (a deeper dive into gratitude, values, goals, and accountability).
          </p>

          {/* Time estimate */}
          <div className="mb-6 flex items-center justify-center gap-2 text-sm text-slate-500">
            <Clock className="h-4 w-4" />
            <span>Estimated time: 20-30 minutes</span>
          </div>

          <button
            onClick={onStart}
            className="transform rounded-full bg-[#1E293B] px-10 py-4 font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:bg-slate-700 hover:shadow-xl active:scale-[0.98]"
          >
            Start Reflection
          </button>
        </div>
      </div>
    </div>
  );
}
