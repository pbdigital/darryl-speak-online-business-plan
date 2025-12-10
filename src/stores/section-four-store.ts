import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MindsetSection } from "@/types/business-plan";

// Total steps in Section 4 (0=Overview, 1-7=Content steps, 8=Complete)
const TOTAL_STEPS = 9;

// Total fields for counting filled entries
// 5 affirmations + 2 routines + 4 boundaries + 4 self-care + 1 motivation + 4 support + 1 becoming = 21
const TOTAL_FIELDS = 21;

// Initialize arrays with empty strings
const createEmptyAffirmations = (): string[] => Array.from({ length: 5 }, () => "");
const createEmptyBoundaries = (): string[] => Array.from({ length: 4 }, () => "");
const createEmptySelfCare = (): string[] => Array.from({ length: 4 }, () => "");
const createEmptySupport = (): string[] => Array.from({ length: 4 }, () => "");

const initialData: MindsetSection = {
  affirmations: createEmptyAffirmations(),
  morningRoutine: "",
  eveningRoutine: "",
  boundaries: createEmptyBoundaries(),
  selfCareCommitments: createEmptySelfCare(),
  whatMotivatesMe: "",
  supportSystem: createEmptySupport(),
  whoINeedToBecome: "",
};

interface SectionFourStore {
  data: MindsetSection;

  // Step tracking for progress
  currentStep: number;
  highestStepReached: number;

  // Actions for affirmations
  updateAffirmation: (index: number, value: string) => void;

  // Actions for routines
  updateMorningRoutine: (value: string) => void;
  updateEveningRoutine: (value: string) => void;

  // Actions for boundaries
  updateBoundary: (index: number, value: string) => void;

  // Actions for self-care
  updateSelfCareCommitment: (index: number, value: string) => void;

  // Actions for motivation
  updateWhatMotivatesMe: (value: string) => void;

  // Actions for support system
  updateSupportSystemItem: (index: number, value: string) => void;

  // Actions for who to become
  updateWhoINeedToBecome: (value: string) => void;

  // Step navigation
  setCurrentStep: (step: number) => void;

  // Reset actions
  resetSection: () => void;
  resetAffirmations: () => void;
  resetRoutines: () => void;
  resetBoundaries: () => void;
  resetSelfCare: () => void;
  resetMotivation: () => void;
  resetSupport: () => void;
  resetBecoming: () => void;

  // Selectors
  getProgress: () => number;
  getFilledFieldCount: () => number;
  getFilledAffirmations: () => string[];
  getFilledBoundaries: () => string[];
  getFilledSelfCare: () => string[];
  getFilledSupport: () => string[];
}

export const useSectionFourStore = create<SectionFourStore>()(
  persist(
    (set, get) => ({
      data: initialData,
      currentStep: 0,
      highestStepReached: 0,

      // Affirmations
      updateAffirmation: (index, value) => {
        set((state) => {
          const newAffirmations = [...state.data.affirmations];
          newAffirmations[index] = value;
          return { data: { ...state.data, affirmations: newAffirmations } };
        });
      },

      // Routines
      updateMorningRoutine: (value) => {
        set((state) => ({
          data: { ...state.data, morningRoutine: value },
        }));
      },

      updateEveningRoutine: (value) => {
        set((state) => ({
          data: { ...state.data, eveningRoutine: value },
        }));
      },

      // Boundaries
      updateBoundary: (index, value) => {
        set((state) => {
          const newBoundaries = [...state.data.boundaries];
          newBoundaries[index] = value;
          return { data: { ...state.data, boundaries: newBoundaries } };
        });
      },

      // Self-care
      updateSelfCareCommitment: (index, value) => {
        set((state) => {
          const newSelfCare = [...state.data.selfCareCommitments];
          newSelfCare[index] = value;
          return { data: { ...state.data, selfCareCommitments: newSelfCare } };
        });
      },

      // Motivation
      updateWhatMotivatesMe: (value) => {
        set((state) => ({
          data: { ...state.data, whatMotivatesMe: value },
        }));
      },

      // Support system
      updateSupportSystemItem: (index, value) => {
        set((state) => {
          const newSupport = [...state.data.supportSystem];
          newSupport[index] = value;
          return { data: { ...state.data, supportSystem: newSupport } };
        });
      },

      // Who to become
      updateWhoINeedToBecome: (value) => {
        set((state) => ({
          data: { ...state.data, whoINeedToBecome: value },
        }));
      },

      // Step navigation
      setCurrentStep: (step) => {
        set((state) => ({
          currentStep: step,
          highestStepReached: Math.max(state.highestStepReached, step),
        }));
      },

      // Reset all
      resetSection: () => {
        set({ data: initialData, currentStep: 0, highestStepReached: 0 });
      },

      // Reset individual steps
      resetAffirmations: () => {
        set((state) => ({
          data: { ...state.data, affirmations: createEmptyAffirmations() },
        }));
      },

      resetRoutines: () => {
        set((state) => ({
          data: { ...state.data, morningRoutine: "", eveningRoutine: "" },
        }));
      },

      resetBoundaries: () => {
        set((state) => ({
          data: { ...state.data, boundaries: createEmptyBoundaries() },
        }));
      },

      resetSelfCare: () => {
        set((state) => ({
          data: { ...state.data, selfCareCommitments: createEmptySelfCare() },
        }));
      },

      resetMotivation: () => {
        set((state) => ({
          data: { ...state.data, whatMotivatesMe: "" },
        }));
      },

      resetSupport: () => {
        set((state) => ({
          data: { ...state.data, supportSystem: createEmptySupport() },
        }));
      },

      resetBecoming: () => {
        set((state) => ({
          data: { ...state.data, whoINeedToBecome: "" },
        }));
      },

      // Progress calculation (step-based)
      getProgress: () => {
        const { highestStepReached } = get();
        if (highestStepReached === 0) return 0;
        if (highestStepReached >= TOTAL_STEPS - 1) return 100;
        return Math.round((highestStepReached / (TOTAL_STEPS - 1)) * 100);
      },

      // Count filled fields
      getFilledFieldCount: () => {
        const data = get().data;
        let filled = 0;

        // Count filled affirmations
        filled += data.affirmations.filter((a) => a.trim()).length;

        // Count filled routines
        if (data.morningRoutine.trim()) filled++;
        if (data.eveningRoutine.trim()) filled++;

        // Count filled boundaries
        filled += data.boundaries.filter((b) => b.trim()).length;

        // Count filled self-care
        filled += data.selfCareCommitments.filter((s) => s.trim()).length;

        // Count motivation
        if (data.whatMotivatesMe.trim()) filled++;

        // Count filled support
        filled += data.supportSystem.filter((s) => s.trim()).length;

        // Count becoming
        if (data.whoINeedToBecome.trim()) filled++;

        return filled;
      },

      // Filtered selectors
      getFilledAffirmations: () => {
        return get().data.affirmations.filter((a) => a.trim());
      },

      getFilledBoundaries: () => {
        return get().data.boundaries.filter((b) => b.trim());
      },

      getFilledSelfCare: () => {
        return get().data.selfCareCommitments.filter((s) => s.trim());
      },

      getFilledSupport: () => {
        return get().data.supportSystem.filter((s) => s.trim());
      },
    }),
    {
      name: "myplanforsuccess:section-four",
    }
  )
);
