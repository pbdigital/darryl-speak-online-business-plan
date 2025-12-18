"use client";

import { useState, useEffect } from "react";
import { useSectionOneStore } from "@/stores/section-one-store";
import { GoalListStep } from "./goal-list-step";
import { GoalBreakdownStep } from "./goal-breakdown-step";
import { GoalSummaryStep } from "./goal-summary-step";

type SubStep =
  | { type: "list" }
  | { type: "breakdown"; goalIndex: number }
  | { type: "summary" };

export function GoalBuilder() {
  const goals = useSectionOneStore((state) => state.data.goals) ?? [];
  const addGoal = useSectionOneStore((state) => state.addGoal);

  // Internal sub-step state
  const [subStep, setSubStep] = useState<SubStep>({ type: "list" });
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Get valid goals (with titles)
  const validGoals = goals.filter((g) => g.title.trim() !== "");

  // Initialize with one empty goal if none exist
  useEffect(() => {
    if (goals.length === 0) {
      addGoal();
    }
  }, [goals.length, addGoal]);

  // Transition helper
  const transitionTo = (nextStep: SubStep) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSubStep(nextStep);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => setIsTransitioning(false), 50);
    }, 200);
  };

  // Navigation handlers
  const handleGoToBreakdown = () => {
    if (validGoals.length > 0) {
      transitionTo({ type: "breakdown", goalIndex: 0 });
    }
  };

  const handleBackToList = () => {
    transitionTo({ type: "list" });
  };

  const handleNextGoal = (currentIndex: number) => {
    if (currentIndex < validGoals.length - 1) {
      transitionTo({ type: "breakdown", goalIndex: currentIndex + 1 });
    } else {
      transitionTo({ type: "summary" });
    }
  };

  const handlePrevGoal = (currentIndex: number) => {
    if (currentIndex > 0) {
      transitionTo({ type: "breakdown", goalIndex: currentIndex - 1 });
    } else {
      transitionTo({ type: "list" });
    }
  };

  const handleBackToLastGoal = () => {
    if (validGoals.length > 0) {
      transitionTo({ type: "breakdown", goalIndex: validGoals.length - 1 });
    } else {
      transitionTo({ type: "list" });
    }
  };

  const handleEditGoal = (index: number) => {
    if (index === -1) {
      // "Add more goals" clicked
      transitionTo({ type: "list" });
    } else {
      transitionTo({ type: "breakdown", goalIndex: index });
    }
  };

  // Render current sub-step
  const renderSubStep = () => {
    switch (subStep.type) {
      case "list":
        return <GoalListStep onNext={handleGoToBreakdown} />;

      case "breakdown": {
        const goal = validGoals[subStep.goalIndex];
        if (!goal) {
          // Invalid goal index, go back to list
          setSubStep({ type: "list" });
          return null;
        }
        return (
          <GoalBreakdownStep
            goalId={goal.id}
            goalIndex={subStep.goalIndex}
            totalGoals={validGoals.length}
            onBack={() => handlePrevGoal(subStep.goalIndex)}
            onNext={() => handleNextGoal(subStep.goalIndex)}
          />
        );
      }

      case "summary":
        return (
          <GoalSummaryStep
            onBack={handleBackToLastGoal}
            onEditGoal={handleEditGoal}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`transition-all duration-300 ${
        isTransitioning ? "animate-fade-out-up opacity-0" : "animate-fade-in-up"
      }`}
    >
      {renderSubStep()}
    </div>
  );
}
