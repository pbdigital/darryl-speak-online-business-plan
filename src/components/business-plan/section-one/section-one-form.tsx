"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Save, MoreHorizontal } from "lucide-react";

import { StepOverview } from "./steps/step-overview";
import { StepProductionNumbers } from "./steps/step-production-numbers";
import { StepReflectionQuestions } from "./steps/step-reflection-questions";
import { StepGratitude } from "./steps/step-gratitude";
import { StepSelfReflection } from "./steps/step-self-reflection";
import { StepGoalsIntentions } from "./steps/step-goals-intentions";
import { StepWellness } from "./steps/step-wellness";
import { StepMantra } from "./steps/step-mantra";
import { StepComplete } from "./steps/step-complete";

const TOTAL_STEPS = 9; // 0-8

export function SectionOneForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // Simulated auto-save indicator
  useEffect(() => {
    if (activeStep === 0) return; // Don't show saving on overview

    const timer = setInterval(() => {
      setIsSaving(true);
      setTimeout(() => setIsSaving(false), 1500);
    }, 10000);

    return () => clearInterval(timer);
  }, [activeStep]);

  const currentProgress = Math.round((activeStep / (TOTAL_STEPS - 1)) * 100);

  const handleNext = () => {
    if (activeStep < TOTAL_STEPS - 1) {
      setActiveStep(activeStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderStep = () => {
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
          className="flex items-center text-xs font-bold uppercase tracking-widest text-slate-500 transition-colors hover:text-slate-900"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Dashboard
        </Link>

        <div className="mx-6 hidden max-w-md flex-1 md:block">
          <div className="mb-1 flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <span>Section Progress</span>
            <span>{currentProgress}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full bg-slate-900 transition-all duration-700 ease-out"
              style={{ width: `${currentProgress}%` }}
            />
          </div>
        </div>

        <div className="flex w-auto items-center gap-4 text-right">
          <div
            className={`flex items-center gap-2 text-xs font-bold uppercase text-slate-400 transition-opacity duration-500 ${
              isSaving ? "opacity-100" : "opacity-0"
            }`}
          >
            <Save size={12} /> Saving...
          </div>
          <button className="text-slate-400 hover:text-slate-900">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-12">{renderStep()}</div>

      {/* Floating Navigation Footer */}
      {activeStep > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-100 bg-white p-6 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
          <div className="mx-auto flex max-w-3xl items-center justify-between">
            <button
              onClick={handleBack}
              className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-400 transition-colors hover:text-slate-600"
            >
              Back
            </button>

            <button
              onClick={activeStep === TOTAL_STEPS - 1 ? undefined : handleNext}
              className="group flex items-center rounded-full bg-[#0F172A] px-8 py-4 text-xs font-bold uppercase tracking-widest text-white shadow-lg transition-all hover:-translate-y-1 hover:bg-slate-800 hover:shadow-xl"
            >
              {activeStep === TOTAL_STEPS - 1 ? (
                <Link href="/plan">Complete Section</Link>
              ) : (
                <>
                  Next Step
                  <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
