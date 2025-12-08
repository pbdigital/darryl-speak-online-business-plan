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

const actionBadgeColors = {
  accept: "bg-slate-200 text-slate-700",
  delegate: "bg-slate-200 text-slate-700",
  improve: "bg-slate-200 text-slate-700",
};

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
      <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-6">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-200">
            <Zap className="h-4 w-4 text-emerald-700" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-emerald-800">
            Strengths
          </h3>
          <span className="ml-auto text-xs font-medium text-emerald-600">
            {strengths.length} item{strengths.length !== 1 ? "s" : ""}
          </span>
        </div>
        {strengths.length > 0 ? (
          <ul className="space-y-2">
            {strengths.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-sm text-emerald-900"
              >
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400" />
                <span>{item.strength}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm italic text-emerald-600/60">No items yet</p>
        )}
      </div>

      {/* Weaknesses Quadrant */}
      <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-6">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-700" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-amber-800">
            Weaknesses
          </h3>
          <span className="ml-auto text-xs font-medium text-amber-600">
            {weaknesses.length} item{weaknesses.length !== 1 ? "s" : ""}
          </span>
        </div>
        {weaknesses.length > 0 ? (
          <ul className="space-y-2">
            {weaknesses.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-sm text-amber-900"
              >
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber-400" />
                <span className="flex-1">{item.weakness}</span>
                {item.action && (
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-bold uppercase",
                      actionBadgeColors[item.action]
                    )}
                  >
                    {item.action[0]}
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm italic text-amber-600/60">No items yet</p>
        )}
      </div>

      {/* Opportunities Quadrant */}
      <div className="rounded-2xl border-2 border-blue-200 bg-blue-50 p-6">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-200">
            <TrendingUp className="h-4 w-4 text-blue-700" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-blue-800">
            Opportunities
          </h3>
          <span className="ml-auto text-xs font-medium text-blue-600">
            {opportunities.length} item{opportunities.length !== 1 ? "s" : ""}
          </span>
        </div>
        {opportunities.length > 0 ? (
          <ul className="space-y-2">
            {opportunities.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-sm text-blue-900"
              >
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-400" />
                <span>{item.possibility}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm italic text-blue-600/60">No items yet</p>
        )}
      </div>

      {/* Threats Quadrant */}
      <div className="rounded-2xl border-2 border-rose-200 bg-rose-50 p-6">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-200">
            <Shield className="h-4 w-4 text-rose-700" />
          </div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-rose-800">
            Threats
          </h3>
          <span className="ml-auto text-xs font-medium text-rose-600">
            {threats.length} item{threats.length !== 1 ? "s" : ""}
          </span>
        </div>
        {threats.length > 0 ? (
          <ul className="space-y-2">
            {threats.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-sm text-rose-900"
              >
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-rose-400" />
                <span>{item.threat}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm italic text-rose-600/60">No items yet</p>
        )}
      </div>
    </div>
  );
}
