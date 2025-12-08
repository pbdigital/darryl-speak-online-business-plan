"use client";

import { Shield } from "lucide-react";
import { useSectionTwoStore } from "@/stores/section-two-store";
import { SwotRow } from "../ui";

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
      {/* Step Header */}
      <div className="mb-12 text-center">
        <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-rose-600">
          Step 4 of 5
        </span>
        <h2 className="mb-2 flex items-center justify-center gap-3 text-3xl font-extrabold text-slate-900">
          <Shield className="h-8 w-8 text-rose-500" />
          Threats
        </h2>
        <p className="mx-auto max-w-xl text-slate-500">
          What could hold you back? Anticipate challenges and plan your
          response.
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8 flex items-center justify-between rounded-xl bg-rose-50 px-6 py-4">
        <span className="text-sm font-medium text-rose-700">
          {filledCount} of 8 threats identified
        </span>
        <div className="h-2 w-32 overflow-hidden rounded-full bg-rose-200">
          <div
            className="h-full rounded-full bg-rose-500 transition-all duration-300"
            style={{ width: `${(filledCount / 8) * 100}%` }}
          />
        </div>
      </div>

      {/* Threats Rows */}
      <div className="relative mb-10 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-lg">
        {/* Decorative corner */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-bl-full bg-rose-50" />

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
    </div>
  );
}
