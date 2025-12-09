"use client";

import { useBusinessPlanStore } from "@/stores/business-plan-store";
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
    <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-3xl px-4 duration-700">
      <div className="mb-8">
        <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
          Part 3F
        </span>
        <h2 className="mb-2 text-3xl font-extrabold text-slate-900">
          Transaction Requirements
        </h2>
        <p className="text-slate-600">
          How many transactions do you need to close to reach your GCI goal?
          Let&apos;s calculate based on your market&apos;s average values.
        </p>
      </div>

      {/* Step 1: Average Commission Per Transaction */}
      <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-700">
          Step 1: Average Commission Per Transaction
        </h3>

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

        <div className="mb-4 rounded-lg bg-slate-50 p-4">
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

      {/* Step 2: Total Transactions Needed */}
      <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-700">
          Step 2: Total Transactions Needed
        </h3>

        <div className="mb-4 rounded-lg bg-slate-50 p-4">
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

      <SummaryCard
        title="Transactions to Close in 2026"
        value={calculated.totalTransactionsNeeded}
        format="number"
        variant="primary"
        icon="target"
      />
      <p className="mt-3 text-center text-sm text-slate-500">
        Up Next: Reverse engineer the daily activities to close{" "}
        {calculated.totalTransactionsNeeded} transactions →
      </p>
    </div>
  );
}
