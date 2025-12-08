"use client";

import { BookOpen } from "lucide-react";
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
        <div className="mb-12 grid gap-12 md:grid-cols-2">
          <DefinitionBox
            title="What It Is"
            content="This section is your opportunity to thoughtfully (and honestly) reflect on the past year and set goals for the year ahead with intentionality and purpose."
          />
          <DefinitionBox
            title="Why It Matters"
            content="By understanding where you've been, you can better plan where you're going. Self-awareness fosters clarity, motivation, and meaningful progress."
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
          <p className="mb-6 italic text-slate-600">
            &ldquo;How to Fill It Out: Answer the prompts as honestly and fully
            as possible. Take your time, and feel free to revisit this section
            throughout the year.&rdquo;
          </p>
          <button
            onClick={onStart}
            className="transform rounded-full bg-[#0F172A] px-10 py-4 font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-slate-800 hover:shadow-xl"
          >
            Start Reflection
          </button>
        </div>
      </div>
    </div>
  );
}
