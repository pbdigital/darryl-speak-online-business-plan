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
  highestStepReached?: number;
  onStepClick?: (step: number) => void;
  className?: string;
  stepLabels?: string[];
  /** Optional callback to check if a step is complete (based on field validation, not navigation) */
  isStepComplete?: (step: number) => boolean;
}

export function ProgressStepper({
  currentStep,
  totalSteps,
  highestStepReached = currentStep,
  onStepClick,
  className,
  stepLabels = DEFAULT_STEP_LABELS,
  isStepComplete,
}: ProgressStepperProps) {
  // Calculate progress percentage
  const progressPercentage = Math.round((currentStep / (totalSteps - 1)) * 100);

  // Check if a step should show as complete (with checkmark)
  // If isStepComplete callback is provided, use field-based validation
  // Otherwise, fall back to navigation-based (any step before current is "complete")
  const shouldShowComplete = (stepIndex: number): boolean => {
    if (isStepComplete) {
      // Use field-based validation: only show complete if actually filled
      return isStepComplete(stepIndex);
    }
    // Fallback: navigation-based (legacy behavior)
    return stepIndex < currentStep;
  };

  // Check if a step can be navigated to
  const canNavigateTo = (stepIndex: number) => {
    return stepIndex <= highestStepReached;
  };

  // Handle step click
  const handleStepClick = (stepIndex: number) => {
    if (canNavigateTo(stepIndex) && onStepClick) {
      onStepClick(stepIndex);
    }
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      {/* Mobile view: Progress bar only */}
      <div className="flex flex-col items-center md:hidden">
        <div className="h-1 w-24 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-emerald-400 transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
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
                  // Connector is green only if we've reached or passed this step
                  i <= currentStep ? "bg-emerald-400" : "bg-slate-200"
                )}
              />
            )}

            {/* Step dot with tooltip */}
            <div className="group relative">
              <button
                onClick={() => handleStepClick(i)}
                disabled={!canNavigateTo(i)}
                className={cn(
                  "relative flex h-3 w-3 items-center justify-center rounded-full transition-all duration-300",
                  i === currentStep
                    ? "bg-slate-900 ring-4 ring-slate-900/10"
                    : shouldShowComplete(i)
                      ? "bg-emerald-400 cursor-pointer hover:scale-125"
                      : canNavigateTo(i)
                        ? "bg-slate-200 cursor-pointer hover:bg-slate-300 hover:scale-110"
                        : "bg-slate-200 cursor-not-allowed opacity-50"
                )}
                aria-label={`${canNavigateTo(i) ? "Go to " : ""}Step ${i + 1}: ${stepLabels[i] || `Step ${i + 1}`}`}
              >
                {/* Completed checkmark - shows based on actual field completion */}
                {i !== currentStep && shouldShowComplete(i) && (
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
                {canNavigateTo(i) && i !== currentStep ? "Go to: " : ""}
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
