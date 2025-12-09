"use client";

import { cn } from "@/lib/utils";

const DEFAULT_STEP_LABELS = [
  "Overview",
  "Production",
  "Reflection",
  "Gratitude",
  "Values",
  "Goals",
  "Wellness",
  "Mantra",
  "Celebration",
  "Complete",
];

interface ProgressStepperProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
  stepLabels?: string[];
}

export function ProgressStepper({
  currentStep,
  totalSteps,
  className,
  stepLabels = DEFAULT_STEP_LABELS,
}: ProgressStepperProps) {
  return (
    <div className={cn("flex flex-col items-center", className)}>
      {/* Mobile view: Simple text indicator */}
      <div className="flex items-center gap-2 md:hidden">
        <span className="text-xs font-medium text-slate-500">
          Step {currentStep} of {totalSteps - 1}
        </span>
        <div className="flex gap-1">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 w-1.5 rounded-full transition-all duration-300",
                i < currentStep
                  ? "bg-emerald-400"
                  : i === currentStep
                    ? "bg-slate-900"
                    : "bg-slate-200"
              )}
            />
          ))}
        </div>
      </div>

      {/* Desktop view: Full stepper with labels on hover */}
      <div className="hidden items-center md:flex">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className="flex items-center">
            {/* Connector line (not on first item) */}
            {i > 0 && (
              <div
                className={cn(
                  "h-0.5 w-6 transition-all duration-500",
                  i <= currentStep ? "bg-emerald-400" : "bg-slate-200"
                )}
              />
            )}

            {/* Step dot with tooltip */}
            <div className="group relative">
              <button
                className={cn(
                  "relative flex h-3 w-3 items-center justify-center rounded-full transition-all duration-300",
                  i < currentStep
                    ? "bg-emerald-400"
                    : i === currentStep
                      ? "bg-slate-900 ring-4 ring-slate-900/10"
                      : "bg-slate-200 hover:bg-slate-300"
                )}
                aria-label={`Step ${i + 1}: ${stepLabels[i] || `Step ${i + 1}`}`}
              >
                {/* Completed checkmark */}
                {i < currentStep && (
                  <svg
                    className="h-2 w-2 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={4}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}

                {/* Current step pulse */}
                {i === currentStep && (
                  <span className="absolute h-full w-full animate-ping rounded-full bg-slate-900/30" />
                )}
              </button>

              {/* Tooltip label on hover - now relative to just the dot */}
              <div className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-[10px] font-medium text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                {stepLabels[i] || `Step ${i + 1}`}
                <div className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-slate-900" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
