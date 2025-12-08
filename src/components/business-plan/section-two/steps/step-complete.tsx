"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Clock, Grid2X2, Sparkles } from "lucide-react";
import { useSectionTwoStore } from "@/stores/section-two-store";
import { SwotGridSummary } from "../ui";

interface StepCompleteProps {
  startTime?: number;
}

export function StepComplete({ startTime }: StepCompleteProps) {
  const [showReveal, setShowReveal] = useState(true);
  const [revealPhase, setRevealPhase] = useState(0);

  // Get data from store
  const filledFieldCount = useSectionTwoStore((state) =>
    state.getFilledFieldCount()
  );
  const filledStrengths = useSectionTwoStore((state) =>
    state.getFilledStrengths()
  );
  const filledWeaknesses = useSectionTwoStore((state) =>
    state.getFilledWeaknesses()
  );
  const filledOpportunities = useSectionTwoStore((state) =>
    state.getFilledOpportunities()
  );
  const filledThreats = useSectionTwoStore((state) => state.getFilledThreats());

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
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
            {revealPhase >= 2 ? (
              <svg
                className="h-10 w-10 text-emerald-500"
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
      <div className="mb-10 text-center">
        <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-emerald-600">
          Complete
        </span>
        <h2 className="mb-2 text-3xl font-extrabold text-slate-900">
          SWOT Analysis Complete
        </h2>
        <p className="text-slate-500">
          Your strategic assessment at a glance.
        </p>
      </div>

      {/* Summary Card */}
      <div className="mb-10 overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/50 to-slate-50 shadow-sm">
        <div className="border-b border-emerald-100 bg-white/50 px-8 py-5">
          <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-emerald-800">
            <Sparkles className="h-4 w-4" /> Your SWOT Summary
          </h3>
        </div>
        <div className="grid gap-6 p-8 md:grid-cols-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
              <Grid2X2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">
                {totalItems}
              </div>
              <div className="text-xs text-slate-500">Items Identified</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
              <Clock className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">
                {timeSpent > 0 ? `~${timeSpent}` : "—"}
              </div>
              <div className="text-xs text-slate-500">Minutes Invested</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">2 of 5</div>
              <div className="text-xs text-slate-500">Sections Complete</div>
            </div>
          </div>
        </div>
      </div>

      {/* SWOT Grid Visual Summary */}
      <div className="mb-10">
        <h3 className="mb-6 text-center text-sm font-bold uppercase tracking-wider text-slate-700">
          Your Strategic Position
        </h3>
        <SwotGridSummary
          strengths={filledStrengths}
          weaknesses={filledWeaknesses}
          opportunities={filledOpportunities}
          threats={filledThreats}
        />
      </div>

      {/* Key Insights Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-900">
          Key Takeaways
        </h3>
        <p className="mb-6 text-sm leading-relaxed text-slate-500">
          Based on your SWOT analysis, consider these strategic priorities:
        </p>
        <ul className="space-y-3 text-sm text-slate-600">
          <li className="flex items-start gap-3">
            <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-emerald-400" />
            <span>
              <strong>Leverage:</strong> Use your strengths to capitalize on
              opportunities
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-amber-400" />
            <span>
              <strong>Improve:</strong> Address weaknesses that could block
              opportunities
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-400" />
            <span>
              <strong>Monitor:</strong> Watch for threats that could exploit
              weaknesses
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-rose-400" />
            <span>
              <strong>Prepare:</strong> Use strengths to defend against threats
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
