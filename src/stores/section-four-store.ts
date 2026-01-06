import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MindsetSection } from "@/types/business-plan";

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

  // Save state tracking
  isDirty: boolean;
  lastSavedAt: number | null;

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
  markSaved: () => void;

  // Persistence actions
  hydrate: (serverData: Partial<MindsetSection>) => void;
  getData: () => MindsetSection;

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
      isDirty: false,
      lastSavedAt: null,

      // Affirmations
      updateAffirmation: (index, value) => {
        set((state) => {
          const newAffirmations = [...state.data.affirmations];
          newAffirmations[index] = value;
          return { data: { ...state.data, affirmations: newAffirmations }, isDirty: true };
        });
      },

      // Routines
      updateMorningRoutine: (value) => {
        set((state) => ({
          data: { ...state.data, morningRoutine: value },
          isDirty: true,
        }));
      },

      updateEveningRoutine: (value) => {
        set((state) => ({
          data: { ...state.data, eveningRoutine: value },
          isDirty: true,
        }));
      },

      // Boundaries
      updateBoundary: (index, value) => {
        set((state) => {
          const newBoundaries = [...state.data.boundaries];
          newBoundaries[index] = value;
          return { data: { ...state.data, boundaries: newBoundaries }, isDirty: true };
        });
      },

      // Self-care
      updateSelfCareCommitment: (index, value) => {
        set((state) => {
          const newSelfCare = [...state.data.selfCareCommitments];
          newSelfCare[index] = value;
          return { data: { ...state.data, selfCareCommitments: newSelfCare }, isDirty: true };
        });
      },

      // Motivation
      updateWhatMotivatesMe: (value) => {
        set((state) => ({
          data: { ...state.data, whatMotivatesMe: value },
          isDirty: true,
        }));
      },

      // Support system
      updateSupportSystemItem: (index, value) => {
        set((state) => {
          const newSupport = [...state.data.supportSystem];
          newSupport[index] = value;
          return { data: { ...state.data, supportSystem: newSupport }, isDirty: true };
        });
      },

      // Who to become
      updateWhoINeedToBecome: (value) => {
        set((state) => ({
          data: { ...state.data, whoINeedToBecome: value },
          isDirty: true,
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
        set({ data: initialData, currentStep: 0, highestStepReached: 0, isDirty: false, lastSavedAt: null });
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

      markSaved: () => {
        set({ isDirty: false, lastSavedAt: Date.now() });
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

      // Progress calculation (field-based)
      getProgress: () => {
        // Requirements (per Sarah's rules):
        // - At least 1 affirmation
        // - Morning routine: non-empty
        // - Evening routine: non-empty
        // - At least 1 boundary
        // - At least 1 self-care commitment
        // - Motivation: non-empty
        // - At least 1 support system person
        // - Who I need to become: non-empty
        const data = get().data;
        let filled = 0;
        const totalRequirements = 8;

        // At least 1 affirmation
        if (data.affirmations.some((a) => a.trim())) filled++;

        // Morning routine
        if (data.morningRoutine.trim()) filled++;

        // Evening routine
        if (data.eveningRoutine.trim()) filled++;

        // At least 1 boundary
        if (data.boundaries.some((b) => b.trim())) filled++;

        // At least 1 self-care commitment
        if (data.selfCareCommitments.some((s) => s.trim())) filled++;

        // Motivation
        if (data.whatMotivatesMe.trim()) filled++;

        // At least 1 support system person
        if (data.supportSystem.some((s) => s.trim())) filled++;

        // Who I need to become
        if (data.whoINeedToBecome.trim()) filled++;

        return Math.round((filled / totalRequirements) * 100);
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
