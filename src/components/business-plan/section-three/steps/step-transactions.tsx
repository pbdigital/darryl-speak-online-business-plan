"use client";

import { Target } from "lucide-react";
import { useBusinessPlanStore } from "@/stores/business-plan-store";
import { StepContainer, StepHeader, UpNextFooter } from "@/components/business-plan/ui";
import { CurrencyInput } from "../ui/currency-input";
import { PercentageInput } from "../ui/percentage-input";
import { CalculatedField } from "../ui/calculated-field";
import { SummaryCard } from "../ui/summary-card";

export function StepTransactions() {
  const { incomePlanning, calculated, updateMarketData } =
    useBusinessPlanStore();

  const hasCap = (incomePlanning.brokerCapAmount || 0) > 0;
  const finalGci = hasCap ? calculated.adjustedGciNeeded : calculated.gciNeeded;

  // Display commission rate as percentage (store holds decimal)
  const commissionRatePercent =
    (incomePlanning.averageCommissionRate || 0) * 100;

  const handleCommissionRateChange = (value: number | null) => {
    // Convert percentage to decimal for storage
    updateMarketData(
      "averageCommissionRate",
      value !== null ? value / 100 : null
    );
  };

  return (
    <StepContainer>
      <StepHeader
        part="Part 3F"
        title="Transaction Requirements"
        highlightWord="Transaction"
        subtitle="How many transactions do you need to close to reach your GCI goal? Let's calculate based on your market's average values."
        icon={Target}
      />

      {/* Step 1: Average Commission Per Transaction */}
      <div className="mb-8 overflow-hidden rounded-3xl border-2 border-slate-100 bg-white">
        <div className="border-b border-slate-100 bg-[#e8f4f8]/30 px-6 py-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#1a2744]">
            Step 1: Average Commission Per Transaction
          </h3>
        </div>
        <div className="p-6">
          <div className="mb-6 grid gap-6 md:grid-cols-2">
            <CurrencyInput
              label="Average Sales Price in Your Market"
              value={incomePlanning.averageSalesPrice}
              onChange={(value) => updateMarketData("averageSalesPrice", value)}
              placeholder="350000"
            />
            <PercentageInput
              label="Your Average Commission Rate"
              value={commissionRatePercent || null}
              onChange={handleCommissionRateChange}
              placeholder="2.5"
              helpText="Enter 2.5 for 2.5%, 3 for 3%, etc."
            />
          </div>

          <div className="mb-4 rounded-2xl bg-slate-50 p-4">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-600">
              Calculation
            </h4>
            <div className="space-y-2 font-mono text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Average Sales Price</span>
                <span className="font-medium text-slate-800">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 0,
                  }).format(incomePlanning.averageSalesPrice || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">× Commission Rate</span>
                <span className="font-medium text-slate-800">
                  {commissionRatePercent.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2">
                <span className="text-slate-600">Average Commission</span>
                <span className="font-bold text-slate-900">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 0,
                  }).format(calculated.averageCommissionPerTransaction)}
                </span>
              </div>
            </div>
          </div>

          <CalculatedField
            label="Average Commission Per Transaction"
            value={calculated.averageCommissionPerTransaction}
            format="currency"
          />
        </div>
      </div>

      {/* Step 2: Total Transactions Needed */}
      <div className="mb-8 overflow-hidden rounded-3xl border-2 border-slate-100 bg-white">
        <div className="border-b border-slate-100 bg-[#e8f4f8]/30 px-6 py-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#1a2744]">
            Step 2: Total Transactions Needed
          </h3>
        </div>
        <div className="p-6">
          <div className="mb-4 rounded-2xl bg-slate-50 p-4">
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-600">
              Calculation
            </h4>
            <div className="space-y-2 font-mono text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Your GCI Goal</span>
                <span className="font-medium text-slate-800">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 0,
                  }).format(finalGci)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">÷ Average Commission</span>
                <span className="font-medium text-slate-800">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 0,
                  }).format(calculated.averageCommissionPerTransaction)}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2">
                <span className="text-slate-600">Transactions Needed</span>
                <span className="font-bold text-slate-900">
                  {calculated.totalTransactionsNeeded}
                </span>
              </div>
            </div>
          </div>

          <CalculatedField
            label="Total Transactions Needed in 2026"
            value={calculated.totalTransactionsNeeded}
            format="number"
            highlight
          />
        </div>
      </div>

      <SummaryCard
        title="Transactions to Close in 2026"
        value={calculated.totalTransactionsNeeded}
        format="number"
        variant="primary"
        icon="target"
      />

      <UpNextFooter text={`Reverse engineer the daily activities to close ${calculated.totalTransactionsNeeded} transactions`} />
    </StepContainer>
  );
}
