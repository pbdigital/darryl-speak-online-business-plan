"use client";

import { Wallet } from "lucide-react";
import { useBusinessPlanStore } from "@/stores/business-plan-store";
import { StepContainer, StepHeader, DarrylTip, UpNextFooter } from "@/components/business-plan/ui";
import { ExpenseTable } from "../ui/expense-table";
import { SummaryCard } from "../ui/summary-card";

export function StepPersonalExpenses() {
  const { incomePlanning, calculated, updatePersonalExpense } =
    useBusinessPlanStore();

  return (
    <StepContainer>
      <StepHeader
        part="Part 3A - Step 1 of 2"
        title="Monthly Personal Expenses"
        highlightWord="Personal"
        subtitle="Enter your monthly personal expenses. For annual items (like insurance premiums), divide by 12 to get the monthly amount."
        icon={Wallet}
      />

      <DarrylTip
        tip="Be thorough and honest with your expenses. Underestimating here will throw off all your income calculations later."
        className="mb-8"
      />

      <ExpenseTable
        expenses={incomePlanning.personalExpenses}
        onUpdate={updatePersonalExpense}
        totalLabel="Monthly Personal Total"
        total={calculated.monthlyPersonalTotal}
        className="mb-8"
      />

      <SummaryCard
        title="Your Monthly Personal Expenses"
        value={calculated.monthlyPersonalTotal}
        format="currency"
        variant="primary"
        icon="dollar"
      />

      <UpNextFooter text="Enter your monthly business expenses" />
    </StepContainer>
  );
}
