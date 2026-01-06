import { create } from "zustand";
import { persist } from "zustand/middleware";

// Goal interface for the per-goal breakdown flow
export interface Goal {
  id: string;
  title: string;
  whyImportant: string;
  howToAchieve: string;
  immediateSteps: string[]; // 1-3 items
  obstacles: string;
  strategies: string;
}

// Helper to create a new empty goal
export const createEmptyGoal = (): Goal => ({
  id: crypto.randomUUID(),
  title: "",
  whyImportant: "",
  howToAchieve: "",
  immediateSteps: ["", "", ""],
  obstacles: "",
  strategies: "",
});

// Data structure for all Section 1 fields
export interface SectionOneData {
  // Step 1: Production Numbers
  listingsTaken: number | null;
  sellerSidesClosed: number | null;
  buyerSidesClosed: number | null;
  renterTransactions: number | null;
  grossClosedCommissions: number | null;
  didAchieveGoals: string;
  biggestStruggles: string;
  biggestAccomplishment: string;
  prospectingMethods: string;
  wantToContinue: string;

  // Step 2: Reflection Questions
  significantAchievements: string;
  challengesAndOvercoming: string;
  learnedAboutSelf: string;

  // Step 3: Gratitude
  gratefulFor: string;
  gratefulPeople: string;
  joyfulMoments: string;

  // Step 4: Self-Reflection & Values
  mostFulfilled: string;
  leastSatisfied: string;
  overallWellbeing: string;
  coreValuesAlignment: string;
  valuePrioritiesShift: string;

  // Step 5: Goals (per-goal breakdown flow)
  goals: Goal[];

  // Step 6: Self-Care & Growth
  selfCarePriorities: string;
  nurturingWellbeing: string;
  selfCareMethods: string;
  skillsToImprove: string;
  learningCommitment: string;
  giveBackCommunity: string;
  positiveImpact: string;

  // Step 7: Mantra & Accountability
  mantra: string;
  accountabilityMethod: string;
  accountabilityPartner: string;
  progressTrackingTools: string;

  // Step 8: Celebration & Reflection
  celebrationMilestones: string;
  reflectionFrequency: string;
  improvementsAndChanges: string;
  coreImportance: string;

  // Step 9: Completion
  celebrationMethod: string;
  encouragementMessage: string;
  signature: string;
  completionDate: string;
}

// Initial empty state
const initialData: SectionOneData = {
  // Step 1
  listingsTaken: null,
  sellerSidesClosed: null,
  buyerSidesClosed: null,
  renterTransactions: null,
  grossClosedCommissions: null,
  didAchieveGoals: "",
  biggestStruggles: "",
  biggestAccomplishment: "",
  prospectingMethods: "",
  wantToContinue: "",

  // Step 2
  significantAchievements: "",
  challengesAndOvercoming: "",
  learnedAboutSelf: "",

  // Step 3
  gratefulFor: "",
  gratefulPeople: "",
  joyfulMoments: "",

  // Step 4
  mostFulfilled: "",
  leastSatisfied: "",
  overallWellbeing: "",
  coreValuesAlignment: "",
  valuePrioritiesShift: "",

  // Step 5: Goals
  goals: [],

  // Step 6
  selfCarePriorities: "",
  nurturingWellbeing: "",
  selfCareMethods: "",
  skillsToImprove: "",
  learningCommitment: "",
  giveBackCommunity: "",
  positiveImpact: "",

  // Step 7
  mantra: "",
  accountabilityMethod: "",
  accountabilityPartner: "",
  progressTrackingTools: "",

  // Step 8
  celebrationMilestones: "",
  reflectionFrequency: "",
  improvementsAndChanges: "",
  coreImportance: "",

  // Step 9
  celebrationMethod: "",
  encouragementMessage: "",
  signature: "",
  completionDate: "",
};

// GoalBuilder sub-step type
export type GoalBuilderSubStep = "list" | "breakdown" | "summary";

