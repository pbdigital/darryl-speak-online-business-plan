"use client";

import { Calendar } from "lucide-react";
import { useSectionFiveStore } from "@/stores/section-five-store";
import {
  StepContainer,
  StepHeader,
  UpNextFooter,
  PremiumTextarea,
  DarrylTip,
} from "@/components/business-plan/ui";
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
    <StepContainer>
      <StepHeader
        part="Part 5F"
        title="Quarterly Marketing Overview"
        highlightWord="Quarterly"
        subtitle="Plan 2 marketing strategies for each quarter to create a year-long calendar of touchpoints that keeps you visible and top-of-mind."
        icon={Calendar}
      />

      <DarrylTip
        tip="Align your marketing with seasons, holidays, and local events. A summer BBQ invite feels natural in Q3, just like a pie giveaway fits Q4. Relevance increases response rates."
        className="mb-8"
      />

      {/* Quarterly Cards */}
      <div className="mb-8 space-y-6">
        {quarters.map((quarter, qIndex) => (
          <div
            key={quarter.label}
            className="rounded-3xl border-2 border-slate-100 bg-white p-6 shadow-sm"
          >
            {/* Quarter Header */}
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1a2744] text-sm font-bold text-white">
                Q{qIndex + 1}
              </span>
              <h4 className="text-lg font-bold text-slate-900">{quarter.label}</h4>
            </div>

            {/* Example Ideas */}
            <div className="mb-4 rounded-2xl bg-[#e8f4f8]/30 p-3">
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
              <PremiumTextarea
                number={1}
                label="Strategy 1"
                placeholder="Describe your first marketing strategy for this quarter..."
                value={quarterlyMarketing[quarter.strategy1Key]}
                onChange={(val) =>
                  updateQuarterlyMarketing(quarter.strategy1Key, val)
                }
                minHeight={80}
                maxHeight={200}
              />
              <PremiumTextarea
                number={2}
                label="Strategy 2"
                placeholder="Describe your second marketing strategy for this quarter..."
                value={quarterlyMarketing[quarter.strategy2Key]}
                onChange={(val) =>
                  updateQuarterlyMarketing(quarter.strategy2Key, val)
                }
                minHeight={80}
                maxHeight={200}
              />
            </div>
          </div>
        ))}
      </div>

      <UpNextFooter text="Sign your commitment contract" />
    </StepContainer>
  );
}
