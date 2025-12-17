"use client";

import { Target, Calculator, DollarSign, TrendingUp } from "lucide-react";
import { StepContainer, StepHeader } from "@/components/business-plan/ui";

interface StepOverviewProps {
  onStart: () => void;
}

export function StepOverview({ onStart }: StepOverviewProps) {
  return (
    <StepContainer>
      <StepHeader
        part="Section 3"
        title="Vision, Goals & Income Planning"
        highlightWord="Income"
        subtitle="Transform your financial vision into actionable daily targets through strategic calculation."
        icon={Target}
      />

      {/* What You'll Learn */}
      <div className="mb-10 space-y-4">
        <div className="flex items-start gap-4 rounded-2xl border-2 border-slate-100 bg-white p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f4f8]">
            <Calculator className="h-5 w-5 text-[#1a2744]" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">What It Is</p>
            <p className="text-sm text-slate-600">
              This is the most powerful section of your business plan. You&apos;ll work backwards from your income goals to determine exactly how many transactions, appointments, conversations, and daily reach-outs you need.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-2xl border-2 border-slate-100 bg-white p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f4f8]">
            <DollarSign className="h-5 w-5 text-[#1a2744]" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">Why It Matters</p>
            <p className="text-sm text-slate-600">
              Without clear numbers, goals remain wishes. By understanding the math behind your success, you can make strategic decisions and track your progress with precision.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-2xl border-2 border-slate-100 bg-white p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f4f8]">
            <TrendingUp className="h-5 w-5 text-[#1a2744]" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">How to Fill It Out</p>
            <p className="text-sm text-slate-600">
              Work through each step in order. The calculations build on each other, so accurate numbers early on will ensure your final daily targets are achievable.
            </p>
          </div>
        </div>
      </div>

      {/* 8-Part Process */}
      <div className="mb-10 overflow-hidden rounded-3xl border-2 border-slate-100 bg-white">
        <div className="border-b border-slate-100 bg-[#e8f4f8]/30 px-6 py-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#1a2744]">
            The 8-Part Income Planning Process
          </h3>
        </div>
        <div className="grid gap-3 p-6 md:grid-cols-2">
          {[
            { part: "3A", title: "Your Financial Foundation" },
            { part: "3B", title: "Your Manifest List" },
            { part: "3C", title: "Target Take-Home Income" },
            { part: "3D", title: "Accounting for Taxes" },
            { part: "3E", title: "GCI Goal Calculation" },
            { part: "3F", title: "Transaction Requirements" },
            { part: "3G", title: "Daily Activity Goals" },
            { part: "3H", title: "Your Income Commitment" },
          ].map((item) => (
            <div
              key={item.part}
              className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1a2744] text-xs font-bold text-white">
                {item.part}
              </span>
              <p className="text-sm font-medium text-slate-700">{item.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <button
          onClick={onStart}
          className="group inline-flex items-center gap-2 rounded-full bg-[#1a2744] px-10 py-4 font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:bg-slate-700 hover:shadow-xl active:scale-[0.98]"
        >
          Start Income Planning
        </button>
        <p className="mt-4 text-sm text-slate-500">
          Takes approximately 15-20 minutes to complete
        </p>
      </div>
    </StepContainer>
  );
}
