"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2, ArrowRight } from "lucide-react";

interface StepProgressCardProps {
  title: string;
  filledCount: number;
  totalCount: number;
  nextStep?: string;
  className?: string;
}

export function StepProgressCard({
  title,
  filledCount,
  totalCount,
  nextStep,
  className,
}: StepProgressCardProps) {
  const isComplete = filledCount >= totalCount;
  const hasProgress = filledCount > 0;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl bg-[#0F172A] p-6 text-white transition-all",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-white/70">
            {title}
          </p>
          <p className="text-3xl font-extrabold tracking-tight">
            {filledCount} <span className="text-lg font-normal text-white/60">/ {totalCount}</span>
          </p>
          <p className="mt-1 text-sm text-white/60">
            {isComplete ? "All completed" : hasProgress ? "fields completed" : "fields to complete"}
          </p>
          {nextStep && (
            <p className="mt-3 flex items-center gap-1.5 text-sm text-white/60">
              <span>Next: {nextStep}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </p>
          )}
        </div>
        <div
          className={cn(
            "rounded-full p-3",
            isComplete ? "bg-emerald-500/20" : "bg-white/10"
          )}
        >
          <CheckCircle2
            className={cn(
              "h-6 w-6",
              isComplete ? "text-emerald-400" : "text-white/60"
            )}
          />
        </div>
      </div>
    </div>
  );
}
