"use client";

import { AlertCircle } from "lucide-react";
import { useSectionTwoStore } from "@/stores/section-two-store";
import { WeaknessActionSelector } from "../ui";
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
    <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-3xl px-4 duration-700">
      {/* Step Header */}
      <div className="mb-12 text-center">
        <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-amber-600">
          Step 2 of 5
        </span>
        <h2 className="mb-2 flex items-center justify-center gap-3 text-3xl font-extrabold text-slate-900">
          <AlertCircle className="h-8 w-8 text-amber-500" />
          Weaknesses
        </h2>
        <p className="mx-auto max-w-xl text-slate-500">
          Identify areas for improvement and decide whether to accept, delegate,
          or work on them.
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8 flex items-center justify-between rounded-xl bg-amber-50 px-6 py-4">
        <span className="text-sm font-medium text-amber-700">
          {filledCount} of 8 weaknesses identified
        </span>
        <div className="h-2 w-32 overflow-hidden rounded-full bg-amber-200">
          <div
            className="h-full rounded-full bg-amber-500 transition-all duration-300"
            style={{ width: `${(filledCount / 8) * 100}%` }}
          />
        </div>
      </div>

      {/* Weaknesses Rows */}
      <div className="relative mb-10 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-lg">
        {/* Decorative corner */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-bl-full bg-amber-50" />

        <div className="relative z-10 p-6 md:p-8">
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
                        ? "bg-emerald-100 text-emerald-700"
                        : hasContent
                          ? "bg-amber-100 text-amber-700"
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
                          hasContent ? "text-emerald-700" : "text-slate-500"
                        )}
                      >
                        Weakness
                        {hasContent && (
                          <svg
                            className="ml-1.5 inline h-3 w-3 text-emerald-500"
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
                            ? "border-emerald-400"
                            : "border-slate-200 focus:border-slate-900"
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
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
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
    </div>
  );
}
