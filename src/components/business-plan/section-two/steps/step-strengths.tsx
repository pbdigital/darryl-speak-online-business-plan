"use client";

import { Zap } from "lucide-react";
import { useSectionTwoStore } from "@/stores/section-two-store";
import { SwotRow } from "../ui";

const strengthPlaceholders = [
  { left: "Strong negotiation skills", right: "Use in listing presentations and buyer negotiations" },
  { left: "Deep local market knowledge", right: "Position as the neighborhood expert in marketing" },
  { left: "Excellent follow-up systems", right: "Convert more leads through consistent communication" },
  { left: "Strong referral network", right: "Ask for introductions after every closing" },
  { left: "Social media presence", right: "Generate leads through consistent content creation" },
  { left: "First-time buyer expertise", right: "Partner with lenders for buyer seminars" },
  { left: "Responsive communication", right: "Highlight quick response times in listing pitches" },
  { left: "Professional photography skills", right: "Offer as added value to win more listings" },
];

export function StepStrengths() {
  const strengths = useSectionTwoStore((state) => state.data.strengths);
  const updateStrength = useSectionTwoStore((state) => state.updateStrength);

  const filledCount = strengths.filter((s) => s.strength.trim()).length;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-3xl px-4 duration-700">
      {/* Step Header */}
      <div className="mb-12 text-center">
        <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-emerald-600">
          Step 1 of 5
        </span>
        <h2 className="mb-2 flex items-center justify-center gap-3 text-3xl font-extrabold text-slate-900">
          <Zap className="h-8 w-8 text-emerald-500" />
          Strengths
        </h2>
        <p className="mx-auto max-w-xl text-slate-500">
          What do you do well? Identify your core strengths and how you can
          leverage them for success.
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8 flex items-center justify-between rounded-xl bg-emerald-50 px-6 py-4">
        <span className="text-sm font-medium text-emerald-700">
          {filledCount} of 8 strengths identified
        </span>
        <div className="h-2 w-32 overflow-hidden rounded-full bg-emerald-200">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${(filledCount / 8) * 100}%` }}
          />
        </div>
      </div>

      {/* Strengths Rows */}
      <div className="relative mb-10 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-lg">
        {/* Decorative corner */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-bl-full bg-emerald-50" />

        <div className="relative z-10 p-6 md:p-8">
          {strengths.map((item, index) => (
            <SwotRow
              key={index}
              index={index}
              leftLabel="Strength"
              rightLabel="Where Can Your Strength Be Put To Use"
              leftValue={item.strength}
              rightValue={item.useCase}
              onLeftChange={(value) => updateStrength(index, "strength", value)}
              onRightChange={(value) => updateStrength(index, "useCase", value)}
              leftPlaceholder={strengthPlaceholders[index]?.left}
              rightPlaceholder={strengthPlaceholders[index]?.right}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
