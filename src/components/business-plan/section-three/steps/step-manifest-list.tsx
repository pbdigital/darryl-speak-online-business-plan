"use client";

import { Sparkles } from "lucide-react";
import { useBusinessPlanStore } from "@/stores/business-plan-store";
import { StepContainer, StepHeader, DarrylTip, UpNextFooter } from "@/components/business-plan/ui";
import { GoalTable } from "../ui/goal-table";
import { SummaryCard } from "../ui/summary-card";

export function StepManifestList() {
  const { incomePlanning, calculated, updateGoal } = useBusinessPlanStore();

  return (
    <StepContainer>
      <StepHeader
        part="Part 3B"
        title="Your Manifest List"
        highlightWord="Manifest"
        subtitle="Beyond covering your expenses, what do you want to accomplish in 2026? Be specific and honest. This is your WHY."
        icon={Sparkles}
      />

      <DarrylTip
        tip="These are your dreams and goals—the life you want to build. Don't hold back! Now let's calculate what it takes to make them real."
        className="mb-8"
      />

      <div className="space-y-8">
        <GoalTable
          goals={incomePlanning.familyGoals}
          category="familyGoals"
          onUpdate={(index, field, value) =>
            updateGoal("familyGoals", index, field, value)
          }
          title="Family Goals"
          description="What do you want to do with or for your family? Examples: Family vacation ($5,000), Weekly date nights ($5,200), New home down payment ($50,000)"
        />

        <GoalTable
          goals={incomePlanning.financialGoals}
          category="financialGoals"
          onUpdate={(index, field, value) =>
            updateGoal("financialGoals", index, field, value)
          }
          title="Financial Goals"
          description="What financial milestones do you want to hit? Examples: Pay off $8,000 credit card debt, Build $12,000 emergency fund, Invest $1,000/month ($12,000)"
        />

        <GoalTable
          goals={incomePlanning.personalGoals}
          category="personalGoals"
          onUpdate={(index, field, value) =>
            updateGoal("personalGoals", index, field, value)
          }
          title="Personal Goals"
          description="What do you want for yourself? Examples: Personal trainer ($6,000), New wardrobe ($3,000), Masters degree program ($15,000)"
        />

        <GoalTable
          goals={incomePlanning.businessGoals}
          category="businessGoals"
          onUpdate={(index, field, value) =>
            updateGoal("businessGoals", index, field, value)
          }
          title="Business Goals"
          description="What investments in your business do you want to make? Examples: Hire part-time assistant ($24,000), Upgrade website ($3,000), Better CRM ($2,400)"
        />
      </div>

      <div className="mt-8">
        <SummaryCard
          title="Total Cost of Your Manifest List"
          value={calculated.manifestGoalsTotal}
          format="currency"
          variant="primary"
          icon="target"
        />

        <UpNextFooter text="Calculate your target income and account for taxes" />
      </div>
    </StepContainer>
  );
}
