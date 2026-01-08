"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { CURRENT_PLAN_YEAR } from "@/lib/constants";
import { useSectionProgress } from "@/hooks/use-section-progress";

interface PlanHeroProps {
  year?: number;
  userName?: string;
  className?: string;
}

const DARRYL_QUOTES = [
  "The best business plan is the one you actually use.",
  "Success leaves clues. Follow the system.",
  "Your breakthrough year starts with a single decision.",
  "Plan your work, then work your plan.",
];

export function PlanHero({
  year = CURRENT_PLAN_YEAR,
  userName,
  className,
}: PlanHeroProps) {
  // Local mounted state ensures consistent SSR/client hydration
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { completedSections, totalSections, progressPercentage } = useSectionProgress();

  // Use 0 during SSR/hydration, real values after mount
  const displayProgress = mounted ? progressPercentage : 0;
  const displayCompleted = mounted ? completedSections : 0;
  const isLoading = !mounted;

  // Get a consistent quote based on the day of year (changes daily)
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  const quote = DARRYL_QUOTES[dayOfYear % DARRYL_QUOTES.length];

  return (
    <section
      className={cn(
        "relative overflow-hidden bg-[#0F172A] text-white pb-32 pt-12 md:pt-16 rounded-b-[2.5rem] md:rounded-b-[3rem] shadow-2xl",
        className
      )}
    >
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Large trend icon - top right */}
        <svg
          className="absolute -right-16 top-8 h-64 w-64 text-white/[0.05] md:h-80 md:w-80"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M23 6l-9.5 9.5-5-5L1 18" />
          <path d="M17 6h6v6" />
        </svg>

        {/* Star decoration - bottom left */}
        <svg
          className="absolute -left-8 bottom-16 h-48 w-48 text-white/[0.03]"
          viewBox="0 0 100 100"
          fill="currentColor"
        >
          <path d="M50 0 L54 46 L100 50 L54 54 L50 100 L46 54 L0 50 L46 46 Z" />
        </svg>

        {/* Gears with arrow illustration - right side, more visible */}
        <svg
          className="absolute right-4 top-1/2 h-56 w-56 -translate-y-1/2 text-white/[0.06] md:right-24 md:h-72 md:w-72"
          viewBox="0 0 200 200"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Large gear */}
          <circle cx="80" cy="110" r="35" />
          <circle cx="80" cy="110" r="20" />
          <circle cx="80" cy="110" r="5" fill="currentColor" />
          {/* Gear teeth */}
          <rect x="76" y="70" width="8" height="8" rx="1" />
          <rect x="76" y="142" width="8" height="8" rx="1" />
          <rect x="40" y="106" width="8" height="8" rx="1" />
          <rect x="112" y="106" width="8" height="8" rx="1" />

          {/* Small gear */}
          <circle cx="135" cy="65" r="25" />
          <circle cx="135" cy="65" r="14" />
          <circle cx="135" cy="65" r="4" fill="currentColor" />
          {/* Small gear teeth */}
          <rect x="131" y="36" width="8" height="6" rx="1" />
          <rect x="131" y="88" width="8" height="6" rx="1" />

          {/* Arrow going up */}
          <path d="M45 145 Q80 100 150 45" strokeWidth="3" />
          <path d="M140 38 L155 42 L148 55" strokeWidth="3" fill="none" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-12">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          {/* Left side - Main content */}
          <div className="max-w-4xl">
            {/* Edition badge */}
            {/* <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5">
              <svg
                className="h-4 w-4 text-blue-300"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 19l7-7 3 3-7 7-3-3z" />
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
                <path d="M2 2l7.586 7.586" />
                <circle cx="11" cy="11" r="2" />
              </svg>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
                {year} Edition
              </span>
            </div> */}

            {/* Main headline - matching PDF typography */}
            <h1 className="text-4xl leading-tight tracking-tight md:text-5xl lg:text-6xl">
              <span className="font-extrabold">
                The Ultimate
              </span>
              <br />
              <span className="font-extrabold">Real Estate Business Plan</span>

            </h1>

            {/* Tagline */}
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-400">
              Your blueprint for breakthroughs, listings, and a life worth
              smiling about.
            </p>

            {/* Darryl Quote Section */}
            <div className="mt-8 flex items-center gap-4">
              <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full border-2 border-white/20">
                <Image
                  src="/darryl.png"
                  alt="Darryl Davis"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm italic text-slate-300">
                  &ldquo;{quote}&rdquo;
                </p>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  — Darryl Davis
                </p>
              </div>
            </div>
          </div>

          {/* Right side - Progress card (glass effect) */}
          <div className="w-full min-w-[240px] rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-md md:w-auto">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-300">
                  {userName ? `Welcome back, ${userName}` : "Total Progress"}
                </p>
                {isLoading ? (
                  <div className="h-9 w-16 animate-pulse rounded bg-white/20" />
                ) : (
                  <p className="text-3xl font-bold text-white">
                    {displayProgress}%
                  </p>
                )}
              </div>
              {/* Live indicator dot */}
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-700/50">
              {isLoading ? (
                <div className="h-full w-1/3 animate-pulse rounded-full bg-white/20" />
              ) : (
                <div
                  className="h-full rounded-full bg-blue-400 transition-all duration-700 ease-out"
                  style={{ width: `${Math.max(displayProgress, 2)}%` }}
                />
              )}
            </div>
            {isLoading ? (
              <div className="mt-3 h-3 w-32 animate-pulse rounded bg-white/10" />
            ) : (
              <p className="mt-3 text-xs text-slate-400">
                {displayCompleted} of {totalSections} sections completed
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
