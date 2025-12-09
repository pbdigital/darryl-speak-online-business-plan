"use client";

import { useBusinessPlanStore } from "@/stores/business-plan-store";
import { ExpenseTable } from "../ui/expense-table";
import { SummaryCard } from "../ui/summary-card";

export function StepPersonalExpenses() {
  const { incomePlanning, calculated, updatePersonalExpense } =
    useBusinessPlanStore();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-3xl px-4 duration-700">
      <div className="mb-8">
        <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
          Part 3A - Step 1 of 2
        </span>
        <h2 className="mb-2 text-3xl font-extrabold text-slate-900">
          Monthly Personal Expenses
        </h2>
        <p className="text-slate-600">
          Enter your monthly personal expenses. For annual items (like insurance
          premiums), divide by 12 to get the monthly amount.
        </p>
      </div>

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
        variant="info"
        icon="dollar"
      />

      <div className="mt-8 rounded-lg bg-amber-50 p-4">
        <p className="text-sm text-amber-800">
          <strong>Pro Tip:</strong> Be thorough and honest with your expenses.
          Underestimating here will throw off all your income calculations later.
        </p>
      </div>
    </div>
  );
}
