"use client";

import { Briefcase } from "lucide-react";
import { useBusinessPlanStore } from "@/stores/business-plan-store";
import { StepContainer, StepHeader, DarrylTip, UpNextFooter } from "@/components/business-plan/ui";
import { ExpenseTable } from "../ui/expense-table";
import { SummaryCard } from "../ui/summary-card";
import { CalculatedField } from "../ui/calculated-field";

export function StepBusinessExpenses() {
  const { incomePlanning, calculated, updateBusinessExpense } =
    useBusinessPlanStore();

  return (
    <StepContainer>
      <StepHeader
        part="Part 3A - Step 2 of 2"
        title="Monthly Business Expenses"
        highlightWord="Business"
        subtitle="Enter your monthly business expenses. For annual items like Board Dues or E&O Insurance, divide by 12."
        icon={Briefcase}
      />

      <DarrylTip
        tip="Don't forget annual expenses like Board Dues and E&O Insurance - divide those by 12 to get your monthly amount. These add up fast!"
        className="mb-8"
      />

      <ExpenseTable
        expenses={incomePlanning.businessExpenses}
        onUpdate={updateBusinessExpense}
        totalLabel="Monthly Business Total"
        total={calculated.monthlyBusinessTotal}
        className="mb-8"
      />

      <div className="mb-6 overflow-hidden rounded-3xl border-2 border-slate-100 bg-white">
        <div className="border-b border-slate-100 bg-[#e8f4f8]/30 px-6 py-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#1a2744]">
            Part 3A Summary - Total Annual Expenses
          </h3>
        </div>
        <div className="grid gap-4 p-6 md:grid-cols-2">
          <CalculatedField
            label="Monthly Personal Total"
            value={calculated.monthlyPersonalTotal}
            format="currency"
          />
          <CalculatedField
            label="Monthly Business Total"
            value={calculated.monthlyBusinessTotal}
            format="currency"
          />
          <CalculatedField
            label="Combined Monthly Total"
            value={calculated.combinedMonthlyTotal}
            format="currency"
          />
          <CalculatedField
            label="Annual Expenses (×12)"
            value={calculated.annualExpenses}
            format="currency"
            highlight
          />
        </div>
      </div>

      <SummaryCard
        title="Your Annual Expenses"
        value={calculated.annualExpenses}
        format="currency"
        variant="primary"
        icon="dollar"
      />

      <UpNextFooter text="Create your Manifest List of goals and dreams" />
    </StepContainer>
  );
}
