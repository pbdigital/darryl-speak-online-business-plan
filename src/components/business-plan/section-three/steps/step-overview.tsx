"use client";

import { Target } from "lucide-react";
import { SectionCover, DefinitionBox } from "@/components/business-plan/section-one/ui";

interface StepOverviewProps {
  onStart: () => void;
}

export function StepOverview({ onStart }: StepOverviewProps) {
  return (
    <div className="mt-12 animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-6xl px-5 duration-700">
      <SectionCover
        number="3"
        title="Vision, Goals & Income Planning"
        subtitle="Transform your financial vision into actionable daily targets through strategic calculation."
        icon={Target}
        progress={0}
      />

      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-12 space-y-8">
          <DefinitionBox
            title="What It Is"
            content="This is the most powerful section of your business plan. You'll work backwards from your income goals to determine exactly how many transactions, appointments, conversations, and daily reach-outs you need to achieve your financial targets."
          />
          <DefinitionBox
            title="Why It Matters"
            content="Without clear numbers, goals remain wishes. By understanding the math behind your success, you can make strategic decisions and track your progress with precision throughout the year."
          />
          <DefinitionBox
            title="How to Fill It Out"
            content="Work through each step in order. The calculations build on each other, so accurate numbers early on will ensure your final daily targets are achievable and meaningful."
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
          <h3 className="mb-4 text-center font-bold text-slate-900">
            The 8-Part Income Planning Process
          </h3>
          <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">Part 3A</span>
              <p className="text-sm text-slate-600">Your Financial Foundation</p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">Part 3B</span>
              <p className="text-sm text-slate-600">Your Manifest List</p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">Part 3C</span>
              <p className="text-sm text-slate-600">Target Take-Home Income</p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">Part 3D</span>
              <p className="text-sm text-slate-600">Accounting for Taxes</p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">Part 3E</span>
              <p className="text-sm text-slate-600">GCI Goal Calculation</p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">Part 3F</span>
              <p className="text-sm text-slate-600">Transaction Requirements</p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">Part 3G</span>
              <p className="text-sm text-slate-600">Daily Activity Goals</p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">Part 3H</span>
              <p className="text-sm text-slate-600">Your Income Commitment</p>
            </div>
          </div>
          <div className="text-center">
            <button
              onClick={onStart}
              className="transform rounded-full bg-[#0F172A] px-10 py-4 font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-slate-800 hover:shadow-xl"
            >
              Start Income Planning
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
