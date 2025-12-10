"use client";

import { useSectionFiveStore } from "@/stores/section-five-store";
import { WorkbookTextarea } from "@/components/business-plan/section-one/ui";
import { DarrylTip } from "@/components/business-plan/section-three/ui/darryl-tip";
import type { QuarterlyMarketing } from "@/types/business-plan";

export function StepQuarterlyMarketing() {
  const quarterlyMarketing = useSectionFiveStore(
    (state) => state.data.quarterlyMarketing
  );
  const updateQuarterlyMarketing = useSectionFiveStore(
    (state) => state.updateQuarterlyMarketing
  );

  const quarters = [
    {
      label: "Q1 (January - March)",
      strategy1Key: "q1Strategy1" as keyof QuarterlyMarketing,
      strategy2Key: "q1Strategy2" as keyof QuarterlyMarketing,
      examples: [
        "Mail HUD closing statements with personalized cover letter to past clients",
        "Host client appreciation party",
      ],
    },
    {
      label: "Q2 (April - June)",
      strategy1Key: "q2Strategy1" as keyof QuarterlyMarketing,
      strategy2Key: "q2Strategy2" as keyof QuarterlyMarketing,
      examples: [
        "Set up booth or sponsor table at local festival/community event",
        "Send spring-themed mailing with home maintenance or local event tips",
      ],
    },
    {
      label: "Q3 (July - September)",
      strategy1Key: "q3Strategy1" as keyof QuarterlyMarketing,
      strategy2Key: "q3Strategy2" as keyof QuarterlyMarketing,
      examples: [
        "Place American flags in farm area for 4th of July",
        "Launch back-to-school supply drive",
      ],
    },
    {
      label: "Q4 (October - December)",
      strategy1Key: "q4Strategy1" as keyof QuarterlyMarketing,
      strategy2Key: "q4Strategy2" as keyof QuarterlyMarketing,
      examples: [
        "Send holiday cards or offer pie giveaway to past clients",
        "Run year-end gratitude campaign with thank-you calls or pop-by gifts",
      ],
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-3xl px-4 duration-700">
      {/* Step Header */}
      <div className="mb-8">
        <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
          Part 5F
        </span>
        <h2 className="mb-2 text-3xl font-extrabold text-slate-900">
          Quarterly Marketing Overview
        </h2>
        <p className="text-slate-600">
          Plan 2 marketing strategies for each quarter. This creates a year-long
          calendar of touchpoints that keeps you visible, relevant, and top-of-mind
          with your sphere and target audience.
        </p>
      </div>

      {/* DarrylTip */}
      <DarrylTip
        tip="Align your marketing with seasons, holidays, and local events. A summer BBQ invite feels natural in Q3, just like a pie giveaway fits Q4. Relevance increases response rates."
        className="mb-8"
      />

      {/* Quarterly Cards */}
      <div className="mb-8 space-y-6">
        {quarters.map((quarter) => (
          <div
            key={quarter.label}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            {/* Quarter Header */}
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-lg font-bold text-slate-900">{quarter.label}</h4>
            </div>

            {/* Example Ideas */}
            <div className="mb-4 rounded-lg bg-slate-50 p-3">
              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                Example Ideas:
              </p>
              <ul className="text-xs text-slate-600">
                {quarter.examples.map((example, idx) => (
                  <li key={idx} className="flex gap-1">
                    <span>•</span>
                    <span>{example}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Strategy Inputs */}
            <div className="space-y-4">
              <WorkbookTextarea
                label="Strategy 1"
                placeholder="Describe your first marketing strategy for this quarter..."
                rows={2}
                value={quarterlyMarketing[quarter.strategy1Key]}
                onChange={(val) =>
                  updateQuarterlyMarketing(quarter.strategy1Key, String(val || ""))
                }
              />
              <WorkbookTextarea
                label="Strategy 2"
                placeholder="Describe your second marketing strategy for this quarter..."
                rows={2}
                value={quarterlyMarketing[quarter.strategy2Key]}
                onChange={(val) =>
                  updateQuarterlyMarketing(quarter.strategy2Key, String(val || ""))
                }
              />
            </div>
          </div>
        ))}
      </div>

      {/* Up Next */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500">
          Up Next: Sign your commitment contract →
        </p>
      </div>
    </div>
  );
}
