"use client";

import { Calculator } from "lucide-react";
import { useBusinessPlanStore } from "@/stores/business-plan-store";
import { StepContainer, StepHeader, UpNextFooter } from "@/components/business-plan/ui";
import { PercentageInput } from "../ui/percentage-input";
import { CalculatedField } from "../ui/calculated-field";
import { SummaryCard } from "../ui/summary-card";

export function StepTaxCalculation() {
  const { incomePlanning, calculated, updateTaxRate } = useBusinessPlanStore();

  const taxRate = incomePlanning.estimatedTaxRate || 0;
  const taxDecimal = taxRate / 100;
  const afterTaxMultiplier = 1 - taxDecimal;

  return (
    <StepContainer>
      <StepHeader
        part="Parts 3C & 3D"
        title="Target Income & Taxes"
        highlightWord="Taxes"
        subtitle="Now we calculate how much you need to earn before taxes to achieve your take-home income goal."
        icon={Calculator}
      />

      {/* Part 3C: Target Take-Home Income */}
      <div className="mb-8 overflow-hidden rounded-3xl border-2 border-slate-100 bg-white">
        <div className="border-b border-slate-100 bg-[#e8f4f8]/30 px-6 py-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#1a2744]">
            Part 3C: Your Target Take-Home Income
          </h3>
        </div>
        <div className="p-6">
          <div className="mb-4 grid gap-4 md:grid-cols-2">
            <CalculatedField
              label="Annual Expenses"
              value={calculated.annualExpenses}
              format="currency"
              helpText="From Part 3A"
            />
            <CalculatedField
              label="Manifest Goals Total"
              value={calculated.manifestGoalsTotal}
              format="currency"
              helpText="From Part 3B"
            />
          </div>
          <CalculatedField
            label="Target Annual Take-Home Income"
            value={calculated.targetTakeHomeIncome}
            format="currency"
            highlight
            helpText="Annual Expenses + Manifest Goals"
          />
        </div>
      </div>

      {/* Part 3D: Accounting for Taxes */}
      <div className="mb-8 overflow-hidden rounded-3xl border-2 border-slate-100 bg-white">
        <div className="border-b border-slate-100 bg-[#e8f4f8]/30 px-6 py-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#1a2744]">
            Part 3D: Accounting for Taxes
          </h3>
        </div>
        <div className="p-6">
          <PercentageInput
            label="Your Estimated Tax Rate"
            value={incomePlanning.estimatedTaxRate}
            onChange={updateTaxRate}
            placeholder="25"
            helpText="Your combined federal, state, and local tax rate (e.g., enter 25 for 25%)"
            className="mb-6"
          />

          <div className="mb-4 rounded-2xl bg-slate-50 p-4">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-600">
              Calculation Breakdown
            </h4>
            <div className="space-y-2 font-mono text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Step 1: Tax Rate ÷ 100</span>
                <span className="font-medium text-slate-800">
                  {taxDecimal.toFixed(4)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Step 2: 1.0 - {taxDecimal.toFixed(2)}</span>
                <span className="font-medium text-slate-800">
                  {afterTaxMultiplier.toFixed(4)}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2">
                <span className="text-slate-600">
                  Step 3: Take-Home ÷ {afterTaxMultiplier.toFixed(2)}
                </span>
                <span className="font-bold text-slate-900">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 0,
                  }).format(calculated.annualTaxableIncomeNeeded)}
                </span>
              </div>
            </div>
          </div>

          <CalculatedField
            label="Annual Taxable Income Needed"
            value={calculated.annualTaxableIncomeNeeded}
            format="currency"
            highlight
          />
        </div>
      </div>

      <SummaryCard
        title="Pre-Tax Income Required"
        value={calculated.annualTaxableIncomeNeeded}
        format="currency"
        variant="primary"
        icon="trending"
      />

      <UpNextFooter text="Account for your broker's commission split to find your GCI goal" />
    </StepContainer>
  );
}
