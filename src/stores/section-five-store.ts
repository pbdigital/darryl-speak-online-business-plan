import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AccountabilitySection,
  ProjectMatrixData,
  IdealClientProfile,
  ProspectingActivity,
  MarketingActivity,
  QuarterlyMarketing,
  CommitmentContract,
} from "@/types/business-plan";

// Total steps in Section 5 (0=Overview, 1-7=Content steps, 8=Complete)
const TOTAL_STEPS = 9;

// Helper functions to create empty data structures
const createEmptyProjectMatrix = (): ProjectMatrixData => ({
  projectNames: Array.from({ length: 5 }, () => ""),
  tasks: Array.from({ length: 5 }, () => Array.from({ length: 6 }, () => "")),
});

const createEmptyIdealClient = (): IdealClientProfile => ({
  name: "",
  whoAreThey: "",
  whatMotivatesThem: "",
  whereAreThey: "",
  howToReachThem: "",
});

const createEmptyProspectingActivity = (): ProspectingActivity => ({
  activity: "",
  how: "",
  who: "",
  when: "",
  farmArea: "",
  cost: null,
  followUpPlan: "",
});

const createEmptyMarketingActivity = (): MarketingActivity => ({
  activity: "",
  how: "",
  who: "",
  when: "",
  farmArea: "",
  cost: null,
});

const createEmptyQuarterlyMarketing = (): QuarterlyMarketing => ({
  q1Strategy1: "",
  q1Strategy2: "",
  q2Strategy1: "",
  q2Strategy2: "",
  q3Strategy1: "",
  q3Strategy2: "",
  q4Strategy1: "",
  q4Strategy2: "",
});

const createEmptyCommitmentContract = (): CommitmentContract => ({
  agentName: "",
  transactionGoal: null,
  rewardIfAchieved: "",
  consequenceIfFailed: "",
  accountabilityPartnerName: "",
  agentSignatureDate: "",
  partnerSignatureDate: "",
});

const createEmptyResources = (): string[] => Array.from({ length: 4 }, () => "");

const initialData: AccountabilitySection = {
  projectMatrix: createEmptyProjectMatrix(),
  currentResources: createEmptyResources(),
  neededResources: createEmptyResources(),
  idealClients: [createEmptyIdealClient(), createEmptyIdealClient()],
  prospectingActivities: [
    createEmptyProspectingActivity(),
    createEmptyProspectingActivity(),
    createEmptyProspectingActivity(),
  ],
  marketingActivities: [
    createEmptyMarketingActivity(),
    createEmptyMarketingActivity(),
    createEmptyMarketingActivity(),
  ],
  quarterlyMarketing: createEmptyQuarterlyMarketing(),
  commitmentContract: createEmptyCommitmentContract(),
};

interface SectionFiveStore {
  data: AccountabilitySection;

  // Step tracking for progress
  currentStep: number;
  highestStepReached: number;

  // Save state tracking
  isDirty: boolean;
  lastSavedAt: number | null;

  // Project Matrix actions
  updateProjectName: (index: number, value: string) => void;
  updateProjectTask: (projectIndex: number, taskIndex: number, value: string) => void;

  // Resources actions
  updateCurrentResource: (index: number, value: string) => void;
  updateNeededResource: (index: number, value: string) => void;

  // Ideal Client actions
  updateIdealClientField: (
    clientIndex: number,
    field: keyof IdealClientProfile,
    value: string
  ) => void;

  // Prospecting Activity actions
  updateProspectingActivityField: (
    activityIndex: number,
    field: keyof ProspectingActivity,
    value: string | number | null
  ) => void;

  // Marketing Activity actions
  updateMarketingActivityField: (
    activityIndex: number,
    field: keyof MarketingActivity,
    value: string | number | null
  ) => void;

  // Quarterly Marketing actions
  updateQuarterlyMarketing: (field: keyof QuarterlyMarketing, value: string) => void;

  // Commitment Contract actions
  updateCommitmentField: (
    field: keyof CommitmentContract,
    value: string | number | null
  ) => void;

  // Step navigation
  setCurrentStep: (step: number) => void;

