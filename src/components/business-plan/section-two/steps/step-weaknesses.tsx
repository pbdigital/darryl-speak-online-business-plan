"use client";

import { AlertTriangle } from "lucide-react";
import { useSectionTwoStore } from "@/stores/section-two-store";
import { WeaknessActionSelector } from "../ui";
import {
  StepContainer,
  StepHeader,
  UpNextFooter,
  DarrylTip,
} from "@/components/business-plan/ui";
import { cn } from "@/lib/utils";

const weaknessPlaceholders = [
  "Inconsistent follow-up with leads",
  "Difficulty saying no to clients",
  "Procrastination on prospecting",
  "Weak listing presentation skills",
  "Poor time management",
  "Uncomfortable with cold calling",
  "Limited technology skills",
  "Trouble delegating tasks",
];

export function StepWeaknesses() {
  const weaknesses = useSectionTwoStore((state) => state.data.weaknesses);
  const updateWeakness = useSectionTwoStore((state) => state.updateWeakness);
  const updateWeaknessAction = useSectionTwoStore(
    (state) => state.updateWeaknessAction
  );

  const filledCount = weaknesses.filter((w) => w.weakness.trim()).length;

  return (
    <StepContainer>
      <StepHeader
        part="Part 2B"
        title="Your Weaknesses"
        highlightWord="Weaknesses"
        subtitle="Identify areas for improvement and decide whether to accept, delegate, or work on them. Honest self-assessment is key to growth."
        icon={AlertTriangle}
      />

      <DarrylTip
        tip="Admitting weakness takes courage, but it's where real growth begins. You don't have to fix everything—sometimes the smartest move is to delegate or accept and work around it."
        className="mb-8"
      />

      {/* Progress Indicator */}
      <div className="mb-8 flex items-center justify-between rounded-xl bg-slate-50 px-6 py-4">
        <span className="text-sm font-medium text-slate-700">
          {filledCount} of 8 weaknesses identified
        </span>
        <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-[#1a2744] transition-all duration-300"
            style={{ width: `${(filledCount / 8) * 100}%` }}
          />
        </div>
      </div>

      {/* Weaknesses Rows */}
      <div className="relative mb-10 overflow-hidden rounded-3xl border-2 border-slate-100 bg-white shadow-lg">
        <div className="p-6 md:p-8">
          {weaknesses.map((item, index) => {
            const hasContent = item.weakness.trim().length > 0;
            const isComplete = hasContent && item.action !== null;

            return (
              <div
                key={index}
                className={cn(
                  "group relative border-b border-slate-100 py-6 transition-colors last:border-b-0",
                  "hover:bg-slate-50/50"
                )}
              >
                <div className="flex gap-4 md:gap-6">
                  {/* Row Number Indicator */}
                  <div
                    className={cn(
                      "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors",
                      isComplete
                        ? "bg-slate-700 text-white"
                        : hasContent
                          ? "bg-slate-300 text-slate-700"
                          : "bg-slate-100 text-slate-500"
                    )}
                  >
                    {isComplete ? (
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>

                  {/* Input Fields */}
                  <div className="flex flex-1 flex-col gap-4 md:flex-row md:gap-6">
                    {/* Weakness Field */}
                    <div className="flex-1">
                      <label
                        className={cn(
                          "mb-2 block text-xs font-bold uppercase tracking-wide transition-colors",
                          hasContent ? "text-slate-700" : "text-slate-500"
                        )}
                      >
                        Weakness
                        {hasContent && (
                          <svg
                            className="ml-1.5 inline h-3 w-3 text-slate-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </label>
                      <input
                        type="text"
                        value={item.weakness}
                        onChange={(e) => updateWeakness(index, e.target.value)}
                        placeholder={weaknessPlaceholders[index]}
                        className={cn(
                          "w-full border-b-2 bg-transparent py-2 text-base font-medium text-slate-800 outline-none transition-all duration-300 placeholder:text-slate-300",
                          hasContent
                            ? "border-slate-400"
                            : "border-slate-200 focus:border-[#1a2744]"
                        )}
                      />
                    </div>

                    {/* Action Selector */}
                    <div className="md:w-64">
                      <WeaknessActionSelector
                        value={item.action}
                        onChange={(action) =>
                          updateWeaknessAction(index, action)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="rounded-xl border-2 border-slate-100 bg-slate-50 p-6">
        <h4 className="mb-4 text-xs font-bold uppercase tracking-wide text-slate-700">
          Action Guide
        </h4>
        <div className="grid gap-3 text-sm md:grid-cols-3">
          <div className="flex items-start gap-2">
            <span className="mt-0.5 rounded bg-slate-200 px-2 py-0.5 text-xs font-bold text-slate-700">
              Accept
            </span>
            <span className="text-slate-600">
              Acknowledge and work around it
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="mt-0.5 rounded bg-slate-200 px-2 py-0.5 text-xs font-bold text-slate-700">
              Delegate
            </span>
            <span className="text-slate-600">Assign to someone else</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="mt-0.5 rounded bg-slate-200 px-2 py-0.5 text-xs font-bold text-slate-700">
              Improve
            </span>
            <span className="text-slate-600">Work on getting better</span>
          </div>
        </div>
      </div>

      <UpNextFooter text="Discover your opportunities" />
    </StepContainer>
  );
}
