"use client";

import { useSectionTwoStore } from "@/stores/section-two-store";
import { SwotRow } from "../ui";

const opportunityPlaceholders = [
  { left: "Growing first-time buyer market", right: "Create targeted content, partner with lenders for seminars" },
  { left: "New development in my area", right: "Connect with builders, become the go-to agent for the project" },
  { left: "Expired listings in target neighborhood", right: "Send personalized outreach with fresh marketing plan" },
  { left: "Local business networking events", right: "Attend monthly chamber meetings, offer home buyer workshops" },
  { left: "Rising demand for investment properties", right: "Build relationships with local investors, learn ROI analysis" },
  { left: "Underserved luxury market segment", right: "Upgrade marketing materials, get certified in luxury homes" },
  { left: "Relocation companies seeking partners", right: "Reach out to HR departments, join relocation networks" },
  { left: "Social media video content trending", right: "Start weekly market update videos, showcase listings" },
];

export function StepOpportunities() {
  const opportunities = useSectionTwoStore((state) => state.data.opportunities);
  const updateOpportunity = useSectionTwoStore(
    (state) => state.updateOpportunity
  );

  const filledCount = opportunities.filter((o) => o.possibility.trim()).length;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-3xl px-4 duration-700">
      {/* Step Header - Left aligned with Part badge */}
      <div className="mb-8">
        <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
          Part 2C
        </span>
        <h2 className="mb-2 text-3xl font-extrabold text-slate-900">
          Opportunities
        </h2>
        <p className="text-slate-600">
          What external possibilities exist for growth? Identify chances to
          expand and improve your business in the market.
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8 flex items-center justify-between rounded-xl bg-slate-50 px-6 py-4">
        <span className="text-sm font-medium text-slate-700">
          {filledCount} of 8 opportunities identified
        </span>
        <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${(filledCount / 8) * 100}%` }}
          />
        </div>
      </div>

      {/* Opportunities Rows */}
      <div className="relative mb-10 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-lg">
        {/* Decorative corner */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-bl-full bg-slate-50" />

        <div className="relative z-10 p-6 md:p-8">
          {opportunities.map((item, index) => (
            <SwotRow
              key={index}
              index={index}
              leftLabel="Business Possibilities"
              rightLabel="Action Steps To Take"
              leftValue={item.possibility}
              rightValue={item.actionSteps}
              onLeftChange={(value) =>
                updateOpportunity(index, "possibility", value)
              }
              onRightChange={(value) =>
                updateOpportunity(index, "actionSteps", value)
              }
              leftPlaceholder={opportunityPlaceholders[index]?.left}
              rightPlaceholder={opportunityPlaceholders[index]?.right}
            />
          ))}
        </div>
      </div>

      {/* Up Next */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500">
          Up Next: Anticipate potential threats →
        </p>
      </div>
    </div>
  );
}
