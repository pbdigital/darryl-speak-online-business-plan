"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useBusinessPlanStore } from "@/stores/business-plan-store";
import { SummaryCard } from "../ui/summary-card";

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
    <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-3xl px-4 duration-700">
      <div className="mb-8">
        <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
          Part 3H
        </span>
        <h2 className="mb-2 text-3xl font-extrabold text-slate-900">
          Your Income Commitment
        </h2>
        <p className="text-slate-600">
          Review your numbers and commit to your goals. Understanding the
          meaning behind your numbers makes them more powerful.
        </p>
      </div>

      {/* Commitment Statement */}
      <div className="mb-8 rounded-xl border-2 border-[#0F172A] bg-[#0F172A] p-8 text-white">
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
      <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="mb-4 text-center text-sm font-bold uppercase tracking-wide text-slate-700">
          Every Working Day, I Commit To
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-[#e8f4f8] p-4 text-center">
            <p className="text-3xl font-extrabold text-[#0F172A]">
              {calculated.dailyReachOuts.toFixed(0)}
            </p>
            <p className="text-sm font-medium text-slate-600">reach-outs</p>
          </div>
          <div className="rounded-lg bg-[#e8f4f8] p-4 text-center">
            <p className="text-3xl font-extrabold text-[#0F172A]">
              {calculated.dailyConversations.toFixed(0)}
            </p>
            <p className="text-sm font-medium text-slate-600">conversations</p>
          </div>
          <div className="rounded-lg bg-[#e8f4f8] p-4 text-center">
            <p className="text-3xl font-extrabold text-[#0F172A]">
              {calculated.dailyAppointments.toFixed(1)}
            </p>
            <p className="text-sm font-medium text-slate-600">appointments</p>
          </div>
        </div>
      </div>

      {/* Numbers At-a-Glance */}
      <div className="mb-8 rounded-xl border border-slate-200 bg-slate-50 p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-700">
          Your Numbers At-a-Glance
        </h3>
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
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
                <td className="px-4 py-3 text-sm font-medium text-[#0F172A]">
                  Daily Reach-Outs
                </td>
                <td className="px-4 py-3 text-right text-sm font-bold text-[#0F172A]">
                  {calculated.dailyReachOuts.toFixed(1)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Narrative Sections */}
      <div className="mb-8 space-y-6">
        <div>
          <label className="mb-3 block text-sm font-bold uppercase tracking-wide text-slate-900">
            Reaching This Goal Means...
          </label>
          <textarea
            className="w-full rounded-xl border-2 border-slate-200 bg-white p-4 text-slate-800 outline-none transition-colors focus:border-emerald-500"
            rows={4}
            placeholder="What will achieving this goal allow you to do? How will your life be different?"
            value={incomePlanning.reachingGoalMeans}
            onChange={(e) =>
              updateCommitmentText("reachingGoalMeans", e.target.value)
            }
          />
        </div>

        <div>
          <label className="mb-3 block text-sm font-bold uppercase tracking-wide text-slate-900">
            Failing to Reach This Goal Means...
          </label>
          <textarea
            className="w-full rounded-xl border-2 border-slate-200 bg-white p-4 text-slate-800 outline-none transition-colors focus:border-red-400"
            rows={4}
            placeholder="What are the consequences of not hitting your goal? What will you miss out on?"
            value={incomePlanning.failingGoalMeans}
            onChange={(e) =>
              updateCommitmentText("failingGoalMeans", e.target.value)
            }
          />
        </div>
      </div>

      {/* Commitment Signature */}
      <div className="mt-8 rounded-xl border-2 border-slate-200 bg-white p-6">
        <h3 className="mb-6 text-center text-sm font-bold uppercase tracking-wide text-slate-700">
          Sign Your Commitment
        </h3>

        <div className="mb-6 rounded-lg bg-slate-50 p-4 text-center">
          <p className="text-sm italic text-slate-600">
            &ldquo;I commit to following my income plan and taking consistent
            daily action to achieve my 2026 goals.&rdquo;
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="group">
            <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-slate-900">
              Your Signature
            </label>
            <input
              type="text"
              className="w-full border-b-2 border-slate-200 bg-transparent py-3 font-serif text-xl italic text-slate-800 outline-none transition-all placeholder:text-slate-300 focus:border-slate-900"
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
              className="w-full border-b-2 border-slate-200 bg-transparent py-3 text-lg text-slate-800 outline-none transition-all focus:border-slate-900"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        {signature && (
          <div className="mt-6 flex items-center justify-center gap-2 text-[#0F172A]">
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-sm font-medium">Commitment signed</span>
          </div>
        )}
      </div>
    </div>
  );
}
