import { create } from "zustand";
import { persist } from "zustand/middleware";

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

  // Step 5: Goals & Obstacles
  topGoalsIntentions: string;
  goalsImportance: string;
  goalStrategies: string;
  immediateSteps: string;
  potentialObstacles: string;
  obstacleStrategies: string;

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

  // Step 5
  topGoalsIntentions: "",
  goalsImportance: "",
  goalStrategies: "",
  immediateSteps: "",
  potentialObstacles: "",
  obstacleStrategies: "",

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

interface SectionOneStore {
  data: SectionOneData;

  // Actions
  updateField: <K extends keyof SectionOneData>(
    field: K,
    value: SectionOneData[K]
  ) => void;
  updateNumericField: (
    field: keyof SectionOneData,
    value: number | null
  ) => void;
  resetSection: () => void;

  // Selectors
  getProgress: () => number;
  getFilledFieldCount: () => number;
  getMantra: () => string;
}

export const useSectionOneStore = create<SectionOneStore>()(
  persist(
    (set, get) => ({
      data: initialData,

      updateField: (field, value) => {
        set((state) => ({
          data: { ...state.data, [field]: value },
        }));
      },

      updateNumericField: (field, value) => {
        set((state) => ({
          data: { ...state.data, [field]: value },
        }));
      },

      resetSection: () => {
        set({ data: initialData });
      },

      getProgress: () => {
        const data = get().data;
        const values = Object.values(data);
        const filled = values.filter(
          (v) => v !== null && v !== undefined && v !== ""
        ).length;
        return Math.round((filled / TOTAL_FIELDS) * 100);
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
    }),
    {
      name: "myplanforsuccess:section-one",
    }
  )
);
