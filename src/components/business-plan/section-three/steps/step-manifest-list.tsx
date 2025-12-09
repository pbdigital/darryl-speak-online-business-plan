"use client";

import { useBusinessPlanStore } from "@/stores/business-plan-store";
import { GoalTable } from "../ui/goal-table";
import { SummaryCard } from "../ui/summary-card";

export function StepManifestList() {
  const { incomePlanning, calculated, updateGoal } = useBusinessPlanStore();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-3xl px-4 duration-700">
      <div className="mb-8">
        <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
          Part 3B
        </span>
        <h2 className="mb-2 text-3xl font-extrabold text-slate-900">
          Your Manifest List
        </h2>
        <p className="text-slate-600">
          Beyond covering your basic expenses, what else do you desire this
          year? Dream big and put a dollar amount on each goal.
        </p>
      </div>

      <div className="space-y-8">
        <GoalTable
          goals={incomePlanning.familyGoals}
          category="familyGoals"
          onUpdate={(index, field, value) =>
            updateGoal("familyGoals", index, field, value)
          }
          title="Family Goals"
        />

        <GoalTable
          goals={incomePlanning.financialGoals}
          category="financialGoals"
          onUpdate={(index, field, value) =>
            updateGoal("financialGoals", index, field, value)
          }
          title="Financial Goals"
        />

        <GoalTable
          goals={incomePlanning.personalGoals}
          category="personalGoals"
          onUpdate={(index, field, value) =>
            updateGoal("personalGoals", index, field, value)
          }
          title="Personal Goals"
        />

        <GoalTable
          goals={incomePlanning.businessGoals}
          category="businessGoals"
          onUpdate={(index, field, value) =>
            updateGoal("businessGoals", index, field, value)
          }
          title="Business Goals"
        />
      </div>

      <div className="mt-8">
        <SummaryCard
          title="Total Cost of Your Manifest List"
          value={calculated.manifestGoalsTotal}
          format="currency"
          variant="success"
          icon="target"
        />
      </div>

      <div className="mt-8 rounded-lg bg-emerald-50 p-4">
        <p className="text-sm text-emerald-800">
          <strong>Remember:</strong> These goals are in addition to your basic
          living expenses. They represent the life you want to create beyond
          just getting by.
        </p>
      </div>
    </div>
  );
}
