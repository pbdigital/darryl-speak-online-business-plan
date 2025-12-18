"use client";

import { useState } from "react";
import { CheckCircle2, FileSignature } from "lucide-react";
import { useBusinessPlanStore } from "@/stores/business-plan-store";
import { StepContainer, StepHeader } from "@/components/business-plan/ui";
import { SummaryCard } from "../ui/summary-card";
import { CURRENT_PLAN_YEAR } from "@/lib/constants";

export function StepIncomeCommitment() {
  const { incomePlanning, calculated, updateCommitmentText } =
    useBusinessPlanStore();
  const [signature, setSignature] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0] // YYYY-MM-DD format for date input
  );

  const hasCap = (incomePlanning.brokerCapAmount || 0) > 0;
  const finalGci = hasCap ? calculated.adjustedGciNeeded : calculated.gciNeeded;

  return (
    <StepContainer>
      <StepHeader
        part="Part 3H"
        title="Your Income Commitment"
        highlightWord="Commitment"
        subtitle="Review your numbers and commit to your goals. Understanding the meaning behind your numbers makes them more powerful."
        icon={FileSignature}
      />

      {/* Commitment Statement */}
      <div className="mb-8 overflow-hidden rounded-3xl border-2 border-[#1a2744] bg-[#1a2744] p-8 text-white">
        <div className="mb-6 text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-wider text-slate-400">
            My Annual GCI Goal Is
          </p>
          <p className="text-5xl font-extrabold">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 0,
            }).format(finalGci)}
          </p>
        </div>
        <div className="text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-wider text-slate-400">
            To Reach This Goal, I Need to Close
          </p>
          <p className="text-5xl font-extrabold">
            {calculated.totalTransactionsNeeded}{" "}
            <span className="text-2xl font-normal text-slate-400">
              transactions
            </span>
          </p>
        </div>
      </div>

      {/* Daily Activity Commitment */}
      <div className="mb-8 overflow-hidden rounded-3xl border-2 border-slate-100 bg-white">
        <div className="border-b border-slate-100 bg-[#e8f4f8]/30 px-6 py-4">
          <h3 className="text-center text-sm font-bold uppercase tracking-wider text-[#1a2744]">
            Every Working Day, I Commit To
          </h3>
        </div>
        <div className="grid gap-4 p-6 md:grid-cols-3">
          <div className="rounded-2xl bg-[#e8f4f8] p-4 text-center">
            <p className="text-3xl font-extrabold text-[#1a2744]">
              {calculated.dailyReachOuts.toFixed(0)}
            </p>
            <p className="text-sm font-medium text-slate-600">reach-outs</p>
          </div>
          <div className="rounded-2xl bg-[#e8f4f8] p-4 text-center">
            <p className="text-3xl font-extrabold text-[#1a2744]">
              {calculated.dailyConversations.toFixed(0)}
            </p>
            <p className="text-sm font-medium text-slate-600">conversations</p>
          </div>
          <div className="rounded-2xl bg-[#e8f4f8] p-4 text-center">
            <p className="text-3xl font-extrabold text-[#1a2744]">
              {calculated.dailyAppointments.toFixed(1)}
            </p>
            <p className="text-sm font-medium text-slate-600">appointments</p>
          </div>
        </div>
      </div>

      {/* Numbers At-a-Glance */}
      <div className="mb-8 overflow-hidden rounded-3xl border-2 border-slate-100 bg-white">
        <div className="border-b border-slate-100 bg-[#e8f4f8]/30 px-6 py-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#1a2744]">
            Your Numbers At-a-Glance
          </h3>
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white m-6">
          <table className="w-full">
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="px-4 py-3 text-sm text-slate-600">
                  Annual Expenses
                </td>
                <td className="px-4 py-3 text-right text-sm font-bold text-slate-900">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 0,
                  }).format(calculated.annualExpenses)}
                </td>
              </tr>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <td className="px-4 py-3 text-sm text-slate-600">
                  Manifest Goals Total
                </td>
                <td className="px-4 py-3 text-right text-sm font-bold text-slate-900">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 0,
                  }).format(calculated.manifestGoalsTotal)}
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="px-4 py-3 text-sm text-slate-600">
                  Target Take-Home Income
                </td>
                <td className="px-4 py-3 text-right text-sm font-bold text-slate-900">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 0,
                  }).format(calculated.targetTakeHomeIncome)}
                </td>
              </tr>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <td className="px-4 py-3 text-sm text-slate-600">
                  Estimated Tax Rate
                </td>
                <td className="px-4 py-3 text-right text-sm font-bold text-slate-900">
                  {incomePlanning.estimatedTaxRate || 0}%
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="px-4 py-3 text-sm text-slate-600">
                  Annual Taxable Income Needed
                </td>
                <td className="px-4 py-3 text-right text-sm font-bold text-slate-900">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 0,
                  }).format(calculated.annualTaxableIncomeNeeded)}
                </td>
              </tr>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <td className="px-4 py-3 text-sm text-slate-600">
                  Broker Commission Split
                </td>
                <td className="px-4 py-3 text-right text-sm font-bold text-slate-900">
                  {incomePlanning.brokerSplitPercentage || 0}%
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="px-4 py-3 text-sm text-slate-600">GCI Goal</td>
                <td className="px-4 py-3 text-right text-sm font-bold text-slate-900">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 0,
                  }).format(finalGci)}
                </td>
              </tr>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <td className="px-4 py-3 text-sm text-slate-600">
                  Average Commission Per Transaction
                </td>
                <td className="px-4 py-3 text-right text-sm font-bold text-slate-900">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    minimumFractionDigits: 0,
                  }).format(calculated.averageCommissionPerTransaction)}
                </td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="px-4 py-3 text-sm text-slate-600">
                  Total Transactions Needed
                </td>
                <td className="px-4 py-3 text-right text-sm font-bold text-slate-900">
                  {calculated.totalTransactionsNeeded}
                </td>
              </tr>
              <tr className="bg-[#e8f4f8]">
                <td className="px-4 py-3 text-sm font-medium text-[#1a2744]">
                  Daily Reach-Outs
                </td>
                <td className="px-4 py-3 text-right text-sm font-bold text-[#1a2744]">
                  {calculated.dailyReachOuts.toFixed(1)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Narrative Sections */}
      <div className="mb-8 space-y-6">
        <div className="overflow-hidden rounded-3xl border-2 border-slate-100 bg-white">
          <div className="border-b border-slate-100 bg-[#e8f4f8]/30 px-6 py-4">
            <label className="text-sm font-bold uppercase tracking-wider text-[#1a2744]">
              Reaching This Goal Means...
            </label>
          </div>
          <div className="p-6">
            <textarea
              className="w-full rounded-2xl border-2 border-slate-200 bg-white p-4 text-slate-800 outline-none transition-colors focus:border-[#1a2744]"
              rows={4}
              placeholder="What will achieving this goal allow you to do? How will your life be different?"
              value={incomePlanning.reachingGoalMeans}
              onChange={(e) =>
                updateCommitmentText("reachingGoalMeans", e.target.value)
              }
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border-2 border-slate-100 bg-white">
          <div className="border-b border-slate-100 bg-[#e8f4f8]/30 px-6 py-4">
            <label className="text-sm font-bold uppercase tracking-wider text-[#1a2744]">
              Failing to Reach This Goal Means...
            </label>
          </div>
          <div className="p-6">
            <textarea
              className="w-full rounded-2xl border-2 border-slate-200 bg-white p-4 text-slate-800 outline-none transition-colors focus:border-[#1a2744]"
              rows={4}
              placeholder="What are the consequences of not hitting your goal? What will you miss out on?"
              value={incomePlanning.failingGoalMeans}
              onChange={(e) =>
                updateCommitmentText("failingGoalMeans", e.target.value)
              }
            />
          </div>
        </div>
      </div>

      {/* Commitment Signature */}
      <div className="mt-8 overflow-hidden rounded-3xl border-2 border-slate-100 bg-white">
        <div className="border-b border-slate-100 bg-[#e8f4f8]/30 px-6 py-4">
          <h3 className="text-center text-sm font-bold uppercase tracking-wider text-[#1a2744]">
            Sign Your Commitment
          </h3>
        </div>
        <div className="p-6">
          <div className="mb-6 rounded-2xl bg-slate-50 p-4 text-center">
            <p className="text-sm italic text-slate-600">
              &ldquo;I commit to following my income plan and taking consistent
              daily action to achieve my {CURRENT_PLAN_YEAR} goals.&rdquo;
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="group">
              <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-slate-900">
                Your Signature
              </label>
              <input
                type="text"
                className="w-full border-b-2 border-slate-200 bg-transparent py-3 font-serif text-xl italic text-slate-800 outline-none transition-all placeholder:text-slate-300 focus:border-[#1a2744]"
                placeholder="Type your name"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
              />
            </div>
            <div className="group">
              <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-slate-900">
                Date
              </label>
              <input
                type="date"
                className="w-full border-b-2 border-slate-200 bg-transparent py-3 text-lg text-slate-800 outline-none transition-all focus:border-[#1a2744]"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          {signature && (
            <div className="mt-6 flex items-center justify-center gap-2 text-[#1a2744]">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm font-medium">Commitment signed</span>
            </div>
          )}
        </div>
      </div>
    </StepContainer>
  );
}
