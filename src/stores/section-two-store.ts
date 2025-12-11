import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types for SWOT items
export type WeaknessAction = "accept" | "delegate" | "improve" | null;

export interface StrengthItem {
  strength: string;
  useCase: string;
}

export interface WeaknessItem {
  weakness: string;
  action: WeaknessAction;
}

export interface OpportunityItem {
  possibility: string;
  actionSteps: string;
}

export interface ThreatItem {
  threat: string;
  actionSteps: string;
}

export interface SectionTwoData {
  strengths: StrengthItem[];
  weaknesses: WeaknessItem[];
  opportunities: OpportunityItem[];
  threats: ThreatItem[];
}

// Initialize with 8 empty items for each category
const createEmptyStrengths = (): StrengthItem[] =>
  Array.from({ length: 8 }, () => ({ strength: "", useCase: "" }));

const createEmptyWeaknesses = (): WeaknessItem[] =>
  Array.from({ length: 8 }, () => ({ weakness: "", action: null }));

const createEmptyOpportunities = (): OpportunityItem[] =>
  Array.from({ length: 8 }, () => ({ possibility: "", actionSteps: "" }));

const createEmptyThreats = (): ThreatItem[] =>
  Array.from({ length: 8 }, () => ({ threat: "", actionSteps: "" }));

const initialData: SectionTwoData = {
  strengths: createEmptyStrengths(),
  weaknesses: createEmptyWeaknesses(),
  opportunities: createEmptyOpportunities(),
  threats: createEmptyThreats(),
};

// Total fields: 8 strengths x 2 + 8 weaknesses x 2 + 8 opportunities x 2 + 8 threats x 2 = 64
const TOTAL_FIELDS = 64;

// Total steps in Section 2 (0=Overview, 1-4=Content steps, 5=Complete)
const TOTAL_STEPS = 6;

interface SectionTwoStore {
  data: SectionTwoData;

  // Step tracking for progress
  currentStep: number;
  highestStepReached: number;

  // Save state tracking
  isDirty: boolean;
  lastSavedAt: number | null;

  // Actions
  updateStrength: (
    index: number,
    field: keyof StrengthItem,
    value: string
  ) => void;
  updateWeakness: (index: number, value: string) => void;
  updateWeaknessAction: (index: number, action: WeaknessAction) => void;
  updateOpportunity: (
    index: number,
    field: keyof OpportunityItem,
    value: string
  ) => void;
  updateThreat: (index: number, field: keyof ThreatItem, value: string) => void;
  setCurrentStep: (step: number) => void;
  resetSection: () => void;
  resetStrengths: () => void;
  resetWeaknesses: () => void;
  resetOpportunities: () => void;
  resetThreats: () => void;
  markSaved: () => void;

  // Selectors
  getProgress: () => number;
  getFilledFieldCount: () => number;
  getFilledStrengths: () => StrengthItem[];
  getFilledWeaknesses: () => WeaknessItem[];
  getFilledOpportunities: () => OpportunityItem[];
  getFilledThreats: () => ThreatItem[];
}

export const useSectionTwoStore = create<SectionTwoStore>()(
  persist(
    (set, get) => ({
      data: initialData,
      currentStep: 0,
      highestStepReached: 0,
      isDirty: false,
      lastSavedAt: null,

      updateStrength: (index, field, value) => {
        set((state) => {
          const newStrengths = [...state.data.strengths];
          newStrengths[index] = { ...newStrengths[index], [field]: value };
          return { data: { ...state.data, strengths: newStrengths }, isDirty: true };
        });
      },

      updateWeakness: (index, value) => {
        set((state) => {
          const newWeaknesses = [...state.data.weaknesses];
          newWeaknesses[index] = { ...newWeaknesses[index], weakness: value };
          return { data: { ...state.data, weaknesses: newWeaknesses }, isDirty: true };
        });
      },

      updateWeaknessAction: (index, action) => {
        set((state) => {
          const newWeaknesses = [...state.data.weaknesses];
          newWeaknesses[index] = { ...newWeaknesses[index], action };
          return { data: { ...state.data, weaknesses: newWeaknesses }, isDirty: true };
        });
      },

      updateOpportunity: (index, field, value) => {
        set((state) => {
          const newOpportunities = [...state.data.opportunities];
          newOpportunities[index] = {
            ...newOpportunities[index],
            [field]: value,
          };
          return { data: { ...state.data, opportunities: newOpportunities }, isDirty: true };
        });
      },

      updateThreat: (index, field, value) => {
        set((state) => {
          const newThreats = [...state.data.threats];
          newThreats[index] = { ...newThreats[index], [field]: value };
          return { data: { ...state.data, threats: newThreats }, isDirty: true };
        });
      },

      setCurrentStep: (step) => {
        set((state) => ({
          currentStep: step,
          highestStepReached: Math.max(state.highestStepReached, step),
        }));
      },

      resetSection: () => {
        set({ data: initialData, currentStep: 0, highestStepReached: 0, isDirty: false, lastSavedAt: null });
      },

      resetStrengths: () => {
        set((state) => ({
          data: { ...state.data, strengths: createEmptyStrengths() },
        }));
      },

      resetWeaknesses: () => {
        set((state) => ({
          data: { ...state.data, weaknesses: createEmptyWeaknesses() },
        }));
      },

      resetOpportunities: () => {
        set((state) => ({
          data: { ...state.data, opportunities: createEmptyOpportunities() },
        }));
      },

      resetThreats: () => {
        set((state) => ({
          data: { ...state.data, threats: createEmptyThreats() },
        }));
      },

      markSaved: () => {
        set({ isDirty: false, lastSavedAt: Date.now() });
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
        let filled = 0;

        data.strengths.forEach((item) => {
          if (item.strength.trim()) filled++;
          if (item.useCase.trim()) filled++;
        });

        data.weaknesses.forEach((item) => {
          if (item.weakness.trim()) filled++;
          if (item.action !== null) filled++;
        });

        data.opportunities.forEach((item) => {
          if (item.possibility.trim()) filled++;
          if (item.actionSteps.trim()) filled++;
        });

        data.threats.forEach((item) => {
          if (item.threat.trim()) filled++;
          if (item.actionSteps.trim()) filled++;
        });

        return filled;
      },

      getFilledStrengths: () => {
        return get().data.strengths.filter((s) => s.strength.trim());
      },

      getFilledWeaknesses: () => {
        return get().data.weaknesses.filter((w) => w.weakness.trim());
      },

      getFilledOpportunities: () => {
        return get().data.opportunities.filter((o) => o.possibility.trim());
      },

      getFilledThreats: () => {
        return get().data.threats.filter((t) => t.threat.trim());
      },
    }),
    {
      name: "myplanforsuccess:section-two",
    }
  )
);
