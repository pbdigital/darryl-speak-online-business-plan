"use client";

import { useSectionTwoStore } from "@/stores/section-two-store";
import { SwotRow } from "../ui";
import { DarrylTip } from "@/components/business-plan/ui/darryl-tip";

const threatPlaceholders = [
  { left: "Rising interest rates", right: "Educate buyers on rate locks, focus on pre-approvals" },
  { left: "Increased competition from discount brokers", right: "Emphasize full-service value, track record, and expertise" },
  { left: "Market slowdown or recession fears", right: "Diversify with rentals, build cash reserves, stay visible" },
  { left: "Low inventory in my target area", right: "Prospect FSBOs and expireds, expand geographic reach" },
  { left: "New agent from big team entering my farm", right: "Double down on relationships, increase touchpoints" },
  { left: "Technology disruption (iBuyers, AI)", right: "Adopt new tools early, emphasize human expertise" },
  { left: "Burnout from overwork", right: "Set boundaries, schedule time off, delegate admin tasks" },
  { left: "Economic uncertainty affecting buyers", right: "Focus on motivated sellers, investors, and must-move clients" },
];

export function StepThreats() {
  const threats = useSectionTwoStore((state) => state.data.threats);
  const updateThreat = useSectionTwoStore((state) => state.updateThreat);

  const filledCount = threats.filter((t) => t.threat.trim()).length;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-3xl px-4 duration-700">
      {/* Step Header - Left aligned with Part badge */}
      <div className="mb-8">
        <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
          Part 2D
        </span>
        <h2 className="mb-2 text-3xl font-extrabold text-slate-900">
          Threats
        </h2>
        <p className="text-slate-600">
          What could hold you back? Anticipate challenges and plan your
          response to stay ahead of potential obstacles.
        </p>
      </div>

      {/* DarrylTip */}
      <DarrylTip
        tip="The agents who thrive in any market are the ones who saw challenges coming and had a plan. Don't fear threats—prepare for them."
        className="mb-8"
      />

      {/* Progress Indicator */}
      <div className="mb-8 flex items-center justify-between rounded-xl bg-slate-50 px-6 py-4">
        <span className="text-sm font-medium text-slate-700">
          {filledCount} of 8 threats identified
        </span>
        <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${(filledCount / 8) * 100}%` }}
          />
        </div>
      </div>

      {/* Threats Rows */}
      <div className="relative mb-10 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-lg">
        {/* Decorative corner */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-bl-full bg-slate-50" />

        <div className="relative z-10 p-6 md:p-8">
          {threats.map((item, index) => (
            <SwotRow
              key={index}
              index={index}
              leftLabel="Possible Threats"
              rightLabel="Action Steps To Take"
              leftValue={item.threat}
              rightValue={item.actionSteps}
              onLeftChange={(value) => updateThreat(index, "threat", value)}
              onRightChange={(value) =>
                updateThreat(index, "actionSteps", value)
              }
              leftPlaceholder={threatPlaceholders[index]?.left}
              rightPlaceholder={threatPlaceholders[index]?.right}
            />
          ))}
        </div>
      </div>

      {/* Up Next */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500">
          Up Next: Review and complete your SWOT analysis →
        </p>
      </div>
    </div>
  );
}
