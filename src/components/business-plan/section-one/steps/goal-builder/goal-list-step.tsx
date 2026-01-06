"use client";

import { Target, Plus, X } from "lucide-react";
import { useSectionOneStore } from "@/stores/section-one-store";
import { StepContainer, StepHeader } from "../../ui";
import { DarrylTip } from "@/components/business-plan/ui/darryl-tip";

export function GoalListStep() {
  const goals = useSectionOneStore((state) => state.data.goals) ?? [];
  const addGoal = useSectionOneStore((state) => state.addGoal);
  const removeGoal = useSectionOneStore((state) => state.removeGoal);
  const updateGoal = useSectionOneStore((state) => state.updateGoal);

  const canAddMore = goals.length < 10;

  const handleAddGoal = () => {
    if (canAddMore) {
      addGoal();
    }
  };

  const handleRemoveGoal = (id: string) => {
    if (goals.length > 1) {
      removeGoal(id);
    }
  };

  const handleTitleChange = (id: string, value: string) => {
    updateGoal(id, "title", value);
  };

  return (
    <StepContainer>
      <StepHeader
        part="Part 1E"
        title="Your Goals for the Next 12 Months"
        highlightWord="Goals"
        subtitle="What do you want to achieve in the next 12 months? List your top goals—personal, professional, health, or relationships."
        icon={Target}
      />

      <DarrylTip
        tip="Start with 3-5 meaningful goals. Quality beats quantity. Each goal you add here will get its own breakdown page when you click Next Step."
        className="mb-10"
      />

      <div className="mb-8">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-600">
          What are your top goals for the next 12 months?
        </h3>

        <div className="space-y-3">
          {goals.map((goal, index) => (
            <div
              key={goal.id}
              className="group flex items-center gap-3 rounded-xl border-2 border-slate-100 bg-white p-2 transition-all hover:border-slate-200 focus-within:border-[#1a2744] focus-within:shadow-lg"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e8f4f8] text-sm font-bold text-[#1a2744]">
                {index + 1}
              </span>
              <input
                type="text"
                value={goal.title}
                onChange={(e) => handleTitleChange(goal.id, e.target.value)}
                placeholder={`Goal ${index + 1} (e.g., Close 30 transactions)`}
                className="flex-1 bg-transparent py-2 text-base font-medium text-slate-800 outline-none placeholder:text-slate-400"
              />
              {goals.length > 1 && (
                <button
                  onClick={() => handleRemoveGoal(goal.id)}
                  className="shrink-0 rounded-lg p-2 text-slate-300 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                  aria-label="Remove goal"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {canAddMore && (
          <button
            onClick={handleAddGoal}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-4 text-sm font-medium text-slate-500 transition-all hover:border-[#1a2744] hover:bg-[#e8f4f8] hover:text-[#1a2744]"
          >
            <Plus className="h-4 w-4" />
            Add another goal
          </button>
        )}

        {goals.length === 0 && (
          <button
            onClick={handleAddGoal}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-8 text-sm font-medium text-slate-500 transition-all hover:border-[#1a2744] hover:bg-[#e8f4f8] hover:text-[#1a2744]"
          >
            <Plus className="h-4 w-4" />
            Add your first goal
          </button>
        )}
      </div>
    </StepContainer>
  );
}
