"use client";

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
      {/* Step Header - Left aligned with Part badge */}
      <div className="mb-8">
        <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
          Part 2A
        </span>
        <h2 className="mb-2 text-3xl font-extrabold text-slate-900">
          Strengths
        </h2>
        <p className="text-slate-600">
          What do you do well? Identify your core strengths and how you can
          leverage them for success in your real estate business.
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8 flex items-center justify-between rounded-xl bg-slate-50 px-6 py-4">
        <span className="text-sm font-medium text-slate-700">
          {filledCount} of 8 strengths identified
        </span>
        <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${(filledCount / 8) * 100}%` }}
          />
        </div>
      </div>

      {/* Strengths Rows */}
      <div className="relative mb-10 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-lg">
        {/* Decorative corner */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-bl-full bg-slate-50" />

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

      {/* Up Next */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500">
          Up Next: Identify your weaknesses →
        </p>
      </div>
    </div>
  );
}
