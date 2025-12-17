"use client";

import { cn } from "@/lib/utils";
import { Zap, AlertCircle, TrendingUp, Shield } from "lucide-react";
import type {
  StrengthItem,
  WeaknessItem,
  OpportunityItem,
  ThreatItem,
} from "@/stores/section-two-store";

interface SwotGridSummaryProps {
  strengths: StrengthItem[];
  weaknesses: WeaknessItem[];
  opportunities: OpportunityItem[];
  threats: ThreatItem[];
  className?: string;
}

export function SwotGridSummary({
  strengths,
  weaknesses,
  opportunities,
  threats,
  className,
}: SwotGridSummaryProps) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-2", className)}>
      {/* Strengths Quadrant */}
      <div className="rounded-2xl border-2 border-slate-100 bg-white p-6">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1a2744]">
            <Zap className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-[#1a2744]">
            Strengths
          </h3>
          <span className="ml-auto text-xs font-medium text-slate-500">
            {strengths.length} item{strengths.length !== 1 ? "s" : ""}
          </span>
        </div>
        {strengths.length > 0 ? (
          <ul className="space-y-2">
            {strengths.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-sm text-slate-700"
              >
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#1a2744]" />
                <span>{item.strength}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm italic text-slate-400">No items yet</p>
        )}
      </div>

      {/* Weaknesses Quadrant */}
      <div className="rounded-2xl border-2 border-slate-100 bg-white p-6">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1a2744]">
            <AlertCircle className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-[#1a2744]">
            Weaknesses
          </h3>
          <span className="ml-auto text-xs font-medium text-slate-500">
            {weaknesses.length} item{weaknesses.length !== 1 ? "s" : ""}
          </span>
        </div>
        {weaknesses.length > 0 ? (
          <ul className="space-y-2">
            {weaknesses.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-sm text-slate-700"
              >
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-400" />
                <span className="flex-1">{item.weakness}</span>
                {item.action && (
                  <span className="rounded-full bg-slate-200 px-2 py-0.5 text-xs font-bold uppercase text-slate-600">
                    {item.action[0]}
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm italic text-slate-400">No items yet</p>
        )}
      </div>

      {/* Opportunities Quadrant */}
      <div className="rounded-2xl border-2 border-slate-100 bg-white p-6">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1a2744]">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-[#1a2744]">
            Opportunities
          </h3>
          <span className="ml-auto text-xs font-medium text-slate-500">
            {opportunities.length} item{opportunities.length !== 1 ? "s" : ""}
          </span>
        </div>
        {opportunities.length > 0 ? (
          <ul className="space-y-2">
            {opportunities.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-sm text-slate-700"
              >
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#1a2744]" />
                <span>{item.possibility}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm italic text-slate-400">No items yet</p>
        )}
      </div>

      {/* Threats Quadrant */}
      <div className="rounded-2xl border-2 border-slate-100 bg-white p-6">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1a2744]">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-[#1a2744]">
            Threats
          </h3>
          <span className="ml-auto text-xs font-medium text-slate-500">
            {threats.length} item{threats.length !== 1 ? "s" : ""}
          </span>
        </div>
        {threats.length > 0 ? (
          <ul className="space-y-2">
            {threats.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-sm text-slate-700"
              >
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-400" />
                <span>{item.threat}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm italic text-slate-400">No items yet</p>
        )}
      </div>
    </div>
  );
}
