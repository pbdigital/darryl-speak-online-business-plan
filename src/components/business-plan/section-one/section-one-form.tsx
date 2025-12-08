"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight, MoreHorizontal } from "lucide-react";

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

export function SectionOneForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [startTime] = useState(() => Date.now());

  // Simulated auto-save indicator with animated checkmark
  useEffect(() => {
    if (activeStep === 0) return;

    const timer = setInterval(() => {
      setIsSaving(true);
      setTimeout(() => {
        setIsSaving(false);
        setShowSaved(true);
        setTimeout(() => setShowSaved(false), 1500);
      }, 800);
    }, 10000);

    return () => clearInterval(timer);
  }, [activeStep]);

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
          <button className="text-slate-400 transition-colors hover:text-slate-900">
            <MoreHorizontal size={20} />
          </button>
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
                href="/plan"
                className="group flex items-center rounded-full bg-[#1E293B] px-8 py-4 text-xs font-bold uppercase tracking-widest text-white shadow-lg transition-all hover:scale-[1.02] hover:bg-slate-700 hover:shadow-xl active:scale-[0.98]"
              >
                Complete Section
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
