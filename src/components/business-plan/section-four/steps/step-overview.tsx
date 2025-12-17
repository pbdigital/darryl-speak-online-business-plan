"use client";

import { Smile, Sparkles, Heart, Target } from "lucide-react";
import { StepContainer, StepHeader } from "@/components/business-plan/ui";

interface StepOverviewProps {
  onStart: () => void;
}

export function StepOverview({ onStart }: StepOverviewProps) {
  return (
    <StepContainer>
      <StepHeader
        part="Section 4"
        title="Mindset, Self-Care & Motivation"
        highlightWord="Mindset"
        subtitle="Build the internal systems that keep you grounded, focused, and fueled—especially when things get challenging."
        icon={Smile}
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
              Your mindset is the engine of your business. This section helps you strengthen the thoughts, habits, and routines that keep you grounded, focused, and fueled—especially when the market, clients, or life gets noisy.
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
              Real estate is a high-energy, high-emotion profession. Without strong internal systems—mindset, boundaries, and self-care—you risk burnout, inconsistency, and decision fatigue.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-2xl border-2 border-slate-100 bg-white p-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e8f4f8]">
            <Target className="h-5 w-5 text-[#1a2744]" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">How to Fill It Out</p>
            <p className="text-sm text-slate-600">
              Use this section to build your personal &quot;stability system.&quot; Work through each step to define your affirmations, grounding rituals, boundaries, self-care practices, motivation triggers, support network, and the person you need to become.
            </p>
          </div>
        </div>
      </div>

      {/* 7-Part Process */}
      <div className="mb-10 overflow-hidden rounded-3xl border-2 border-slate-100 bg-white">
        <div className="border-b border-slate-100 bg-[#e8f4f8]/30 px-6 py-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#1a2744]">
            The 7-Part Mindset System
          </h3>
        </div>
        <div className="grid gap-3 p-6 md:grid-cols-2">
          {[
            { step: "1", title: "Motivating Affirmations" },
            { step: "2", title: "Grounding Rituals" },
            { step: "3", title: "Your Boundaries" },
            { step: "4", title: "Self-Care Commitments" },
            { step: "5", title: "Motivation Triggers" },
            { step: "6", title: "Your Support System" },
            { step: "7", title: "Who You Need to Become" },
          ].map((item, index) => (
            <div
              key={item.step}
              className={`flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3 ${
                index === 6 ? "md:col-span-2" : ""
              }`}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1a2744] text-xs font-bold text-white">
                {item.step}
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
          Build Your Mindset System
        </button>
        <p className="mt-4 text-sm text-slate-500">
          Takes approximately 10-15 minutes to complete
        </p>
      </div>
    </StepContainer>
  );
}
