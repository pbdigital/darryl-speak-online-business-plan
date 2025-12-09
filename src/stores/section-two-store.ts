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

interface SectionTwoStore {
  data: SectionTwoData;

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
  resetSection: () => void;
  resetStrengths: () => void;
  resetWeaknesses: () => void;
  resetOpportunities: () => void;
  resetThreats: () => void;

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

      updateStrength: (index, field, value) => {
        set((state) => {
          const newStrengths = [...state.data.strengths];
          newStrengths[index] = { ...newStrengths[index], [field]: value };
          return { data: { ...state.data, strengths: newStrengths } };
        });
      },

      updateWeakness: (index, value) => {
        set((state) => {
          const newWeaknesses = [...state.data.weaknesses];
          newWeaknesses[index] = { ...newWeaknesses[index], weakness: value };
          return { data: { ...state.data, weaknesses: newWeaknesses } };
        });
      },

      updateWeaknessAction: (index, action) => {
        set((state) => {
          const newWeaknesses = [...state.data.weaknesses];
          newWeaknesses[index] = { ...newWeaknesses[index], action };
          return { data: { ...state.data, weaknesses: newWeaknesses } };
        });
      },

      updateOpportunity: (index, field, value) => {
        set((state) => {
          const newOpportunities = [...state.data.opportunities];
          newOpportunities[index] = {
            ...newOpportunities[index],
            [field]: value,
          };
          return { data: { ...state.data, opportunities: newOpportunities } };
        });
      },

      updateThreat: (index, field, value) => {
        set((state) => {
          const newThreats = [...state.data.threats];
          newThreats[index] = { ...newThreats[index], [field]: value };
          return { data: { ...state.data, threats: newThreats } };
        });
      },

      resetSection: () => {
        set({ data: initialData });
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

      getProgress: () => {
        const data = get().data;
        let filled = 0;

        // Count filled strength fields
        data.strengths.forEach((item) => {
          if (item.strength.trim()) filled++;
          if (item.useCase.trim()) filled++;
        });

        // Count filled weakness fields
        data.weaknesses.forEach((item) => {
          if (item.weakness.trim()) filled++;
          if (item.action !== null) filled++;
        });

        // Count filled opportunity fields
        data.opportunities.forEach((item) => {
          if (item.possibility.trim()) filled++;
          if (item.actionSteps.trim()) filled++;
        });

        // Count filled threat fields
        data.threats.forEach((item) => {
          if (item.threat.trim()) filled++;
          if (item.actionSteps.trim()) filled++;
        });

        return Math.round((filled / TOTAL_FIELDS) * 100);
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
