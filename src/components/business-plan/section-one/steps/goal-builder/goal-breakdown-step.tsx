"use client";

import { Target, Shield, Lightbulb } from "lucide-react";
import { useSectionOneStore, type Goal } from "@/stores/section-one-store";
import { StepContainer, StepHeader, WorkbookTextarea } from "../../ui";
import { cn } from "@/lib/utils";

interface GoalBreakdownStepProps {
  goalId: string;
  goalIndex: number;
  totalGoals: number;
}

export function GoalBreakdownStep({
  goalId,
  goalIndex,
  totalGoals,
}: GoalBreakdownStepProps) {
  const goal = useSectionOneStore((state) =>
    state.data.goals.find((g) => g.id === goalId)
  );
  const updateGoal = useSectionOneStore((state) => state.updateGoal);
  const updateGoalImmediateStep = useSectionOneStore(
    (state) => state.updateGoalImmediateStep
  );

  if (!goal) {
    return null;
  }

  const handleFieldChange = (
    field: keyof Omit<Goal, "id" | "immediateSteps">,
    value: string
  ) => {
    updateGoal(goalId, field, value);
  };

  const handleStepChange = (stepIndex: number, value: string) => {
    updateGoalImmediateStep(goalId, stepIndex, value);
  };

  return (
    <StepContainer>
      {/* Progress indicator */}
      <div className="mb-6 flex items-center justify-center gap-2">
        {Array.from({ length: totalGoals }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-2 w-8 rounded-full transition-all",
              i === goalIndex
                ? "bg-[#1a2744]"
                : i < goalIndex
                  ? "bg-emerald-400"
                  : "bg-slate-200"
            )}
          />
        ))}
      </div>

      <StepHeader
        part={`Goal ${goalIndex + 1} of ${totalGoals}`}
        title={goal.title || `Goal ${goalIndex + 1}`}
        highlightWord={goal.title.split(" ")[0] || "Goal"}
        subtitle="Let's break down this goal into an actionable plan"
        icon={Target}
      />

      {/* Why Important */}
      <section className="mb-10">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f4f8]">
            <Lightbulb className="h-5 w-5 text-[#1a2744]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Your Why</h2>
            <p className="text-sm text-slate-500">Connect to your deeper motivation</p>
          </div>
        </div>

        <div className="space-y-6">
          <GoalTextarea
            label="Why is this goal important to you?"
            value={goal.whyImportant}
            onChange={(v) => handleFieldChange("whyImportant", v)}
            placeholder="This goal matters because... It will allow me to..."
          />

          <GoalTextarea
            label="How do you plan to achieve this?"
            value={goal.howToAchieve}
            onChange={(v) => handleFieldChange("howToAchieve", v)}
            placeholder="My approach will be... I'll focus on..."
          />
        </div>
      </section>

      {/* Immediate Steps */}
      <section className="mb-10">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f4f8]">
            <Target className="h-5 w-5 text-[#1a2744]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Immediate Actions</h2>
            <p className="text-sm text-slate-500">What can you do right away?</p>
          </div>
        </div>

        <p className="mb-4 text-sm text-slate-600">
          What are 1-3 steps you can take right away to work towards this goal?
        </p>

        <div className="space-y-3">
          {goal.immediateSteps.map((step, stepIndex) => (
            <div
              key={stepIndex}
              className="flex items-center gap-3 rounded-xl border-2 border-slate-100 bg-white p-3 transition-all focus-within:border-[#1a2744] focus-within:shadow-md"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#e8f4f8] text-sm font-bold text-[#1a2744]">
                {stepIndex + 1}
              </span>
              <input
                type="text"
                value={step}
                onChange={(e) => handleStepChange(stepIndex, e.target.value)}
                placeholder={
                  stepIndex === 0
                    ? "First step I'll take..."
                    : stepIndex === 1
                      ? "Then I'll..."
                      : "Optional: another step..."
                }
                className="flex-1 bg-transparent py-1 text-base text-slate-800 outline-none placeholder:text-slate-400"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Obstacles & Strategies */}
      <section className="mb-10">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f4f8]">
            <Shield className="h-5 w-5 text-[#1a2744]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Obstacles & Strategies</h2>
            <p className="text-sm text-slate-500">Prepare for challenges</p>
          </div>
        </div>

        <div className="space-y-6">
          <GoalTextarea
            label="What obstacles might get in your way?"
            value={goal.obstacles}
            onChange={(v) => handleFieldChange("obstacles", v)}
            placeholder="Challenges I might face include..."
          />

          <GoalTextarea
            label="What strategies will you use to overcome them?"
            value={goal.strategies}
            onChange={(v) => handleFieldChange("strategies", v)}
            placeholder="To overcome these obstacles, I will..."
          />
        </div>
      </section>
    </StepContainer>
  );
}

// Internal textarea component for goal fields
interface GoalTextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function GoalTextarea({ label, value, onChange, placeholder }: GoalTextareaProps) {
  const hasContent = value.trim().length > 0;

  return (
    <div className="group">
      <label
        className={cn(
          "mb-2 block text-sm font-bold uppercase tracking-wide transition-colors",
          hasContent
            ? "text-emerald-700"
            : "text-slate-700 group-focus-within:text-[#1a2744]"
        )}
      >
        {label}
        {hasContent && (
          <svg
            className="ml-2 inline h-3 w-3 text-emerald-500"
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
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className={cn(
          "w-full resize-none rounded-xl border-2 bg-white px-4 py-3 text-base text-slate-800 outline-none transition-all placeholder:text-slate-400",
          hasContent
            ? "border-emerald-200 focus:border-emerald-400"
            : "border-slate-100 focus:border-[#1a2744] focus:shadow-lg"
        )}
      />
    </div>
  );
}
