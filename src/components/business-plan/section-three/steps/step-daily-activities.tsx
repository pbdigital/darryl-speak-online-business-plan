"use client";

import { useBusinessPlanStore } from "@/stores/business-plan-store";
import { CalculatedField } from "../ui/calculated-field";
import { SummaryCard } from "../ui/summary-card";
import { cn } from "@/lib/utils";

export function StepDailyActivities() {
  const { incomePlanning, calculated, updateWorkSchedule } =
    useBusinessPlanStore();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-3xl px-4 duration-700">
      <div className="mb-8">
        <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
          Part 3G
        </span>
        <h2 className="mb-2 text-3xl font-extrabold text-slate-900">
          Reverse Engineering Your Daily Activities
        </h2>
        <p className="text-slate-600">
          Using proven conversion ratios, let&apos;s calculate the daily
          activities needed to hit your transaction goal.
        </p>
      </div>

      {/* Conversion Ratios Info */}
      <div className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-blue-800">
          Industry Conversion Ratios
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-extrabold text-[#0F172A]">5</p>
            <p className="text-xs text-slate-600">
              appointments = 1 closed transaction
            </p>
          </div>
          <div className="rounded-lg bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-extrabold text-[#0F172A]">16</p>
            <p className="text-xs text-slate-600">
              conversations = 1 appointment
            </p>
          </div>
          <div className="rounded-lg bg-white p-4 text-center shadow-sm">
            <p className="text-2xl font-extrabold text-[#0F172A]">12.5</p>
            <p className="text-xs text-slate-600">
              reach-outs = 1 conversation
            </p>
          </div>
        </div>
      </div>

      {/* Annual Activity Goals */}
      <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-700">
          Step 1: Annual Activity Goals
        </h3>
        <div className="overflow-hidden rounded-lg border border-slate-200">
          <table className="w-full">
            <thead>
              <tr className="bg-[#0F172A] text-white">
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider">
                  Calculation
                </th>
                <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider">
                  Annual Total
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100 bg-white">
                <td className="px-4 py-3 text-sm font-medium text-slate-700">
                  Closed Transactions
                </td>
                <td className="px-4 py-3 text-sm text-slate-500">
                  From Part 3F
                </td>
                <td className="px-4 py-3 text-right text-sm font-bold text-slate-900">
                  {calculated.totalTransactionsNeeded}
                </td>
              </tr>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <td className="px-4 py-3 text-sm font-medium text-slate-700">
                  Appointments Needed
                </td>
                <td className="px-4 py-3 text-sm text-slate-500">
                  {calculated.totalTransactionsNeeded} × 5
                </td>
                <td className="px-4 py-3 text-right text-sm font-bold text-slate-900">
                  {Math.round(calculated.appointmentsNeeded)}
                </td>
              </tr>
              <tr className="border-b border-slate-100 bg-white">
                <td className="px-4 py-3 text-sm font-medium text-slate-700">
                  Conversations Needed
                </td>
                <td className="px-4 py-3 text-sm text-slate-500">
                  {Math.round(calculated.appointmentsNeeded)} × 16
                </td>
                <td className="px-4 py-3 text-right text-sm font-bold text-slate-900">
                  {Math.round(calculated.conversationsNeeded).toLocaleString()}
                </td>
              </tr>
              <tr className="bg-slate-50/50">
                <td className="px-4 py-3 text-sm font-medium text-slate-700">
                  Reach-Outs Needed
                </td>
                <td className="px-4 py-3 text-sm text-slate-500">
                  {Math.round(calculated.conversationsNeeded).toLocaleString()} × 12.5
                </td>
                <td className="px-4 py-3 text-right text-sm font-bold text-slate-900">
                  {Math.round(calculated.reachOutsNeeded).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Work Schedule */}
      <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-700">
          Step 2: Your Work Schedule
        </h3>
        <div className="mb-6 grid gap-6 md:grid-cols-2">
          <div className="group">
            <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-slate-900">
              Days Per Week You&apos;ll Work
            </label>
            <input
              type="number"
              min="1"
              max="7"
              className="w-full border-b-2 border-slate-200 bg-transparent py-3 text-lg font-medium text-slate-800 outline-none transition-all placeholder:text-slate-300 focus:border-slate-900"
              placeholder="5"
              value={incomePlanning.workDaysPerWeek || ""}
              onChange={(e) =>
                updateWorkSchedule(
                  "workDaysPerWeek",
                  e.target.value ? parseInt(e.target.value, 10) : null
                )
              }
            />
          </div>
          <div className="group">
            <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-slate-900">
              Weeks Off (Vacation)
            </label>
            <input
              type="number"
              min="0"
              max="52"
              className="w-full border-b-2 border-slate-200 bg-transparent py-3 text-lg font-medium text-slate-800 outline-none transition-all placeholder:text-slate-300 focus:border-slate-900"
              placeholder="2"
              value={incomePlanning.weeksOff || ""}
              onChange={(e) =>
                updateWorkSchedule(
                  "weeksOff",
                  e.target.value ? parseInt(e.target.value, 10) : null
                )
              }
            />
          </div>
        </div>

        <CalculatedField
          label="Total Working Days in 2026"
          value={calculated.workingDays}
          format="number"
          helpText={`(${incomePlanning.workDaysPerWeek || 5} days × 52 weeks) - (${incomePlanning.workDaysPerWeek || 5} days × ${incomePlanning.weeksOff || 0} weeks off)`}
        />
      </div>

      {/* Daily Activity Targets */}
      <div className="mb-8 rounded-xl border-2 border-blue-200 bg-blue-50 p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-blue-800">
          Your Daily Activity Targets
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 text-center shadow-sm">
            <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
              Reach-Outs / Day
            </p>
            <p className="text-4xl font-extrabold text-emerald-600">
              {calculated.dailyReachOuts.toFixed(1)}
            </p>
          </div>
          <div className="rounded-xl bg-white p-6 text-center shadow-sm">
            <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
              Conversations / Day
            </p>
            <p className="text-4xl font-extrabold text-emerald-600">
              {calculated.dailyConversations.toFixed(1)}
            </p>
          </div>
          <div className="rounded-xl bg-white p-6 text-center shadow-sm">
            <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
              Appointments / Day
            </p>
            <p className="text-4xl font-extrabold text-emerald-600">
              {calculated.dailyAppointments.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <SummaryCard
        title="Daily Reach-Outs Required"
        value={calculated.dailyReachOuts}
        format="number"
        variant="success"
        icon="target"
      />

      <div className="mt-8 rounded-lg bg-blue-50 p-4">
        <p className="text-sm text-blue-800">
          <strong>What&apos;s Next:</strong> Let&apos;s solidify your commitment
          to these numbers and understand what achieving (or missing) this goal
          means for you.
        </p>
      </div>
    </div>
  );
}
