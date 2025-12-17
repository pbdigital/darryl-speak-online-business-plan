"use client";

import { Smile, Clock } from "lucide-react";
import { SectionCover, DefinitionBox } from "@/components/business-plan/section-one/ui";

interface StepOverviewProps {
  onStart: () => void;
}

export function StepOverview({ onStart }: StepOverviewProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 min-h-screen bg-gradient-to-b from-[#e8f4f8]/30 via-white to-white pb-8 duration-700">
      <div className="mx-auto max-w-6xl px-5">
        <SectionCover
          number="4"
          title="Mindset, Self-Care & Motivation"
          subtitle="Build the internal systems that keep you grounded, focused, and fueled—especially when things get challenging."
          icon={Smile}
          progress={0}
        />

        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-12 space-y-8">
            <DefinitionBox
              title="What It Is"
              content="Your mindset is the engine of your business. This section helps you strengthen the thoughts, habits, and routines that keep you grounded, focused, and fueled—especially when the market, clients, or life gets noisy."
            />
            <DefinitionBox
              title="Why It Matters"
              content="Real estate is a high-energy, high-emotion profession. Without strong internal systems—mindset, boundaries, and self-care—you risk burnout, inconsistency, and decision fatigue. A healthy mindset creates emotional endurance. Self-care restores your energy. Motivation keeps you moving when results feel slow."
            />
            <DefinitionBox
              title="How to Fill It Out"
              content="Use this section to build your personal 'stability system.' Work through each step to define your affirmations, grounding rituals, boundaries, self-care practices, motivation triggers, support network, and the person you need to become."
            />
          </div>

          <div className="rounded-3xl border-2 border-slate-100 bg-white p-8 shadow-sm">
            <h3 className="mb-4 text-center font-bold text-slate-900">
              The 7-Part Mindset System
            </h3>
            <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-100 bg-[#e8f4f8]/30 p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1a2744]">Step 1</span>
                <p className="text-sm text-slate-600">Motivating Affirmations</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-[#e8f4f8]/30 p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1a2744]">Step 2</span>
                <p className="text-sm text-slate-600">Grounding Rituals</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-[#e8f4f8]/30 p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1a2744]">Step 3</span>
                <p className="text-sm text-slate-600">Your Boundaries</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-[#e8f4f8]/30 p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1a2744]">Step 4</span>
                <p className="text-sm text-slate-600">Self-Care Commitments</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-[#e8f4f8]/30 p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1a2744]">Step 5</span>
                <p className="text-sm text-slate-600">Motivation Triggers</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-[#e8f4f8]/30 p-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1a2744]">Step 6</span>
                <p className="text-sm text-slate-600">Your Support System</p>
              </div>
              <div className="col-span-1 rounded-2xl border border-slate-100 bg-[#e8f4f8]/30 p-4 md:col-span-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1a2744]">Step 7</span>
                <p className="text-sm text-slate-600">Who You Need to Become</p>
              </div>
            </div>
            <div className="text-center">
              {/* Time estimate */}
              <div className="mb-6 flex items-center justify-center gap-2 text-sm text-slate-500">
                <Clock className="h-4 w-4" />
                <span>Estimated time: 10-15 minutes</span>
              </div>

              <button
                onClick={onStart}
                className="transform rounded-full bg-[#1a2744] px-10 py-4 font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-[#2d3e5f] hover:shadow-xl"
              >
                Build Your Mindset System
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
