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

// Total number of fields for progress calculation
const TOTAL_FIELDS = 46;

// Total steps in Section 1 (0=Overview, 1-8=Content steps, 9=Complete)
const TOTAL_STEPS = 10;

// GoalBuilder sub-step type
export type GoalBuilderSubStep = "list" | "breakdown" | "summary";

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
        // Step-based progress: highest step reached / total steps
        const { highestStepReached } = get();
        if (highestStepReached === 0) return 0;
        if (highestStepReached >= TOTAL_STEPS - 1) return 100;
        return Math.round((highestStepReached / (TOTAL_STEPS - 1)) * 100);
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
