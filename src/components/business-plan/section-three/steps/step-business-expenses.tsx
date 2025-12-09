"use client";

import { useBusinessPlanStore } from "@/stores/business-plan-store";
import { ExpenseTable } from "../ui/expense-table";
import { SummaryCard } from "../ui/summary-card";
import { CalculatedField } from "../ui/calculated-field";
import { DarrylTip } from "../ui/darryl-tip";

export function StepBusinessExpenses() {
  const { incomePlanning, calculated, updateBusinessExpense } =
    useBusinessPlanStore();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-3xl px-4 duration-700">
      <div className="mb-8">
        <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
          Part 3A - Step 2 of 2
        </span>
        <h2 className="mb-2 text-3xl font-extrabold text-slate-900">
          Monthly Business Expenses
        </h2>
        <p className="text-slate-600">
          Enter your monthly business expenses. For annual items like Board Dues
          or E&O Insurance, divide by 12.
        </p>
      </div>

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

      <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-700">
          Part 3A Summary - Total Annual Expenses
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
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
    </div>
  );
}
