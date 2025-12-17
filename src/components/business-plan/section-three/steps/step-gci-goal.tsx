"use client";

import { TrendingUp } from "lucide-react";
import { useBusinessPlanStore } from "@/stores/business-plan-store";
import { StepContainer, StepHeader, UpNextFooter } from "@/components/business-plan/ui";
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
    <StepContainer>
      <StepHeader
        part="Part 3E"
        title="Calculating Your GCI Goal"
        highlightWord="GCI"
        subtitle="Your Gross Commission Income (GCI) goal accounts for your broker's split of your commissions."
        icon={TrendingUp}
      />

      {/* Step 1: Broker's Commission Split */}
      <div className="mb-8 overflow-hidden rounded-3xl border-2 border-slate-100 bg-white">
        <div className="border-b border-slate-100 bg-[#e8f4f8]/30 px-6 py-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#1a2744]">
            Step 1: Broker&apos;s Commission Split
          </h3>
        </div>
        <div className="p-6">
          <PercentageInput
            label="Your Broker's Commission Split"
            value={incomePlanning.brokerSplitPercentage}
            onChange={updateBrokerSplit}
            placeholder="30"
            helpText="The percentage your broker takes (e.g., enter 30 for a 70/30 split where you keep 70%)"
            className="mb-6"
          />

          <div className="mb-4 rounded-2xl bg-slate-50 p-4">
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
      </div>

      {/* Step 2: Broker's Cap (Optional) */}
      <div className="mb-8 overflow-hidden rounded-3xl border-2 border-slate-100 bg-white">
        <div className="border-b border-slate-100 bg-[#e8f4f8]/30 px-6 py-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#1a2744]">
            Step 2: Broker&apos;s Cap (Optional)
          </h3>
        </div>
        <div className="p-6">
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
            <div className="rounded-2xl bg-[#e8f4f8] p-4">
              <p className="mb-2 text-sm text-[#1a2744]">
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
      </div>

      <SummaryCard
        title="Your GCI Goal"
        value={hasCap ? calculated.adjustedGciNeeded : calculated.gciNeeded}
        format="currency"
        variant="primary"
        icon="trending"
      />

      <UpNextFooter text="Calculate how many transactions you need to reach your GCI goal" />
    </StepContainer>
  );
}