  // Reset actions
  resetSection: () => void;
  resetProjectMatrix: () => void;
  resetResources: () => void;
  resetIdealClients: () => void;
  resetProspectingActivities: () => void;
  resetMarketingActivities: () => void;
  resetQuarterlyMarketing: () => void;
  resetCommitmentContract: () => void;
  markSaved: () => void;

  // Persistence actions
  hydrate: (serverData: Partial<AccountabilitySection>) => void;
  getData: () => AccountabilitySection;

  // Selectors
  getProgress: () => number;
  getFilledFieldCount: () => number;
  getFilledProjectNames: () => string[];
  getFilledResources: () => { current: string[]; needed: string[] };
}

export const useSectionFiveStore = create<SectionFiveStore>()(
  persist(
    (set, get) => ({
      data: initialData,
      currentStep: 0,
      highestStepReached: 0,
      isDirty: false,
      lastSavedAt: null,

      // Project Matrix actions
      updateProjectName: (index, value) => {
        set((state) => {
          const newProjectNames = [...state.data.projectMatrix.projectNames];
          newProjectNames[index] = value;
          return {
            data: {
              ...state.data,
              projectMatrix: {
                ...state.data.projectMatrix,
                projectNames: newProjectNames,
              },
            },
            isDirty: true,
          };
        });
      },

      updateProjectTask: (projectIndex, taskIndex, value) => {
        set((state) => {
          const newTasks = state.data.projectMatrix.tasks.map((project, pIdx) =>
            pIdx === projectIndex
              ? project.map((task, tIdx) => (tIdx === taskIndex ? value : task))
              : project
          );
          return {
            data: {
              ...state.data,
              projectMatrix: {
                ...state.data.projectMatrix,
                tasks: newTasks,
              },
            },
            isDirty: true,
          };
        });
      },

      // Resources actions
      updateCurrentResource: (index, value) => {
        set((state) => {
          const newResources = [...state.data.currentResources];
          newResources[index] = value;
          return {
            data: { ...state.data, currentResources: newResources },
            isDirty: true,
          };
        });
      },

      updateNeededResource: (index, value) => {
        set((state) => {
          const newResources = [...state.data.neededResources];
          newResources[index] = value;
          return {
            data: { ...state.data, neededResources: newResources },
            isDirty: true,
          };
        });
      },

      // Ideal Client actions
      updateIdealClientField: (clientIndex, field, value) => {
        set((state) => {
          const newClients = state.data.idealClients.map((client, idx) =>
            idx === clientIndex ? { ...client, [field]: value } : client
          );
          return {
            data: { ...state.data, idealClients: newClients },
            isDirty: true,
          };
        });
      },

      // Prospecting Activity actions
      updateProspectingActivityField: (activityIndex, field, value) => {
        set((state) => {
          const newActivities = state.data.prospectingActivities.map((activity, idx) =>
            idx === activityIndex ? { ...activity, [field]: value } : activity
          );
          return {
            data: { ...state.data, prospectingActivities: newActivities },
            isDirty: true,
          };
        });
      },

      // Marketing Activity actions
      updateMarketingActivityField: (activityIndex, field, value) => {
        set((state) => {
          const newActivities = state.data.marketingActivities.map((activity, idx) =>
            idx === activityIndex ? { ...activity, [field]: value } : activity
          );
          return {
            data: { ...state.data, marketingActivities: newActivities },
            isDirty: true,
          };
        });
      },

      // Quarterly Marketing actions
      updateQuarterlyMarketing: (field, value) => {
        set((state) => ({
          data: {
            ...state.data,
            quarterlyMarketing: {
              ...state.data.quarterlyMarketing,
              [field]: value,
            },
          },
          isDirty: true,
        }));
      },

      // Commitment Contract actions
      updateCommitmentField: (field, value) => {
        set((state) => ({
          data: {
            ...state.data,
            commitmentContract: {
              ...state.data.commitmentContract,
              [field]: value,
            },
          },
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
      resetProjectMatrix: () => {
        set((state) => ({
          data: { ...state.data, projectMatrix: createEmptyProjectMatrix() },
        }));
      },

      resetResources: () => {
        set((state) => ({
          data: {
            ...state.data,
            currentResources: createEmptyResources(),
            neededResources: createEmptyResources(),
          },
        }));
      },

      resetIdealClients: () => {
        set((state) => ({
          data: {
            ...state.data,
            idealClients: [createEmptyIdealClient(), createEmptyIdealClient()],
          },
        }));
      },

      resetProspectingActivities: () => {
        set((state) => ({
          data: {
            ...state.data,
            prospectingActivities: [
              createEmptyProspectingActivity(),
              createEmptyProspectingActivity(),
              createEmptyProspectingActivity(),
            ],
          },
        }));
      },

      resetMarketingActivities: () => {
        set((state) => ({
          data: {
            ...state.data,
            marketingActivities: [
              createEmptyMarketingActivity(),
              createEmptyMarketingActivity(),
              createEmptyMarketingActivity(),
            ],
          },
        }));
      },

      resetQuarterlyMarketing: () => {
        set((state) => ({
          data: {
            ...state.data,
            quarterlyMarketing: createEmptyQuarterlyMarketing(),
          },
        }));
      },

      resetCommitmentContract: () => {
        set((state) => ({
          data: {
            ...state.data,
            commitmentContract: createEmptyCommitmentContract(),
          },
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

        // Count project matrix
        filled += data.projectMatrix.projectNames.filter((n) => n.trim()).length;
        data.projectMatrix.tasks.forEach((project) => {
          filled += project.filter((t) => t.trim()).length;
        });

        // Count resources
        filled += data.currentResources.filter((r) => r.trim()).length;
        filled += data.neededResources.filter((r) => r.trim()).length;

        // Count ideal clients
        data.idealClients.forEach((client) => {
          if (client.name.trim()) filled++;
          if (client.whoAreThey.trim()) filled++;
          if (client.whatMotivatesThem.trim()) filled++;
          if (client.whereAreThey.trim()) filled++;
          if (client.howToReachThem.trim()) filled++;
        });

        // Count prospecting activities
        data.prospectingActivities.forEach((activity) => {
          if (activity.activity.trim()) filled++;
          if (activity.how.trim()) filled++;
          if (activity.who.trim()) filled++;
          if (activity.when.trim()) filled++;
          if (activity.farmArea.trim()) filled++;
          if (activity.cost !== null) filled++;
          if (activity.followUpPlan.trim()) filled++;
        });

        // Count marketing activities
        data.marketingActivities.forEach((activity) => {
          if (activity.activity.trim()) filled++;
          if (activity.how.trim()) filled++;
          if (activity.who.trim()) filled++;
          if (activity.when.trim()) filled++;
          if (activity.farmArea.trim()) filled++;
          if (activity.cost !== null) filled++;
        });

        // Count quarterly marketing
        const qm = data.quarterlyMarketing;
        if (qm.q1Strategy1.trim()) filled++;
        if (qm.q1Strategy2.trim()) filled++;
        if (qm.q2Strategy1.trim()) filled++;
        if (qm.q2Strategy2.trim()) filled++;
        if (qm.q3Strategy1.trim()) filled++;
        if (qm.q3Strategy2.trim()) filled++;
        if (qm.q4Strategy1.trim()) filled++;
        if (qm.q4Strategy2.trim()) filled++;

        // Count commitment contract
        const cc = data.commitmentContract;
        if (cc.agentName.trim()) filled++;
        if (cc.transactionGoal !== null) filled++;
        if (cc.rewardIfAchieved.trim()) filled++;
        if (cc.consequenceIfFailed.trim()) filled++;
        if (cc.accountabilityPartnerName.trim()) filled++;
        if (cc.agentSignatureDate.trim()) filled++;
        if (cc.partnerSignatureDate.trim()) filled++;

        return filled;
      },

      // Filtered selectors
      getFilledProjectNames: () => {
        return get().data.projectMatrix.projectNames.filter((n) => n.trim());
      },

      getFilledResources: () => {
        const data = get().data;
        return {
          current: data.currentResources.filter((r) => r.trim()),
          needed: data.neededResources.filter((r) => r.trim()),
        };
      },
    }),
    {
      name: "myplanforsuccess:section-five",
    }
  )
);
