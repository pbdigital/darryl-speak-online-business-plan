"use client";

import { useState } from "react";
import { CheckCircle2, Trophy } from "lucide-react";
import { useBusinessPlanStore } from "@/stores/business-plan-store";

export function StepComplete() {
  const { calculated, incomePlanning } = useBusinessPlanStore();
  const [signature, setSignature] = useState("");
  const [date, setDate] = useState(
    new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  );

  const hasCap = (incomePlanning.brokerCapAmount || 0) > 0;
  const finalGci = hasCap ? calculated.adjustedGciNeeded : calculated.gciNeeded;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-3xl px-4 duration-700">
      {/* Success Hero */}
      <div className="mb-8 rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-8 text-center text-white shadow-xl md:p-12">
        <div className="mb-4 inline-flex rounded-full bg-white/20 p-4">
          <Trophy className="h-12 w-12" />
        </div>
        <h2 className="mb-2 text-3xl font-extrabold md:text-4xl">
          Section 3 Complete!
        </h2>
        <p className="text-lg text-emerald-100">
          You&apos;ve mapped out your entire income plan for 2026. Now it&apos;s
          time to commit to making it happen.
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

      {/* Commitment Signature */}
      <div className="mb-8 rounded-xl border-2 border-slate-200 bg-white p-6">
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
              type="text"
              className="w-full border-b-2 border-slate-200 bg-transparent py-3 text-lg text-slate-800 outline-none transition-all placeholder:text-slate-300 focus:border-slate-900"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        {signature && (
          <div className="mt-6 flex items-center justify-center gap-2 text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-sm font-medium">Commitment signed</span>
          </div>
        )}
      </div>

      {/* Next Steps */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-blue-800">
          What&apos;s Next?
        </h3>
        <ul className="space-y-3 text-sm text-blue-700">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-200 text-xs font-bold text-blue-800">
              1
            </span>
            <span>
              Complete <strong>Section 4: Mindset, Self-Care & Motivation</strong> to build the mental
              foundation for success
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-200 text-xs font-bold text-blue-800">
              2
            </span>
            <span>
              Complete <strong>Section 5: Accountability & Progress Tracking</strong> to create your
              action plan
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-200 text-xs font-bold text-blue-800">
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
