"use client";

import { Target } from "lucide-react";
import { SectionCover, DefinitionBox } from "@/components/business-plan/section-one/ui";

interface StepOverviewProps {
  onStart: () => void;
}

export function StepOverview({ onStart }: StepOverviewProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-6xl px-5 duration-700">
      <SectionCover
        number="5"
        title="Accountability & Progress Tracking"
        subtitle="Create your action plan, define your ideal clients, and commit to your success with systems that keep you on track."
        icon={Target}
        progress={0}
      />

      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-12 space-y-8">
          <DefinitionBox
            title="What It Is"
            content="This is your execution blueprint. While earlier sections focused on reflection, analysis, and mindset, Section 5 is where you build the systems that turn strategy into action. You'll create project plans, identify ideal clients, define your prospecting and marketing mix, and sign your commitment contract."
          />
          <DefinitionBox
            title="Why It Matters"
            content="A plan without accountability is just a wish. This section ensures you have concrete projects to work on, clear targets to pursue, and a commitment that holds you responsible. By the end, you'll have a roadmap that keeps you focused when distractions arise and progress feels slow."
          />
          <DefinitionBox
            title="How to Fill It Out"
            content="Work through each part systematically. Start with your Project Matrix to organize key initiatives, then explore your resources and define your ideal clients. Build your prospecting and marketing mix, plan quarterly activities, and finish by signing your Commitment Contract—the final step of your entire business plan."
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
          <h3 className="mb-4 text-center font-bold text-slate-900">
            The 7-Part Accountability System
          </h3>
          <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">Part 5A</span>
              <p className="text-sm text-slate-600">Project Matrix</p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">Part 5B</span>
              <p className="text-sm text-slate-600">Exploring Your Resources</p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">Part 5C</span>
              <p className="text-sm text-slate-600">Defining Your Ideal Client</p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">Part 5D</span>
              <p className="text-sm text-slate-600">Your Prospecting Mix</p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">Part 5E</span>
              <p className="text-sm text-slate-600">Your Marketing Mix</p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">Part 5F</span>
              <p className="text-sm text-slate-600">Quarterly Marketing Overview</p>
            </div>
            <div className="col-span-1 rounded-lg bg-white p-4 shadow-sm md:col-span-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F172A]">Part 5G</span>
              <p className="text-sm text-slate-600">Your Commitment Contract</p>
            </div>
          </div>
          <div className="text-center">
            <button
              onClick={onStart}
              className="transform rounded-full bg-[#0F172A] px-10 py-4 font-bold text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-slate-800 hover:shadow-xl"
            >
              Build Your Accountability System
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
