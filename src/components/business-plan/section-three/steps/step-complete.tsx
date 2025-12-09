"use client";

import { Trophy } from "lucide-react";
import { useBusinessPlanStore } from "@/stores/business-plan-store";

export function StepComplete() {
  const { calculated, incomePlanning } = useBusinessPlanStore();

  const hasCap = (incomePlanning.brokerCapAmount || 0) > 0;
  const finalGci = hasCap ? calculated.adjustedGciNeeded : calculated.gciNeeded;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-3xl px-4 duration-700">
      {/* Success Hero */}
      <div className="mb-8 rounded-3xl bg-[#0F172A] p-8 text-center text-white shadow-xl md:p-12">
        <div className="mb-4 inline-flex rounded-full bg-white/10 p-4">
          <Trophy className="h-12 w-12" />
        </div>
        <h2 className="mb-2 text-3xl font-extrabold md:text-4xl">
          Section 3 Complete!
        </h2>
        <p className="text-lg text-slate-300">
          You&apos;ve mapped out your entire income plan for 2026. Now it&apos;s
          time to make it happen.
        </p>
      </div>

      {/* Key Metrics Summary */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
            GCI Goal
          </p>
          <p className="text-2xl font-extrabold text-[#0F172A]">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 0,
            }).format(finalGci)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
            Transactions
          </p>
          <p className="text-2xl font-extrabold text-[#0F172A]">
            {calculated.totalTransactionsNeeded}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
            Daily Reach-Outs
          </p>
          <p className="text-2xl font-extrabold text-[#0F172A]">
            {calculated.dailyReachOuts.toFixed(0)}
          </p>
        </div>
      </div>

      {/* Next Steps */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-700">
          What&apos;s Next?
        </h3>
        <ul className="space-y-3 text-sm text-slate-600">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0F172A] text-xs font-bold text-white">
              1
            </span>
            <span>
              Complete <strong className="text-[#0F172A]">Section 4: Mindset, Self-Care & Motivation</strong> to build the mental
              foundation for success
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0F172A] text-xs font-bold text-white">
              2
            </span>
            <span>
              Complete <strong className="text-[#0F172A]">Section 5: Accountability & Progress Tracking</strong> to create your
              action plan
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0F172A] text-xs font-bold text-white">
              3
            </span>
            <span>
              Start tracking your daily activities and review your progress
              weekly
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