// Step validation configuration
// Maps step number to required fields and their human-readable labels
// Step 0 = Overview (always complete), Step 9 = Complete (special handling)
const STEP_VALIDATION: Record<number, { fields: (keyof SectionOneData)[]; labels: Record<string, string> }> = {
  1: {
    fields: ["listingsTaken", "sellerSidesClosed", "buyerSidesClosed", "renterTransactions", "grossClosedCommissions", "didAchieveGoals", "biggestStruggles", "biggestAccomplishment", "prospectingMethods", "wantToContinue"],
    labels: {
      listingsTaken: "Listings Taken",
      sellerSidesClosed: "Seller Sides Closed",
      buyerSidesClosed: "Buyer Sides Closed",
      renterTransactions: "Renter Transactions",
      grossClosedCommissions: "Gross Closed Commissions",
      didAchieveGoals: "Did you achieve your goals?",
      biggestStruggles: "Biggest struggles",
      biggestAccomplishment: "Biggest accomplishment",
      prospectingMethods: "Prospecting methods",
      wantToContinue: "What you want to continue",
    },
  },
  2: {
    fields: ["significantAchievements", "challengesAndOvercoming", "learnedAboutSelf"],
    labels: {
      significantAchievements: "Significant achievements",
      challengesAndOvercoming: "Challenges and how you overcame them",
      learnedAboutSelf: "What you learned about yourself",
    },
  },
  3: {
    fields: ["gratefulFor", "gratefulPeople", "joyfulMoments"],
    labels: {
      gratefulFor: "What you're grateful for",
      gratefulPeople: "People you're grateful for",
      joyfulMoments: "Joyful moments",
    },
  },
  4: {
    fields: ["mostFulfilled", "leastSatisfied", "overallWellbeing", "coreValuesAlignment", "valuePrioritiesShift"],
    labels: {
      mostFulfilled: "When you felt most fulfilled",
      leastSatisfied: "Areas of least satisfaction",
      overallWellbeing: "Overall wellbeing assessment",
      coreValuesAlignment: "Core values alignment",
      valuePrioritiesShift: "How priorities have shifted",
    },
  },
  5: {
    fields: ["goals"],
    labels: {
      goals: "At least one complete goal",
    },
  },
  6: {
    fields: ["selfCarePriorities", "nurturingWellbeing", "selfCareMethods", "skillsToImprove", "learningCommitment", "giveBackCommunity", "positiveImpact"],
    labels: {
      selfCarePriorities: "Self-care priorities",
      nurturingWellbeing: "How you'll nurture wellbeing",
      selfCareMethods: "Self-care methods",
      skillsToImprove: "Skills to improve",
      learningCommitment: "Learning commitment",
      giveBackCommunity: "How you'll give back",
      positiveImpact: "Positive impact goals",
    },
  },
  7: {
    fields: ["mantra", "accountabilityMethod", "accountabilityPartner", "progressTrackingTools"],
    labels: {
      mantra: "Your mantra",
      accountabilityMethod: "Accountability method",
      accountabilityPartner: "Accountability partner",
      progressTrackingTools: "Progress tracking tools",
    },
  },
  8: {
    fields: ["celebrationMilestones", "reflectionFrequency", "improvementsAndChanges", "coreImportance"],
    labels: {
      celebrationMilestones: "Celebration milestones",
      reflectionFrequency: "Reflection frequency",
      improvementsAndChanges: "Improvements and changes",
      coreImportance: "What's most important",
    },
  },
  9: {
    fields: ["celebrationMethod", "encouragementMessage", "signature", "completionDate"],
    labels: {
      celebrationMethod: "How you'll celebrate",
      encouragementMessage: "Encouragement message",
      signature: "Your signature",
      completionDate: "Completion date",
    },
  },
};

interface SectionOneStore {
  data: SectionOneData;

  // Step tracking for progress
  currentStep: number;
  highestStepReached: number;

  // GoalBuilder navigation state (session-only, not persisted)
  goalBuilderSubStep: GoalBuilderSubStep;
  goalBuilderGoalIndex: number;

  // Save state tracking
  isDirty: boolean;
  lastSavedAt: number | null;

  // Actions
  updateField: <K extends keyof SectionOneData>(
    field: K,
    value: SectionOneData[K]
  ) => void;
  updateNumericField: (
    field: keyof SectionOneData,
    value: number | null
  ) => void;
  setCurrentStep: (step: number) => void;
  resetSection: () => void;
  markSaved: () => void;

