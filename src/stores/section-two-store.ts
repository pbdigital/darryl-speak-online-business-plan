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

// Step validation configuration for Section 2 (SWOT Analysis)
// Step 0 = Overview (always complete), Step 5 = Complete
const STEP_VALIDATION_LABELS: Record<number, string> = {
  1: "At least one strength",
  2: "At least one weakness with an action",
  3: "At least one opportunity with action steps",
  4: "At least one threat with action steps",
};

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

  // Persistence actions
  hydrate: (serverData: Partial<SectionTwoData>) => void;
  getData: () => SectionTwoData;

  // Selectors
  getProgress: () => number;
  getFilledFieldCount: () => number;
  getFilledStrengths: () => StrengthItem[];
  getFilledWeaknesses: () => WeaknessItem[];
  getFilledOpportunities: () => OpportunityItem[];
  getFilledThreats: () => ThreatItem[];

  // Step validation selectors
  isStepComplete: (step: number) => boolean;
  getStepMissingFields: (step: number) => string[];
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

      hydrate: (serverData) => {
        set((state) => ({
          data: {
            strengths: serverData.strengths || state.data.strengths,
            weaknesses: serverData.weaknesses || state.data.weaknesses,
            opportunities: serverData.opportunities || state.data.opportunities,
            threats: serverData.threats || state.data.threats,
          },
          isDirty: false,
          lastSavedAt: Date.now(),
        }));
      },

      getData: () => {
        return get().data;
      },

      getProgress: () => {
        // Field-based progress: count filled required fields
        // Requirements (per Sarah's rules - only 1 entry required per category):
        // - At least 1 strength with content filled
        // - At least 1 weakness with content filled + action selected
        // - At least 1 opportunity with content + action filled
        // - At least 1 threat with content + action filled
        const data = get().data;
        let filled = 0;
        const totalRequirements = 4;

        // At least 1 complete strength (strength text filled)
        const hasStrength = data.strengths.some((s) => s.strength.trim());
        if (hasStrength) filled++;

        // At least 1 complete weakness (weakness text + action selected)
        const hasWeakness = data.weaknesses.some(
          (w) => w.weakness.trim() && w.action !== null
        );
        if (hasWeakness) filled++;

        // At least 1 complete opportunity (possibility + actionSteps)
        const hasOpportunity = data.opportunities.some(
          (o) => o.possibility.trim() && o.actionSteps.trim()
        );
        if (hasOpportunity) filled++;

        // At least 1 complete threat (threat + actionSteps)
        const hasThreat = data.threats.some(
          (t) => t.threat.trim() && t.actionSteps.trim()
        );
        if (hasThreat) filled++;

        return Math.round((filled / totalRequirements) * 100);
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

      // Check if a specific step is complete
      isStepComplete: (step: number) => {
        // Step 0 (Overview) and Step 5 (Complete) are always complete
        if (step === 0 || step === 5) return true;

        const data = get().data;

        switch (step) {
          case 1: // Strengths - at least 1 strength with text
            return data.strengths.some((s) => s.strength.trim());
          case 2: // Weaknesses - at least 1 weakness with text + action
            return data.weaknesses.some((w) => w.weakness.trim() && w.action !== null);
          case 3: // Opportunities - at least 1 with possibility + actionSteps
            return data.opportunities.some((o) => o.possibility.trim() && o.actionSteps.trim());
          case 4: // Threats - at least 1 with threat + actionSteps
            return data.threats.some((t) => t.threat.trim() && t.actionSteps.trim());
          default:
            return true;
        }
      },

      // Get missing fields for a specific step with human-readable labels
      getStepMissingFields: (step: number) => {
        // Overview and Complete steps have no missing fields
        if (step === 0 || step === 5) return [];

        const isComplete = get().isStepComplete(step);
        if (isComplete) return [];

        const label = STEP_VALIDATION_LABELS[step];
        return label ? [label] : [];
      },
    }),
    {
      name: "myplanforsuccess:section-two",
    }
  )
);
