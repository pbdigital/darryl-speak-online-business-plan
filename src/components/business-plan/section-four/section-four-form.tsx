"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProgressStepper, ValidationToast } from "@/components/business-plan/section-one/ui";
import { useSectionFourStore } from "@/stores/section-four-store";
import { useAutoSave } from "@/hooks/use-auto-save";
import { useHydrateSection } from "@/hooks/use-hydrate-section";
import { SectionSkeleton } from "../ui/section-skeleton";
import { SaveIndicator } from "../ui/save-indicator";
import type { MindsetSection } from "@/types/business-plan";

import { StepOverview } from "./steps/step-overview";
import { StepAffirmations } from "./steps/step-affirmations";
import { StepRoutines } from "./steps/step-routines";
import { StepBoundaries } from "./steps/step-boundaries";
import { StepSelfCare } from "./steps/step-self-care";
import { StepMotivation } from "./steps/step-motivation";
import { StepSupport } from "./steps/step-support";
import { StepBecoming } from "./steps/step-becoming";
import { StepComplete } from "./steps/step-complete";

const TOTAL_STEPS = 9; // 0-8 (Overview + 7 content steps + Complete)

const STEP_LABELS = [
  "Overview",
  "Affirmations",
  "Routines",
  "Boundaries",
  "Self-Care",
  "Motivation",
  "Support",
  "Becoming",
  "Complete",
];

export function SectionFourForm() {
  const { currentStep, setCurrentStep, resetSection, isDirty, markSaved, highestStepReached, hydrate, getData, isStepComplete, getStepMissingFields } = useSectionFourStore();

  // Hydrate store with server data on mount
  const { isHydrating } = useHydrateSection<MindsetSection>("mindset", hydrate);

  // Auto-save to server when dirty
  const { status: saveStatus, lastSavedAt, saveNow } = useAutoSave(
    "mindset",
    getData,
    isDirty,
    markSaved
  );

  // Local state for UI - initialized from store
  const [activeStep, setActiveStep] = useState(currentStep);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Validation toast state
  const [showValidationToast, setShowValidationToast] = useState(false);
  const [validationMissingFields, setValidationMissingFields] = useState<string[]>([]);

  // Sync local state with store on mount (in case store has persisted step)
  useEffect(() => {
    if (currentStep > 0 && currentStep !== activeStep) {
      setActiveStep(currentStep);
    }
  }, []); // Only on mount

  // Update store whenever local step changes
  useEffect(() => {
    setCurrentStep(activeStep);
  }, [activeStep, setCurrentStep]);

  const handleClearAll = useCallback(() => {
    if (window.confirm("Are you sure you want to clear all data in Section 4? This cannot be undone.")) {
      resetSection();
      setActiveStep(0); // Reset to overview
    }
  }, [resetSection]);

  // Save immediately when navigating away
  const handleNavigationSave = useCallback(async () => {
    if (isDirty) {
      await saveNow();
    }
  }, [isDirty, saveNow]);

  // Handler for clicking on progress stepper dots
  const handleStepNavigation = useCallback((step: number) => {
    if (step <= highestStepReached && step !== activeStep) {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveStep(step);
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => setIsTransitioning(false), 50);
      }, 200);
    }
  }, [highestStepReached, activeStep]);

  const handleHideValidationToast = useCallback(() => {
    setShowValidationToast(false);
    setValidationMissingFields([]);
  }, []);

  // Show skeleton while hydrating - must be after all hooks
  if (isHydrating) {
    return <SectionSkeleton />;
  }

  const handleNext = () => {
    if (activeStep < TOTAL_STEPS - 1) {
      // Check if current step is incomplete and show validation feedback
      const missingFields = getStepMissingFields(activeStep);
      if (missingFields.length > 0) {
        setValidationMissingFields(missingFields);
        setShowValidationToast(true);
      }

      setIsTransitioning(true);
      setTimeout(() => {
        setActiveStep(activeStep + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => setIsTransitioning(false), 50);
      }, 300);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveStep(activeStep - 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => setIsTransitioning(false), 50);
      }, 300);
    }
  };

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return <StepOverview onStart={() => {
          setIsTransitioning(true);
          setTimeout(() => {
            setActiveStep(1);
            window.scrollTo({ top: 0, behavior: "smooth" });
            setTimeout(() => setIsTransitioning(false), 50);
          }, 300);
        }} />;
      case 1:
        return <StepAffirmations />;
      case 2:
        return <StepRoutines />;
      case 3:
        return <StepBoundaries />;
      case 4:
        return <StepSelfCare />;
      case 5:
        return <StepMotivation />;
      case 6:
        return <StepSupport />;
      case 7:
        return <StepBecoming />;
      case 8:
        return <StepComplete />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-100 bg-white/90 px-6 py-4 shadow-sm backdrop-blur-md">
        <Link
          href="/plan"
          className="group flex items-center text-xs font-bold uppercase tracking-widest text-slate-500 transition-colors hover:text-slate-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />{" "}
          Dashboard
        </Link>

        {/* Progress Stepper */}
        <ProgressStepper
          currentStep={activeStep}
          totalSteps={TOTAL_STEPS}
          stepLabels={STEP_LABELS}
          highestStepReached={highestStepReached}
          onStepClick={handleStepNavigation}
          showPercentage={activeStep > 0}
          className="mx-6 flex-1"
          isStepComplete={isStepComplete}
        />

        <div className="flex items-center gap-2">
          {/* Save Status Indicator */}
          <SaveIndicator status={saveStatus} lastSavedAt={lastSavedAt} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-slate-400 transition-colors hover:text-slate-900">
                <MoreHorizontal size={20} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={handleClearAll}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All Data
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content with Transitions */}
      <div
        className={`transition-all duration-300 ${
          isTransitioning ? "animate-fade-out-up opacity-0" : "animate-fade-in-up"
        }`}
      >
        {renderStep()}
      </div>

      {/* Validation Toast */}
      <ValidationToast
        missingFields={validationMissingFields}
        show={showValidationToast}
        onHide={handleHideValidationToast}
      />

      {/* Floating Navigation Footer */}
      {activeStep > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-100 bg-white p-6 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
          <div className="mx-auto flex max-w-3xl items-center justify-between">
            <button
              onClick={handleBack}
              className="group flex cursor-pointer items-center py-4 pr-6 text-xs font-bold uppercase tracking-widest text-slate-400 transition-colors hover:text-slate-600"
            >
              <ChevronLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back
            </button>

            {activeStep === TOTAL_STEPS - 1 ? (
              // Completion page - Continue to Section 5
              <Link
                href="/plan/section-5"
                onClick={handleNavigationSave}
                className="group flex items-center rounded-full bg-emerald-600 px-8 py-4 text-xs font-bold uppercase tracking-widest text-white shadow-lg transition-all hover:scale-[1.02] hover:bg-emerald-700 hover:shadow-xl active:scale-[0.98]"
              >
                Continue to Section 5
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              // All other steps - Next Step
              <button
                onClick={handleNext}
                className="group flex cursor-pointer items-center rounded-full bg-[#1E293B] px-8 py-4 text-xs font-bold uppercase tracking-widest text-white shadow-lg transition-all hover:scale-[1.02] hover:bg-slate-700 hover:shadow-xl active:scale-[0.98]"
              >
                Next Step
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
