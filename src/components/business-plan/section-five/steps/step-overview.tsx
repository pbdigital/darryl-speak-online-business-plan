"use client";

import { Target, Sparkles, Heart, ClipboardCheck } from "lucide-react";
import { StepContainer, StepHeader } from "@/components/business-plan/ui";

interface StepOverviewProps {
  onStart: () => void;
}

export function StepOverview({ onStart }: StepOverviewProps) {
  return (
    <StepContainer>
      <StepHeader
        part="Section 5"
        title="Accountability & Progress Tracking"
        highlightWord="Accountability"
        subtitle="Create your action plan, define your ideal clients, and commit to your success with systems that keep you on track."
        icon={Target}
      />

      {/* What You'll Learn */}
      <div className="mb-10 space-y-4">
        <div className="flex items-start gap-4 rounded-2xl border-2 border-slate-100 bg-white p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f4f8]">
            <Sparkles className="h-5 w-5 text-[#1a2744]" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">What It Is</p>
            <p className="text-sm text-slate-600">
              This is your execution blueprint. While earlier sections focused on reflection, analysis, and mindset, Section 5 is where you build the systems that turn strategy into action.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-2xl border-2 border-slate-100 bg-white p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f4f8]">
            <Heart className="h-5 w-5 text-[#1a2744]" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">Why It Matters</p>
            <p className="text-sm text-slate-600">
              A plan without accountability is just a wish. This section ensures you have concrete projects to work on, clear targets to pursue, and a commitment that holds you responsible.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-2xl border-2 border-slate-100 bg-white p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f4f8]">
            <ClipboardCheck className="h-5 w-5 text-[#1a2744]" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">How to Fill It Out</p>
            <p className="text-sm text-slate-600">
              Work through each part systematically. Start with your Project Matrix, then explore your resources and define your ideal clients. Build your prospecting and marketing mix, plan quarterly activities, and finish by signing your Commitment Contract.
            </p>
          </div>
        </div>
      </div>

      {/* 7-Part Process */}
      <div className="mb-10 overflow-hidden rounded-3xl border-2 border-slate-100 bg-white">
        <div className="border-b border-slate-100 bg-[#e8f4f8]/30 px-6 py-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#1a2744]">
            The 7-Part Accountability System
          </h3>
        </div>
        <div className="grid gap-3 p-6 md:grid-cols-2">
          {[
            { part: "5A", title: "Project Matrix" },
            { part: "5B", title: "Exploring Your Resources" },
            { part: "5C", title: "Defining Your Ideal Client" },
            { part: "5D", title: "Your Prospecting Mix" },
            { part: "5E", title: "Your Marketing Mix" },
            { part: "5F", title: "Quarterly Marketing Overview" },
            { part: "5G", title: "Your Commitment Contract" },
          ].map((item, index) => (
            <div
              key={item.part}
              className={`flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3 ${
                index === 6 ? "md:col-span-2" : ""
              }`}
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
          Build Your Accountability System
        </button>
        <p className="mt-4 text-sm text-slate-500">
          Takes approximately 20-30 minutes to complete
        </p>
      </div>
    </StepContainer>
  );
}
