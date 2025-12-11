"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronRight, MoreHorizontal, Trash2, FileX } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSectionOneStore, SectionOneData } from "@/stores/section-one-store";

import { StepOverview } from "./steps/step-overview";
import { StepProductionNumbers } from "./steps/step-production-numbers";
import { StepReflectionQuestions } from "./steps/step-reflection-questions";
import { StepGratitude } from "./steps/step-gratitude";
import { StepSelfReflection } from "./steps/step-self-reflection";
import { StepGoalsIntentions } from "./steps/step-goals-intentions";
import { StepWellness } from "./steps/step-wellness";
import { StepMantra } from "./steps/step-mantra";
import { StepCelebration } from "./steps/step-celebration";
import { StepComplete } from "./steps/step-complete";
import { ProgressStepper, EncouragementToast, AnimatedCheckmark } from "./ui";

const TOTAL_STEPS = 10; // 0-9 (Overview + 8 content steps + Complete)

const ENCOURAGEMENT_MESSAGES: Record<number, string> = {
  2: "Beautifully reflected.",
  5: "You're doing meaningful work.",
  8: "Almost there. Keep going.",
};

// Map each step to its corresponding fields in the store
const STEP_FIELDS: Record<number, (keyof SectionOneData)[]> = {
  1: [
    "listingsTaken", "sellerSidesClosed", "buyerSidesClosed", "renterTransactions",
    "grossClosedCommissions", "didAchieveGoals", "biggestStruggles",
    "biggestAccomplishment", "prospectingMethods", "wantToContinue",
  ],
  2: ["significantAchievements", "challengesAndOvercoming", "learnedAboutSelf"],
  3: ["gratefulFor", "gratefulPeople", "joyfulMoments"],
  4: ["mostFulfilled", "leastSatisfied", "overallWellbeing", "coreValuesAlignment", "valuePrioritiesShift"],
  5: ["topGoalsIntentions", "goalsImportance", "goalStrategies", "immediateSteps", "potentialObstacles", "obstacleStrategies"],
  6: ["selfCarePriorities", "nurturingWellbeing", "selfCareMethods", "skillsToImprove", "learningCommitment", "giveBackCommunity", "positiveImpact"],
  7: ["mantra", "accountabilityMethod", "accountabilityPartner", "progressTrackingTools"],
  8: ["celebrationMilestones", "reflectionFrequency", "improvementsAndChanges", "coreImportance"],
  9: ["celebrationMethod", "encouragementMessage", "signature", "completionDate"],
};

export function SectionOneForm() {
  const { currentStep, setCurrentStep, updateField, resetSection, isDirty, markSaved, highestStepReached } = useSectionOneStore();

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
    const fields = STEP_FIELDS[activeStep];
    if (!fields) return;

    fields.forEach((field) => {
      const isNumericField = [
        "listingsTaken", "sellerSidesClosed", "buyerSidesClosed",
        "renterTransactions", "grossClosedCommissions",
      ].includes(field);

      if (isNumericField) {
        updateField(field, null as unknown as SectionOneData[typeof field]);
      } else {
        updateField(field, "" as SectionOneData[typeof field]);
      }
    });
  }, [activeStep, updateField]);

  const handleClearAll = useCallback(() => {
    if (window.confirm("Are you sure you want to clear all data in Section 1? This cannot be undone.")) {
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

  const handleHideToast = useCallback(() => {
    setShowToast(false);
    setToastMessage("");
  }, []);

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
      }, 200);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveStep(activeStep - 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => setIsTransitioning(false), 50);
      }, 200);
    }
  };

  const renderStep = () => {
    const stepProps = { startTime };

    switch (activeStep) {
      case 0:
        return <StepOverview onStart={() => setActiveStep(1)} />;
      case 1:
        return <StepProductionNumbers />;
      case 2:
        return <StepReflectionQuestions />;
      case 3:
        return <StepGratitude />;
      case 4:
        return <StepSelfReflection />;
      case 5:
        return <StepGoalsIntentions />;
      case 6:
        return <StepWellness />;
      case 7:
        return <StepMantra />;
      case 8:
        return <StepCelebration />;
      case 9:
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
                disabled={activeStep === 0}
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
          isTransitioning ? "animate-fade-out-up opacity-0" : "animate-fade-in-up"
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
                href="/plan/section-2"
                className="group flex items-center rounded-full bg-emerald-600 px-8 py-4 text-xs font-bold uppercase tracking-widest text-white shadow-lg transition-all hover:scale-[1.02] hover:bg-emerald-700 hover:shadow-xl active:scale-[0.98]"
              >
                Continue to Section 2
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
