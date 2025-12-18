"use client";

import { Activity } from "lucide-react";
import { useBusinessPlanStore } from "@/stores/business-plan-store";
import { StepContainer, StepHeader, UpNextFooter } from "@/components/business-plan/ui";
import { CalculatedField } from "../ui/calculated-field";
import { SummaryCard } from "../ui/summary-card";
import { CURRENT_PLAN_YEAR } from "@/lib/constants";

export function StepDailyActivities() {
  const { incomePlanning, calculated, updateWorkSchedule } =
    useBusinessPlanStore();

  return (
    <StepContainer>
      <StepHeader
        part="Part 3G"
        title="Reverse Engineering Your Daily Activities"
        highlightWord="Daily"
        subtitle="Using proven conversion ratios, let's calculate the daily activities needed to hit your transaction goal."
        icon={Activity}
      />

      {/* Conversion Ratios Info */}
      <div className="mb-8 overflow-hidden rounded-3xl border-2 border-slate-100 bg-white">
        <div className="border-b border-slate-100 bg-[#e8f4f8]/30 px-6 py-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#1a2744]">
            Industry Conversion Ratios
          </h3>
        </div>
        <div className="grid gap-4 p-6 md:grid-cols-3">
          <div className="rounded-2xl bg-[#e8f4f8] p-4 text-center">
            <p className="text-2xl font-extrabold text-[#1a2744]">5</p>
            <p className="text-xs text-slate-600">
              appointments = 1 closed transaction
            </p>
          </div>
          <div className="rounded-2xl bg-[#e8f4f8] p-4 text-center">
            <p className="text-2xl font-extrabold text-[#1a2744]">16</p>
            <p className="text-xs text-slate-600">
              conversations = 1 appointment
            </p>
          </div>
          <div className="rounded-2xl bg-[#e8f4f8] p-4 text-center">
            <p className="text-2xl font-extrabold text-[#1a2744]">12.5</p>
            <p className="text-xs text-slate-600">
              reach-outs = 1 conversation
            </p>
          </div>
        </div>
      </div>

      {/* Annual Activity Goals */}
      <div className="mb-8 overflow-hidden rounded-3xl border-2 border-slate-100 bg-white">
        <div className="border-b border-slate-100 bg-[#e8f4f8]/30 px-6 py-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#1a2744]">
            Step 1: Annual Activity Goals
          </h3>
        </div>
        <div className="p-6">
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full">
              <thead>
                <tr className="bg-[#1a2744] text-white">
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
      </div>

      {/* Work Schedule */}
      <div className="mb-8 overflow-hidden rounded-3xl border-2 border-slate-100 bg-white">
        <div className="border-b border-slate-100 bg-[#e8f4f8]/30 px-6 py-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#1a2744]">
            Step 2: Your Work Schedule
          </h3>
        </div>
        <div className="p-6">
          <div className="mb-6 grid gap-6 md:grid-cols-2">
            <div className="group">
              <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-slate-900">
                Days Per Week You&apos;ll Work
              </label>
              <input
                type="number"
                min="1"
                max="7"
                className="w-full border-b-2 border-slate-200 bg-transparent py-3 text-lg font-medium text-slate-800 outline-none transition-all placeholder:text-slate-300 focus:border-[#1a2744]"
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
                className="w-full border-b-2 border-slate-200 bg-transparent py-3 text-lg font-medium text-slate-800 outline-none transition-all placeholder:text-slate-300 focus:border-[#1a2744]"
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
            label={`Total Working Days in ${CURRENT_PLAN_YEAR}`}
            value={calculated.workingDays}
            format="number"
            helpText={`(${incomePlanning.workDaysPerWeek || 5} days × 52 weeks) - (${incomePlanning.workDaysPerWeek || 5} days × ${incomePlanning.weeksOff || 0} weeks off)`}
          />
        </div>
      </div>

      {/* Daily Activity Targets */}
      <div className="mb-8 overflow-hidden rounded-3xl border-2 border-slate-100 bg-white">
        <div className="border-b border-slate-100 bg-[#e8f4f8]/30 px-6 py-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#1a2744]">
            Your Daily Activity Targets
          </h3>
        </div>
        <div className="grid gap-4 p-6 md:grid-cols-3">
          <div className="rounded-2xl bg-[#e8f4f8] p-6 text-center">
            <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
              Reach-Outs / Day
            </p>
            <p className="text-4xl font-extrabold text-[#1a2744]">
              {calculated.dailyReachOuts.toFixed(1)}
            </p>
          </div>
          <div className="rounded-2xl bg-[#e8f4f8] p-6 text-center">
            <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
              Conversations / Day
            </p>
            <p className="text-4xl font-extrabold text-[#1a2744]">
              {calculated.dailyConversations.toFixed(1)}
            </p>
          </div>
          <div className="rounded-2xl bg-[#e8f4f8] p-6 text-center">
            <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
              Appointments / Day
            </p>
            <p className="text-4xl font-extrabold text-[#1a2744]">
              {calculated.dailyAppointments.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <SummaryCard
        title="Daily Reach-Outs Required"
        value={calculated.dailyReachOuts}
        format="number"
        variant="primary"
        icon="target"
      />

      <UpNextFooter text="Solidify your commitment and understand what this goal means for you" />
    </StepContainer>
  );
}
