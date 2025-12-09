"use client";

import { useState, useEffect, useMemo } from "react";
import { CheckCircle2, Clock, Grid2X2, ArrowRight } from "lucide-react";
import { useSectionTwoStore } from "@/stores/section-two-store";
import { SwotGridSummary } from "../ui";

interface StepCompleteProps {
  startTime?: number;
}

export function StepComplete({ startTime }: StepCompleteProps) {
  const [showReveal, setShowReveal] = useState(true);
  const [revealPhase, setRevealPhase] = useState(0);

  // Get raw data from store (stable references)
  const strengths = useSectionTwoStore((state) => state.data.strengths);
  const weaknesses = useSectionTwoStore((state) => state.data.weaknesses);
  const opportunities = useSectionTwoStore((state) => state.data.opportunities);
  const threats = useSectionTwoStore((state) => state.data.threats);

  // Filter filled items with useMemo to avoid infinite loops
  const filledStrengths = useMemo(
    () => strengths.filter((s) => s.strength.trim()),
    [strengths]
  );
  const filledWeaknesses = useMemo(
    () => weaknesses.filter((w) => w.weakness.trim()),
    [weaknesses]
  );
  const filledOpportunities = useMemo(
    () => opportunities.filter((o) => o.possibility.trim()),
    [opportunities]
  );
  const filledThreats = useMemo(
    () => threats.filter((t) => t.threat.trim()),
    [threats]
  );

  // Calculate total items (not fields)
  const totalItems =
    filledStrengths.length +
    filledWeaknesses.length +
    filledOpportunities.length +
    filledThreats.length;

  // Calculate time spent
  const timeSpent = startTime
    ? Math.round((Date.now() - startTime) / 1000 / 60)
    : 0;

  // Elegant reveal sequence
  useEffect(() => {
    const timers = [
      setTimeout(() => setRevealPhase(1), 300),
      setTimeout(() => setRevealPhase(2), 800),
      setTimeout(() => setRevealPhase(3), 1300),
      setTimeout(() => setShowReveal(false), 2200),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  if (showReveal) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
        <div
          className={`mb-6 transition-all duration-500 ${
            revealPhase >= 1
              ? "scale-100 opacity-100"
              : "scale-75 opacity-0"
          }`}
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#1E293B]">
            {revealPhase >= 2 ? (
              <svg
                className="h-10 w-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  className="animate-draw-check"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                  style={{
                    strokeDasharray: 24,
                    strokeDashoffset: 24,
                  }}
                />
              </svg>
            ) : (
              <div className="h-10 w-10" />
            )}
          </div>
        </div>

        <h2
          className={`text-center text-2xl font-bold text-slate-900 transition-all duration-500 ${
            revealPhase >= 3
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0"
          }`}
        >
          SWOT Complete
        </h2>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up mx-auto max-w-4xl px-4">
      {/* Hero Header */}
      <div className="mb-8 overflow-hidden rounded-3xl bg-[#1E293B] p-8 text-white md:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                Section Complete
              </span>
            </div>
            <h2 className="text-2xl font-extrabold md:text-3xl">
              SWOT Analysis
            </h2>
            <p className="mt-2 text-slate-400">
              Your strategic position at a glance
            </p>
          </div>

          {/* Stats Row */}
          <div className="flex gap-6 border-t border-slate-700 pt-6 md:border-l md:border-t-0 md:pl-8 md:pt-0">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5">
                <Grid2X2 className="h-4 w-4 text-slate-400" />
                <span className="text-2xl font-bold">{totalItems}</span>
              </div>
              <div className="text-xs text-slate-400">Items</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1.5">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-2xl font-bold">
                  {timeSpent > 0 ? timeSpent : "—"}
                </span>
              </div>
              <div className="text-xs text-slate-400">Minutes</div>
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold">2</span>
              <span className="text-lg text-slate-500">/5</span>
              <div className="text-xs text-slate-400">Sections</div>
            </div>
          </div>
        </div>
      </div>

      {/* SWOT Grid */}
      <SwotGridSummary
        strengths={filledStrengths}
        weaknesses={filledWeaknesses}
        opportunities={filledOpportunities}
        threats={filledThreats}
        className="mb-8"
      />

      {/* Strategic Actions - Compact */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">
          Strategic Actions
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="flex items-center gap-3 rounded-lg bg-white p-3">
            <ArrowRight className="h-4 w-4 text-[#1E293B]" />
            <span className="text-sm text-slate-600">
              <strong className="text-slate-900">Leverage</strong> strengths to
              seize opportunities
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-white p-3">
            <ArrowRight className="h-4 w-4 text-[#1E293B]" />
            <span className="text-sm text-slate-600">
              <strong className="text-slate-900">Improve</strong> weaknesses
              blocking growth
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-white p-3">
            <ArrowRight className="h-4 w-4 text-[#1E293B]" />
            <span className="text-sm text-slate-600">
              <strong className="text-slate-900">Monitor</strong> threats
              exploiting gaps
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-white p-3">
            <ArrowRight className="h-4 w-4 text-[#1E293B]" />
            <span className="text-sm text-slate-600">
              <strong className="text-slate-900">Defend</strong> with strengths
              against threats
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
