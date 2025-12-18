"use client";

import { useState } from "react";
import { Target, ChevronLeft, ChevronDown, ChevronUp, Check, Pencil } from "lucide-react";
import { useSectionOneStore } from "@/stores/section-one-store";
import { StepContainer, StepHeader } from "../../ui";
import { UpNextFooter } from "@/components/business-plan/ui/up-next-footer";
import { cn } from "@/lib/utils";
import { CURRENT_PLAN_YEAR } from "@/lib/constants";

interface GoalSummaryStepProps {
  onBack: () => void;
  onEditGoal: (index: number) => void;
}

export function GoalSummaryStep({ onBack, onEditGoal }: GoalSummaryStepProps) {
  const goals = useSectionOneStore((state) => state.data.goals) ?? [];
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);

  const validGoals = goals.filter((g) => g.title.trim() !== "");

  const toggleExpand = (id: string) => {
    setExpandedGoal(expandedGoal === id ? null : id);
  };

  const isGoalComplete = (goal: typeof goals[0]) => {
    return (
      goal.title.trim() !== "" &&
      goal.whyImportant.trim() !== "" &&
      goal.howToAchieve.trim() !== "" &&
      goal.immediateSteps.some((s) => s.trim() !== "")
    );
  };

  return (
    <StepContainer>
      <StepHeader
        part="Part 1E"
        title={`Your ${CURRENT_PLAN_YEAR} Goals`}
        highlightWord="Goals"
        subtitle="Review your goals and their action plans. Click any goal to see details."
        icon={Target}
      />

      <div className="mb-8 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 text-white">
            <Check className="h-6 w-6" strokeWidth={3} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-emerald-800">
              {validGoals.length} Goal{validGoals.length !== 1 ? "s" : ""} Defined
            </h3>
            <p className="text-sm text-emerald-700">
              All goals broken down with action plans
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8 space-y-3">
        {validGoals.map((goal, index) => {
          const isExpanded = expandedGoal === goal.id;
          const isComplete = isGoalComplete(goal);

          return (
            <div
              key={goal.id}
              className={cn(
                "overflow-hidden rounded-xl border-2 transition-all",
                isExpanded
                  ? "border-[#1a2744] shadow-lg"
                  : "border-slate-100 hover:border-slate-200"
              )}
            >
              {/* Goal Header */}
              <button
                onClick={() => toggleExpand(goal.id)}
                className="flex w-full items-center gap-3 p-4 text-left"
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    isComplete ? "bg-emerald-100" : "bg-[#e8f4f8]"
                  )}
                >
                  {isComplete ? (
                    <Check className="h-4 w-4 text-emerald-600" strokeWidth={3} />
                  ) : (
                    <span className="text-sm font-bold text-[#1a2744]">
                      {index + 1}
                    </span>
                  )}
                </div>
                <span className="flex-1 font-medium text-slate-800">
                  {goal.title}
                </span>
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-slate-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-400" />
                )}
              </button>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="border-t border-slate-100 bg-slate-50/50 px-4 pb-4 pt-3">
                  {goal.whyImportant && (
                    <div className="mb-3">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                        Why It Matters
                      </p>
                      <p className="text-sm text-slate-700">{goal.whyImportant}</p>
                    </div>
                  )}

                  {goal.howToAchieve && (
                    <div className="mb-3">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                        How to Achieve
                      </p>
                      <p className="text-sm text-slate-700">{goal.howToAchieve}</p>
                    </div>
                  )}

                  {goal.immediateSteps.some((s) => s.trim() !== "") && (
                    <div className="mb-3">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                        Immediate Steps
                      </p>
                      <ul className="ml-4 list-disc text-sm text-slate-700">
                        {goal.immediateSteps
                          .filter((s) => s.trim() !== "")
                          .map((step, i) => (
                            <li key={i}>{step}</li>
                          ))}
                      </ul>
                    </div>
                  )}

                  {goal.obstacles && (
                    <div className="mb-3">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                        Potential Obstacles
                      </p>
                      <p className="text-sm text-slate-700">{goal.obstacles}</p>
                    </div>
                  )}

                  {goal.strategies && (
                    <div className="mb-3">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                        Strategies to Overcome
                      </p>
                      <p className="text-sm text-slate-700">{goal.strategies}</p>
                    </div>
                  )}

                  <button
                    onClick={() => onEditGoal(index)}
                    className="mt-2 flex items-center gap-1 text-xs font-medium text-[#1a2744] transition-colors hover:text-blue-700"
                  >
                    <Pencil className="h-3 w-3" />
                    Edit this goal
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-6">
        <button
          onClick={onBack}
          className="group flex items-center gap-1 py-3 text-xs font-bold uppercase tracking-widest text-slate-400 transition-colors hover:text-slate-600"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Last Goal
        </button>

        <button
          onClick={() => onEditGoal(-1)}
          className="text-xs font-medium text-slate-500 transition-colors hover:text-[#1a2744]"
        >
          + Add More Goals
        </button>
      </div>

      <UpNextFooter text="Self-care and growth" />
    </StepContainer>
  );
}