  // Goal-specific actions
  addGoal: () => void;
  removeGoal: (id: string) => void;
  updateGoal: <K extends keyof Omit<Goal, "id" | "immediateSteps">>(
    id: string,
    field: K,
    value: Goal[K]
  ) => void;
  updateGoalImmediateStep: (goalId: string, stepIndex: number, value: string) => void;

  // GoalBuilder navigation actions
  setGoalBuilderSubStep: (subStep: GoalBuilderSubStep, goalIndex?: number) => void;
  advanceGoalBuilder: () => { shouldAdvanceToNextSection: boolean };
  retreatGoalBuilder: () => { shouldRetreatToPrevSection: boolean };

  // Persistence actions
  hydrate: (serverData: Partial<SectionOneData>) => void;
  getData: () => SectionOneData;

  // Selectors
  getProgress: () => number;
  getFilledFieldCount: () => number;
  getMantra: () => string;
  getGoals: () => Goal[];
  getMissingFields: () => string[];

  // Step validation selectors
  isStepComplete: (step: number) => boolean;
  getStepMissingFields: (step: number) => string[];
}

export const useSectionOneStore = create<SectionOneStore>()(
  persist(
    (set, get) => ({
      data: initialData,
      currentStep: 0,
      highestStepReached: 0,
      goalBuilderSubStep: "list" as GoalBuilderSubStep,
      goalBuilderGoalIndex: 0,
      isDirty: false,
      lastSavedAt: null,

      updateField: (field, value) => {
        set((state) => ({
          data: { ...state.data, [field]: value },
          isDirty: true,
        }));
      },

      updateNumericField: (field, value) => {
        set((state) => ({
          data: { ...state.data, [field]: value },
          isDirty: true,
        }));
      },

      setCurrentStep: (step) => {
        set((state) => ({
          currentStep: step,
          highestStepReached: Math.max(state.highestStepReached, step),
        }));
      },

      resetSection: () => {
        set({
          data: initialData,
          currentStep: 0,
          highestStepReached: 0,
          goalBuilderSubStep: "list",
          goalBuilderGoalIndex: 0,
          isDirty: false,
          lastSavedAt: null,
        });
      },

      markSaved: () => {
        set({ isDirty: false, lastSavedAt: Date.now() });
      },

      // Goal-specific actions
      addGoal: () => {
        set((state) => ({
          data: {
            ...state.data,
            goals: [...(state.data.goals ?? []), createEmptyGoal()],
          },
          isDirty: true,
        }));
      },

      removeGoal: (id) => {
        set((state) => ({
          data: {
            ...state.data,
            goals: (state.data.goals ?? []).filter((g) => g.id !== id),
          },
          isDirty: true,
        }));
      },

      updateGoal: (id, field, value) => {
        set((state) => ({
          data: {
            ...state.data,
            goals: (state.data.goals ?? []).map((g) =>
              g.id === id ? { ...g, [field]: value } : g
            ),
          },
          isDirty: true,
        }));
      },

      updateGoalImmediateStep: (goalId, stepIndex, value) => {
        set((state) => ({
          data: {
            ...state.data,
            goals: (state.data.goals ?? []).map((g) => {
              if (g.id !== goalId) return g;
              const newSteps = [...g.immediateSteps];
              newSteps[stepIndex] = value;
              return { ...g, immediateSteps: newSteps };
            }),
          },
          isDirty: true,
        }));
      },

      // GoalBuilder navigation actions
      setGoalBuilderSubStep: (subStep, goalIndex) => {
        set({
          goalBuilderSubStep: subStep,
          goalBuilderGoalIndex: goalIndex ?? 0,
        });
      },

      advanceGoalBuilder: () => {
        const { goalBuilderSubStep, goalBuilderGoalIndex, data } = get();
        const validGoals = (data.goals ?? []).filter((g) => g.title.trim() !== "");

        if (goalBuilderSubStep === "list") {
          // From list, go to first goal breakdown (if there are valid goals)
          if (validGoals.length > 0) {
            set({ goalBuilderSubStep: "breakdown", goalBuilderGoalIndex: 0 });
            return { shouldAdvanceToNextSection: false };
          }
          // No valid goals, stay on list (shouldn't happen if UI disables button)
          return { shouldAdvanceToNextSection: false };
        }

        if (goalBuilderSubStep === "breakdown") {
          // From breakdown, go to next goal or summary
          if (goalBuilderGoalIndex < validGoals.length - 1) {
            set({ goalBuilderGoalIndex: goalBuilderGoalIndex + 1 });
            return { shouldAdvanceToNextSection: false };
          }
          // Last goal, go to summary
          set({ goalBuilderSubStep: "summary", goalBuilderGoalIndex: 0 });
          return { shouldAdvanceToNextSection: false };
        }

        if (goalBuilderSubStep === "summary") {
          // From summary, advance to next section (Step 6)
          // Keep state at "summary" so Back button returns here
          return { shouldAdvanceToNextSection: true };
        }

        return { shouldAdvanceToNextSection: false };
      },

      retreatGoalBuilder: () => {
        const { goalBuilderSubStep, goalBuilderGoalIndex, data } = get();
        const validGoals = (data.goals ?? []).filter((g) => g.title.trim() !== "");

        if (goalBuilderSubStep === "summary") {
          // From summary, go back to last goal breakdown
          if (validGoals.length > 0) {
            set({ goalBuilderSubStep: "breakdown", goalBuilderGoalIndex: validGoals.length - 1 });
            return { shouldRetreatToPrevSection: false };
          }
          // No goals, go to list
          set({ goalBuilderSubStep: "list", goalBuilderGoalIndex: 0 });
          return { shouldRetreatToPrevSection: false };
        }

        if (goalBuilderSubStep === "breakdown") {
          // From breakdown, go to previous goal or list
          if (goalBuilderGoalIndex > 0) {
            set({ goalBuilderGoalIndex: goalBuilderGoalIndex - 1 });
            return { shouldRetreatToPrevSection: false };
          }
          // First goal, go back to list
          set({ goalBuilderSubStep: "list", goalBuilderGoalIndex: 0 });
          return { shouldRetreatToPrevSection: false };
        }

        if (goalBuilderSubStep === "list") {
          // From list, retreat to previous section (Step 4)
          return { shouldRetreatToPrevSection: true };
        }

        return { shouldRetreatToPrevSection: false };
      },

      hydrate: (serverData) => {
        set((state) => ({
          data: { ...state.data, ...serverData },
          isDirty: false,
          lastSavedAt: Date.now(),
        }));
      },

      getData: () => {
        return get().data;
      },

      getProgress: () => {
        // Field-based progress: count filled required fields
        const data = get().data;
        let filled = 0;

        // Total requirements:
        // Step 1: 5 numeric + 5 text = 10
        // Step 2: 3 text
        // Step 3: 3 text
        // Step 4: 5 text
        // Step 5: 1 complete goal
        // Step 6: 7 text
        // Step 7: 4 text
        // Step 8: 4 text
        // Step 9: 4 text
        // Total: 41 requirements
        const totalRequirements = 41;

        // Step 1: Production Numbers (5 numeric + 5 text)
        if (data.listingsTaken !== null) filled++;
        if (data.sellerSidesClosed !== null) filled++;
        if (data.buyerSidesClosed !== null) filled++;
        if (data.renterTransactions !== null) filled++;
        if (data.grossClosedCommissions !== null) filled++;
        if (data.didAchieveGoals.trim()) filled++;
        if (data.biggestStruggles.trim()) filled++;
        if (data.biggestAccomplishment.trim()) filled++;
        if (data.prospectingMethods.trim()) filled++;
        if (data.wantToContinue.trim()) filled++;

        // Step 2: Reflection (3 text)
        if (data.significantAchievements.trim()) filled++;
        if (data.challengesAndOvercoming.trim()) filled++;
        if (data.learnedAboutSelf.trim()) filled++;

        // Step 3: Gratitude (3 text)
        if (data.gratefulFor.trim()) filled++;
        if (data.gratefulPeople.trim()) filled++;
        if (data.joyfulMoments.trim()) filled++;

        // Step 4: Self-Reflection & Values (5 text)
        if (data.mostFulfilled.trim()) filled++;
        if (data.leastSatisfied.trim()) filled++;
        if (data.overallWellbeing.trim()) filled++;
        if (data.coreValuesAlignment.trim()) filled++;
        if (data.valuePrioritiesShift.trim()) filled++;

        // Step 5: Goals - at least 1 complete goal required
        // Matches UI's isGoalComplete: title, why, how, and at least 1 immediate step
        const hasCompleteGoal = (data.goals ?? []).some(
          (goal) =>
            goal.title.trim() &&
            goal.whyImportant.trim() &&
            goal.howToAchieve.trim() &&
            goal.immediateSteps.some((step) => step.trim())
        );
        if (hasCompleteGoal) filled++;

        // Step 6: Self-Care & Growth (7 text)
        if (data.selfCarePriorities.trim()) filled++;
        if (data.nurturingWellbeing.trim()) filled++;
        if (data.selfCareMethods.trim()) filled++;
        if (data.skillsToImprove.trim()) filled++;
        if (data.learningCommitment.trim()) filled++;
        if (data.giveBackCommunity.trim()) filled++;
        if (data.positiveImpact.trim()) filled++;

        // Step 7: Mantra & Accountability (4 text)
        if (data.mantra.trim()) filled++;
        if (data.accountabilityMethod.trim()) filled++;
        if (data.accountabilityPartner.trim()) filled++;
        if (data.progressTrackingTools.trim()) filled++;

        // Step 8: Celebration & Reflection (4 text)
        if (data.celebrationMilestones.trim()) filled++;
        if (data.reflectionFrequency.trim()) filled++;
        if (data.improvementsAndChanges.trim()) filled++;
        if (data.coreImportance.trim()) filled++;

        // Step 9: Completion (4 text)
        if (data.celebrationMethod.trim()) filled++;
        if (data.encouragementMessage.trim()) filled++;
        if (data.signature.trim()) filled++;
        if (data.completionDate.trim()) filled++;

        return Math.round((filled / totalRequirements) * 100);
      },

      getFilledFieldCount: () => {
        const data = get().data;
        const values = Object.values(data);
        return values.filter(
          (v) => v !== null && v !== undefined && v !== ""
        ).length;
      },

      getMantra: () => {
        return get().data.mantra;
      },

      getGoals: () => {
        return get().data.goals ?? [];
      },

      // Diagnostic: returns list of incomplete fields for debugging
      getMissingFields: () => {
        const data = get().data;
        const missing: string[] = [];

        // Step 1: Production Numbers
        if (data.listingsTaken === null) missing.push("listingsTaken");
        if (data.sellerSidesClosed === null) missing.push("sellerSidesClosed");
        if (data.buyerSidesClosed === null) missing.push("buyerSidesClosed");
        if (data.renterTransactions === null) missing.push("renterTransactions");
        if (data.grossClosedCommissions === null) missing.push("grossClosedCommissions");
        if (!data.didAchieveGoals.trim()) missing.push("didAchieveGoals");
        if (!data.biggestStruggles.trim()) missing.push("biggestStruggles");
        if (!data.biggestAccomplishment.trim()) missing.push("biggestAccomplishment");
        if (!data.prospectingMethods.trim()) missing.push("prospectingMethods");
        if (!data.wantToContinue.trim()) missing.push("wantToContinue");

        // Step 2
        if (!data.significantAchievements.trim()) missing.push("significantAchievements");
        if (!data.challengesAndOvercoming.trim()) missing.push("challengesAndOvercoming");
        if (!data.learnedAboutSelf.trim()) missing.push("learnedAboutSelf");

        // Step 3
        if (!data.gratefulFor.trim()) missing.push("gratefulFor");
        if (!data.gratefulPeople.trim()) missing.push("gratefulPeople");
        if (!data.joyfulMoments.trim()) missing.push("joyfulMoments");

        // Step 4
        if (!data.mostFulfilled.trim()) missing.push("mostFulfilled");
        if (!data.leastSatisfied.trim()) missing.push("leastSatisfied");
        if (!data.overallWellbeing.trim()) missing.push("overallWellbeing");
        if (!data.coreValuesAlignment.trim()) missing.push("coreValuesAlignment");
        if (!data.valuePrioritiesShift.trim()) missing.push("valuePrioritiesShift");

        // Step 5: Goals
        const hasCompleteGoal = (data.goals ?? []).some(
          (goal) =>
            goal.title.trim() &&
            goal.whyImportant.trim() &&
            goal.howToAchieve.trim() &&
            goal.immediateSteps.some((step) => step.trim())
        );
        if (!hasCompleteGoal) missing.push("goals (need 1 complete goal)");

        // Step 6
        if (!data.selfCarePriorities.trim()) missing.push("selfCarePriorities");
        if (!data.nurturingWellbeing.trim()) missing.push("nurturingWellbeing");
        if (!data.selfCareMethods.trim()) missing.push("selfCareMethods");
        if (!data.skillsToImprove.trim()) missing.push("skillsToImprove");
        if (!data.learningCommitment.trim()) missing.push("learningCommitment");
        if (!data.giveBackCommunity.trim()) missing.push("giveBackCommunity");
        if (!data.positiveImpact.trim()) missing.push("positiveImpact");

        // Step 7
        if (!data.mantra.trim()) missing.push("mantra");
        if (!data.accountabilityMethod.trim()) missing.push("accountabilityMethod");
        if (!data.accountabilityPartner.trim()) missing.push("accountabilityPartner");
        if (!data.progressTrackingTools.trim()) missing.push("progressTrackingTools");

        // Step 8
        if (!data.celebrationMilestones.trim()) missing.push("celebrationMilestones");
        if (!data.reflectionFrequency.trim()) missing.push("reflectionFrequency");
        if (!data.improvementsAndChanges.trim()) missing.push("improvementsAndChanges");
        if (!data.coreImportance.trim()) missing.push("coreImportance");

        // Step 9
        if (!data.celebrationMethod.trim()) missing.push("celebrationMethod");
        if (!data.encouragementMessage.trim()) missing.push("encouragementMessage");
        if (!data.signature.trim()) missing.push("signature");
        if (!data.completionDate.trim()) missing.push("completionDate");

        return missing;
      },

      // Check if a specific step is complete
      isStepComplete: (step: number) => {
        // Step 0 (Overview) is always complete
        if (step === 0) return true;

        const data = get().data;
        const validation = STEP_VALIDATION[step];
        if (!validation) return true; // Unknown step considered complete

        // Special handling for goals step (step 5)
        if (step === 5) {
          const hasCompleteGoal = (data.goals ?? []).some(
            (goal) =>
              goal.title.trim() &&
              goal.whyImportant.trim() &&
              goal.howToAchieve.trim() &&
              goal.immediateSteps.some((s) => s.trim())
          );
          return hasCompleteGoal;
        }

        // Check all fields for this step
        const numericFields = ["listingsTaken", "sellerSidesClosed", "buyerSidesClosed", "renterTransactions", "grossClosedCommissions"];

        for (const field of validation.fields) {
          const value = data[field];
          if (numericFields.includes(field)) {
            if (value === null || value === undefined) return false;
          } else if (typeof value === "string") {
            if (!value.trim()) return false;
          }
        }

        return true;
      },

      // Get missing fields for a specific step with human-readable labels
      getStepMissingFields: (step: number) => {
        // Step 0 (Overview) has no missing fields
        if (step === 0) return [];

        const data = get().data;
        const validation = STEP_VALIDATION[step];
        if (!validation) return [];

        const missing: string[] = [];
        const numericFields = ["listingsTaken", "sellerSidesClosed", "buyerSidesClosed", "renterTransactions", "grossClosedCommissions"];

        // Special handling for goals step (step 5)
        if (step === 5) {
          const hasCompleteGoal = (data.goals ?? []).some(
            (goal) =>
              goal.title.trim() &&
              goal.whyImportant.trim() &&
              goal.howToAchieve.trim() &&
              goal.immediateSteps.some((s) => s.trim())
          );
          if (!hasCompleteGoal) {
            missing.push(validation.labels.goals);
          }
          return missing;
        }

        for (const field of validation.fields) {
          const value = data[field];
          if (numericFields.includes(field)) {
            if (value === null || value === undefined) {
              missing.push(validation.labels[field]);
            }
          } else if (typeof value === "string") {
            if (!value.trim()) {
              missing.push(validation.labels[field]);
            }
          }
        }

        return missing;
      },
    }),
    {
      name: "myplanforsuccess:section-one",
      // Exclude session-only navigation state from persistence
      partialize: (state) => ({
        data: state.data,
        currentStep: state.currentStep,
        highestStepReached: state.highestStepReached,
        isDirty: state.isDirty,
        lastSavedAt: state.lastSavedAt,
        // goalBuilderSubStep and goalBuilderGoalIndex are intentionally excluded
      }),
    }
  )
);
