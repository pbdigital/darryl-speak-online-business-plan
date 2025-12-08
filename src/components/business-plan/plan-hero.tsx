"use client";

import { Progress } from "@/components/ui/progress";
import { DecorativeStars } from "./decorative-stars";
import { cn } from "@/lib/utils";

interface PlanHeroProps {
  year?: number;
  completedSections?: number;
  totalSections?: number;
  className?: string;
}

export function PlanHero({
  year = 2026,
  completedSections = 0,
  totalSections = 5,
  className,
}: PlanHeroProps) {
  const progressPercentage = Math.round((completedSections / totalSections) * 100);

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-2xl bg-primary px-6 py-10 text-primary-foreground md:px-12 md:py-16",
        className
      )}
    >
      <DecorativeStars variant="light" />

      <div className="relative z-10">
        {/* Gear illustration placeholder */}
        <div className="mb-6 flex justify-center md:mb-8">
          <svg
            className="h-20 w-20 text-white/20 md:h-28 md:w-28"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Gear 1 */}
            <circle cx="35" cy="50" r="15" stroke="currentColor" strokeWidth="2" />
            <circle cx="35" cy="50" r="8" stroke="currentColor" strokeWidth="1.5" />
            {/* Gear teeth */}
            <path d="M35 33 L33 30 L37 30 Z" stroke="currentColor" strokeWidth="1" />
            <path d="M35 67 L33 70 L37 70 Z" stroke="currentColor" strokeWidth="1" />
            <path d="M18 50 L15 48 L15 52 Z" stroke="currentColor" strokeWidth="1" />
            <path d="M52 50 L55 48 L55 52 Z" stroke="currentColor" strokeWidth="1" />

            {/* Gear 2 */}
            <circle cx="60" cy="40" r="12" stroke="currentColor" strokeWidth="2" />
            <circle cx="60" cy="40" r="6" stroke="currentColor" strokeWidth="1.5" />

            {/* Arrow */}
            <path
              d="M30 25 L70 15 L75 20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path d="M70 15 L68 22 L75 20" fill="currentColor" />
          </svg>
        </div>

        {/* Title */}
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-widest text-white/60 md:text-base">
            The Ultimate
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            {year} Real Estate
          </h1>
          <h2 className="mt-1 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            <span className="font-normal">Business</span> Plan
          </h2>

          <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-white/30" />

          <p className="mx-auto mt-6 max-w-md text-base italic text-white/80 md:text-lg">
            Your Blueprint for Breakthroughs, Listings, and a Life Worth Smiling About
          </p>
        </div>

        {/* Progress Section */}
        <div className="mx-auto mt-8 max-w-sm md:mt-10">
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/70">Your Progress</span>
            <span className="font-semibold">{progressPercentage}% Complete</span>
          </div>
          <Progress
            value={progressPercentage}
            className="mt-2 h-3 bg-white/20"
            indicatorClassName="bg-white"
          />
          <p className="mt-2 text-center text-sm text-white/60">
            {completedSections} of {totalSections} sections completed
          </p>
        </div>
      </div>
    </section>
  );
}
