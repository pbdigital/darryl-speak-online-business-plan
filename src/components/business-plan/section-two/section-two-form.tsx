"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  MoreHorizontal,
  Trash2,
  FileX,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSectionTwoStore } from "@/stores/section-two-store";
import {
  ProgressStepper,
  EncouragementToast,
  AnimatedCheckmark,
} from "@/components/business-plan/section-one/ui";

import { StepOverview } from "./steps/step-overview";
import { StepStrengths } from "./steps/step-strengths";
import { StepWeaknesses } from "./steps/step-weaknesses";
import { StepOpportunities } from "./steps/step-opportunities";
import { StepThreats } from "./steps/step-threats";
import { StepComplete } from "./steps/step-complete";

const TOTAL_STEPS = 6; // 0-5 (Overview + 4 content steps + Complete)

const ENCOURAGEMENT_MESSAGES: Record<number, string> = {
  1: "Strengths identified. Now to address the gaps.",
  3: "Halfway through. Your strategy is taking shape.",
};

export function SectionTwoForm() {
  const {
    currentStep,
    setCurrentStep,
    resetSection,
    resetStrengths,
    resetWeaknesses,
    resetOpportunities,
    resetThreats,
    isDirty,
    markSaved,
    highestStepReached,
  } = useSectionTwoStore();

  // Local state for UI - initialized from store
  const [activeStep, setActiveStep] = useState(currentStep);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [startTime] = useState(() => Date.now());

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

  const handleClearPage = useCallback(() => {
    switch (activeStep) {
      case 1:
        resetStrengths();
        break;
      case 2:
        resetWeaknesses();
        break;
      case 3:
        resetOpportunities();
        break;
      case 4:
        resetThreats();
        break;
      default:
        break;
    }
  }, [
    activeStep,
    resetStrengths,
    resetWeaknesses,
    resetOpportunities,
    resetThreats,
  ]);

  const handleClearAll = useCallback(() => {
    if (
      window.confirm(
        "Are you sure you want to clear all data in Section 2? This cannot be undone."
      )
    ) {
      resetSection();
      setActiveStep(0); // Reset to overview
    }
  }, [resetSection]);

  // Change-based auto-save indicator (triggers when data changes, not on a timer)
  useEffect(() => {
    if (!isDirty || activeStep === 0) return;

    const saveTimer = setTimeout(() => {
      setIsSaving(true);
      setTimeout(() => {
        setIsSaving(false);
        setShowSaved(true);
        markSaved();
        setTimeout(() => setShowSaved(false), 1500);
      }, 400);
    }, 1000); // 1-second debounce after last change

    return () => clearTimeout(saveTimer);
  }, [isDirty, activeStep, markSaved]);

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

  const handleHideToast = useCallback(() => {
    setShowToast(false);
    setToastMessage("");
  }, []);

  const handleNext = () => {
    if (activeStep < TOTAL_STEPS - 1) {
      // Start exit transition
      setIsTransitioning(true);

      // After exit animation, change step
      setTimeout(() => {
        const nextStep = activeStep + 1;
        setActiveStep(nextStep);
        window.scrollTo({ top: 0, behavior: "smooth" });

        // Show encouragement toast for milestone steps
        const message = ENCOURAGEMENT_MESSAGES[activeStep];
        if (message) {
          setTimeout(() => {
            setToastMessage(message);
            setShowToast(true);
          }, 400);
        }

        // End transition
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
        return <StepOverview onStart={() => setActiveStep(1)} />;
      case 1:
        return <StepStrengths />;
      case 2:
        return <StepWeaknesses />;
      case 3:
        return <StepOpportunities />;
      case 4:
        return <StepThreats />;
      case 5:
        return <StepComplete startTime={startTime} />;
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
          highestStepReached={highestStepReached}
          onStepClick={handleStepNavigation}
          showPercentage={activeStep > 0}
          className="mx-6 flex-1"
        />

        <div className="flex items-center gap-2">
          {/* Animated Save Indicator - fixed width to prevent layout shift */}
          <div
            className={`flex w-16 items-center justify-end gap-1.5 text-xs font-bold uppercase transition-all duration-300 ${
              isSaving || showSaved ? "opacity-100" : "opacity-0"
            }`}
          >
            {isSaving ? (
              <span className="text-slate-400">Saving...</span>
            ) : showSaved ? (
              <>
                <AnimatedCheckmark size={14} className="text-emerald-600" />
                <span className="text-emerald-600">Saved</span>
              </>
            ) : null}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-slate-400 transition-colors hover:text-slate-900">
                <MoreHorizontal size={20} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={handleClearPage}
                disabled={activeStep === 0 || activeStep === 5}
                className="cursor-pointer"
              >
                <FileX className="mr-2 h-4 w-4" />
                Clear Page
              </DropdownMenuItem>
              <DropdownMenuSeparator />
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
        className={`pt-12 transition-all duration-300 ${
          isTransitioning
            ? "animate-fade-out-up opacity-0"
            : "animate-fade-in-up"
        }`}
      >
        {renderStep()}
      </div>

      {/* Encouragement Toast */}
      <EncouragementToast
        message={toastMessage}
        show={showToast}
        onHide={handleHideToast}
      />

      {/* Floating Navigation Footer */}
      {activeStep > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-100 bg-white p-6 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
          <div className="mx-auto flex max-w-3xl items-center justify-between">
            <button
              onClick={handleBack}
              className="group flex items-center px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400 transition-colors hover:text-slate-600"
            >
              <ArrowLeft className="mr-2 h-3 w-3 opacity-0 transition-all group-hover:-translate-x-1 group-hover:opacity-100" />
              Back
            </button>

            {activeStep === TOTAL_STEPS - 1 ? (
              <Link
                href="/plan/section-3"
                className="group flex items-center rounded-full bg-emerald-600 px-8 py-4 text-xs font-bold uppercase tracking-widest text-white shadow-lg transition-all hover:scale-[1.02] hover:bg-emerald-700 hover:shadow-xl active:scale-[0.98]"
              >
                Continue to Section 3
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <button
                onClick={handleNext}
                className="group flex items-center rounded-full bg-[#1E293B] px-8 py-4 text-xs font-bold uppercase tracking-widest text-white shadow-lg transition-all hover:scale-[1.02] hover:bg-slate-700 hover:shadow-xl active:scale-[0.98]"
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
