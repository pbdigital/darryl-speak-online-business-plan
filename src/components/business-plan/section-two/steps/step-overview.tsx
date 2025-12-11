"use client";

import { Grid2X2, Clock } from "lucide-react";
import {
  SectionCover,
  DefinitionBox,
} from "@/components/business-plan/section-one/ui";

interface StepOverviewProps {
  onStart: () => void;
}

export function StepOverview({ onStart }: StepOverviewProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-6xl px-5 duration-700">
      <SectionCover
        number="2"
        title="SWOT Analysis"
        subtitle="Evaluate your position to build a resilient business strategy."
        icon={Grid2X2}
        progress={0}
      />

      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-12 space-y-8">
          <DefinitionBox
            title="What It Is"
            content="SWOT stands for Strengths, Weaknesses, Opportunities, and Threats. It's a self-assessment tool to help you evaluate your current position in business."
          />
          <DefinitionBox
            title="Why It Matters"
            content="Awareness of your strengths and areas of improvement empowers you to take focused, effective action. It helps you play to your strengths while proactively addressing challenges."
          />
          <DefinitionBox
            title="How to Fill It Out"
            content="Use the prompts to brainstorm your current strengths, weaknesses, external opportunities, and possible threats. For each, include action steps to maximize or address them."
          />
        </div>

        <div className="mb-8 rounded-2xl border border-slate-200 bg-slate-50 p-8">
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-900">
            Guidance for Each Section
          </h4>
          <ul className="space-y-3 text-slate-600">
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-400" />
              <span>
                <strong>Strengths:</strong> Where can you leverage what you do
                well?
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-amber-400" />
              <span>
                <strong>Weaknesses:</strong> What do you need to accept,
                delegate, or improve?
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-400" />
              <span>
                <strong>Opportunities:</strong> What chances for growth or
                change exist?
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-rose-400" />
              <span>
                <strong>Threats:</strong> What internal or external factors
                could hold you back?
              </span>
            </li>
          </ul>
        </div>

        <div className="text-center">
          {/* Time estimate */}
          <div className="mb-6 flex items-center justify-center gap-2 text-sm text-slate-500">
            <Clock className="h-4 w-4" />
            <span>Estimated time: 15-20 minutes</span>
          </div>

          <button
            onClick={onStart}
            className="transform rounded-full bg-[#1E293B] px-10 py-4 font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:bg-slate-700 hover:shadow-xl active:scale-[0.98]"
          >
            Start Analysis
          </button>
        </div>
      </div>
    </div>
  );
}
