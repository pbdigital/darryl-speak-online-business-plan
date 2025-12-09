"use client";

import { useBusinessPlanStore } from "@/stores/business-plan-store";
import { PercentageInput } from "../ui/percentage-input";
import { CurrencyInput } from "../ui/currency-input";
import { CalculatedField } from "../ui/calculated-field";
import { SummaryCard } from "../ui/summary-card";

export function StepGciGoal() {
  const { incomePlanning, calculated, updateBrokerSplit, updateBrokerCap } =
    useBusinessPlanStore();

  const brokerSplit = incomePlanning.brokerSplitPercentage || 0;
  const brokerSplitDecimal = brokerSplit / 100;
  const agentShare = 1 - brokerSplitDecimal;
  const hasCap = (incomePlanning.brokerCapAmount || 0) > 0;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-3xl px-4 duration-700">
      <div className="mb-8">
        <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
          Part 3E
        </span>
        <h2 className="mb-2 text-3xl font-extrabold text-slate-900">
          Calculating Your GCI Goal
        </h2>
        <p className="text-slate-600">
          Your Gross Commission Income (GCI) goal accounts for your
          broker&apos;s split of your commissions.
        </p>
      </div>

      {/* Step 1: Broker's Commission Split */}
      <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-700">
          Step 1: Broker&apos;s Commission Split
        </h3>

        <PercentageInput
          label="Your Broker's Commission Split"
          value={incomePlanning.brokerSplitPercentage}
          onChange={updateBrokerSplit}
          placeholder="30"
          helpText="The percentage your broker takes (e.g., enter 30 for a 70/30 split where you keep 70%)"
          className="mb-6"
        />

        <div className="mb-4 rounded-lg bg-slate-50 p-4">
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-600">
            Calculation Breakdown
          </h4>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Step 1: Split ÷ 100</span>
              <span className="font-medium text-slate-800">
                {brokerSplitDecimal.toFixed(4)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">
                Step 2: Your Share (1.0 - {brokerSplitDecimal.toFixed(2)})
              </span>
              <span className="font-medium text-slate-800">
                {agentShare.toFixed(4)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Taxable Income Needed</span>
              <span className="font-medium text-slate-800">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                }).format(calculated.annualTaxableIncomeNeeded)}
              </span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2">
              <span className="text-slate-600">
                Step 3: Taxable Income ÷ {agentShare.toFixed(2)}
              </span>
              <span className="font-bold text-slate-900">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 0,
                }).format(calculated.gciNeeded)}
              </span>
            </div>
          </div>
        </div>

        <CalculatedField
          label="GCI Needed (Before Broker Split)"
          value={calculated.gciNeeded}
          format="currency"
          highlight={!hasCap}
        />
      </div>

      {/* Step 2: Broker's Cap (Optional) */}
      <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-700">
          Step 2: Broker&apos;s Cap (Optional)
        </h3>
        <p className="mb-4 text-sm text-slate-600">
          If your broker has a commission cap (a maximum amount they take before
          you keep 100%), enter it below. Leave blank or enter 0 if you
          don&apos;t have a cap.
        </p>

        <CurrencyInput
          label="Broker's Capped Commission Amount"
          value={incomePlanning.brokerCapAmount}
          onChange={updateBrokerCap}
          placeholder="0"
          className="mb-6"
        />

        {hasCap && (
          <div className="rounded-lg bg-blue-50 p-4">
            <p className="mb-2 text-sm text-blue-800">
              <strong>With Cap Applied:</strong> Your adjusted GCI equals the
              broker&apos;s cap plus your taxable income needed.
            </p>
            <CalculatedField
              label="Adjusted GCI Needed"
              value={calculated.adjustedGciNeeded}
              format="currency"
              highlight
            />
          </div>
        )}
      </div>

      <SummaryCard
        title="Your GCI Goal"
        value={hasCap ? calculated.adjustedGciNeeded : calculated.gciNeeded}
        format="currency"
        variant="primary"
        icon="trending"
      />

      <div className="mt-8 rounded-lg bg-blue-50 p-4">
        <p className="text-sm text-blue-800">
          <strong>What&apos;s Next:</strong> Now that we know your GCI goal,
          we&apos;ll calculate how many transactions you need to reach it.
        </p>
      </div>
    </div>
  );
}
