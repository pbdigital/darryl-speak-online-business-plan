"use client";

import { useState, useEffect } from "react";
import { useSectionOneStore } from "@/stores/section-one-store";
import { GoalListStep } from "./goal-list-step";
import { GoalBreakdownStep } from "./goal-breakdown-step";
import { GoalSummaryStep } from "./goal-summary-step";

export function GoalBuilder() {
  const goals = useSectionOneStore((state) => state.data.goals) ?? [];
  const addGoal = useSectionOneStore((state) => state.addGoal);

  // Read sub-step from store (single source of truth)
  const subStepType = useSectionOneStore((state) => state.goalBuilderSubStep);
  const goalIndex = useSectionOneStore((state) => state.goalBuilderGoalIndex);
  const setGoalBuilderSubStep = useSectionOneStore((state) => state.setGoalBuilderSubStep);

  const [isTransitioning, setIsTransitioning] = useState(false);

  // Get valid goals (with titles)
  const validGoals = goals.filter((g) => g.title.trim() !== "");

  // Initialize with one empty goal if none exist
  useEffect(() => {
    if (goals.length === 0) {
      addGoal();
    }
  }, [goals.length, addGoal]);

  // Transition helper - updates store and handles animation
  const transitionTo = (nextSubStep: "list" | "breakdown" | "summary", nextGoalIndex?: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setGoalBuilderSubStep(nextSubStep, nextGoalIndex);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => setIsTransitioning(false), 50);
    }, 200);
  };

  // Navigation handlers for GoalSummaryStep
  const handleBackToLastGoal = () => {
    if (validGoals.length > 0) {
      transitionTo("breakdown", validGoals.length - 1);
    } else {
      transitionTo("list");
    }
  };

  const handleEditGoal = (index: number) => {
    if (index === -1) {
      // "Add more goals" clicked
      transitionTo("list");
    } else {
      transitionTo("breakdown", index);
    }
  };

  // Render current sub-step
  const renderSubStep = () => {
    switch (subStepType) {
      case "list":
        return <GoalListStep />;

      case "breakdown": {
        const goal = validGoals[goalIndex];
        if (!goal) {
          // Invalid goal index, go back to list
          setGoalBuilderSubStep("list");
          return null;
        }
        return (
          <GoalBreakdownStep
            goalId={goal.id}
            goalIndex={goalIndex}
            totalGoals={validGoals.length}
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
