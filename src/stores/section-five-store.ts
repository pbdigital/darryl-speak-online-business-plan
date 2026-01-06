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

// Step validation labels for Section 5
const STEP_VALIDATION_LABELS: Record<number, string[]> = {
  1: ["At least one project with one task"],
  2: ["At least one current resource", "At least one needed resource"],
  3: ["At least one ideal client profile"],
  4: ["At least one prospecting activity"],
  5: ["At least one marketing activity"],
  6: ["At least one strategy for Q1", "At least one strategy for Q2", "At least one strategy for Q3", "At least one strategy for Q4"],
  7: ["Agent name", "Transaction goal", "Agent signature date"],
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
  clearProject: (index: number) => { name: string; tasks: string[] };
  restoreProject: (index: number, name: string, tasks: string[]) => void;

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

  // Step validation selectors
  isStepComplete: (step: number) => boolean;
  getStepMissingFields: (step: number) => string[];
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

      clearProject: (index) => {
        const state = get();
        const clearedName = state.data.projectMatrix.projectNames[index];
        const clearedTasks = [...state.data.projectMatrix.tasks[index]];

        set((state) => {
          const newProjectNames = [...state.data.projectMatrix.projectNames];
          newProjectNames[index] = "";

          const newTasks = state.data.projectMatrix.tasks.map((project, pIdx) =>
            pIdx === index ? Array.from({ length: 6 }, () => "") : project
          );

          return {
            data: {
              ...state.data,
              projectMatrix: {
                projectNames: newProjectNames,
                tasks: newTasks,
              },
            },
            isDirty: true,
          };
        });

        return { name: clearedName, tasks: clearedTasks };
      },

      restoreProject: (index, name, tasks) => {
        set((state) => {
          const newProjectNames = [...state.data.projectMatrix.projectNames];
          newProjectNames[index] = name;

          const newTasks = state.data.projectMatrix.tasks.map((project, pIdx) =>
            pIdx === index ? tasks : project
          );

          return {
            data: {
              ...state.data,
              projectMatrix: {
                projectNames: newProjectNames,
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

      // Progress calculation (field-based)
      getProgress: () => {
        // Requirements (per Sarah's rules):
        // - Project matrix: at least 1 project name with at least 1 task
        // - At least 1 current resource
        // - At least 1 needed resource
        // - At least 1 ideal client profile (name + at least 1 other field)
        // - At least 1 prospecting activity (activity + at least 1 detail)
        // - At least 1 marketing activity (activity + at least 1 detail)
        // - Quarterly marketing: at least 1 strategy per quarter (4 requirements)
        // - Commitment contract: name, goal, and signature
        const data = get().data;
        let filled = 0;
        const totalRequirements = 13;

        // At least 1 project with at least 1 task
        const hasProject = data.projectMatrix.projectNames.some((name, idx) => {
          if (!name.trim()) return false;
          return data.projectMatrix.tasks[idx].some((task) => task.trim());
        });
        if (hasProject) filled++;

        // At least 1 current resource
        if (data.currentResources.some((r) => r.trim())) filled++;

        // At least 1 needed resource
        if (data.neededResources.some((r) => r.trim())) filled++;

        // At least 1 ideal client profile (name + at least 1 other field)
        const hasIdealClient = data.idealClients.some((client) => {
          if (!client.name.trim()) return false;
          return (
            client.whoAreThey.trim() ||
            client.whatMotivatesThem.trim() ||
            client.whereAreThey.trim() ||
            client.howToReachThem.trim()
          );
        });
        if (hasIdealClient) filled++;

        // At least 1 prospecting activity (activity + at least 1 detail)
        const hasProspecting = data.prospectingActivities.some((act) => {
          if (!act.activity.trim()) return false;
          return (
            act.how.trim() ||
            act.who.trim() ||
            act.when.trim() ||
            act.farmArea.trim() ||
            act.cost !== null ||
            act.followUpPlan.trim()
          );
        });
        if (hasProspecting) filled++;

        // At least 1 marketing activity (activity + at least 1 detail)
        const hasMarketing = data.marketingActivities.some((act) => {
          if (!act.activity.trim()) return false;
          return (
            act.how.trim() ||
            act.who.trim() ||
            act.when.trim() ||
            act.farmArea.trim() ||
            act.cost !== null
          );
        });
        if (hasMarketing) filled++;

        // Quarterly marketing: at least 1 strategy per quarter
        const qm = data.quarterlyMarketing;
        if (qm.q1Strategy1.trim() || qm.q1Strategy2.trim()) filled++;
        if (qm.q2Strategy1.trim() || qm.q2Strategy2.trim()) filled++;
        if (qm.q3Strategy1.trim() || qm.q3Strategy2.trim()) filled++;
        if (qm.q4Strategy1.trim() || qm.q4Strategy2.trim()) filled++;

        // Commitment contract: name, goal, and signature
        const cc = data.commitmentContract;
        if (cc.agentName.trim()) filled++;
        if (cc.transactionGoal !== null) filled++;
        if (cc.agentSignatureDate.trim()) filled++;

        return Math.round((filled / totalRequirements) * 100);
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

      // Check if a specific step is complete
      isStepComplete: (step: number) => {
        // Step 0 (Overview) and Step 8 (Complete) are always complete
        if (step === 0 || step === 8) return true;

        const data = get().data;

        switch (step) {
          case 1: // Project Matrix - at least 1 project with 1 task
            return data.projectMatrix.projectNames.some((name, idx) => {
              if (!name.trim()) return false;
              return data.projectMatrix.tasks[idx].some((task) => task.trim());
            });
          case 2: // Resources - at least 1 current + 1 needed
            return data.currentResources.some((r) => r.trim()) && data.neededResources.some((r) => r.trim());
          case 3: // Ideal Client - at least 1 client profile with name + 1 other field
            return data.idealClients.some((client) => {
              if (!client.name.trim()) return false;
              return !!(
                client.whoAreThey.trim() ||
                client.whatMotivatesThem.trim() ||
                client.whereAreThey.trim() ||
                client.howToReachThem.trim()
              );
            });
          case 4: // Prospecting - at least 1 activity with activity name + 1 detail
            return data.prospectingActivities.some((act) => {
              if (!act.activity.trim()) return false;
              return !!(
                act.how.trim() ||
                act.who.trim() ||
                act.when.trim() ||
                act.farmArea.trim() ||
                act.cost !== null ||
                act.followUpPlan.trim()
              );
            });
          case 5: // Marketing - at least 1 activity with activity name + 1 detail
            return data.marketingActivities.some((act) => {
              if (!act.activity.trim()) return false;
              return !!(
                act.how.trim() ||
                act.who.trim() ||
                act.when.trim() ||
                act.farmArea.trim() ||
                act.cost !== null
              );
            });
          case 6: // Quarterly Marketing - at least 1 strategy per quarter
            const qm = data.quarterlyMarketing;
            return (
              !!(qm.q1Strategy1.trim() || qm.q1Strategy2.trim()) &&
              !!(qm.q2Strategy1.trim() || qm.q2Strategy2.trim()) &&
              !!(qm.q3Strategy1.trim() || qm.q3Strategy2.trim()) &&
              !!(qm.q4Strategy1.trim() || qm.q4Strategy2.trim())
            );
          case 7: // Commitment Contract - name, goal, signature
            const cc = data.commitmentContract;
            return cc.agentName.trim() !== '' && cc.transactionGoal !== null && cc.agentSignatureDate.trim() !== '';
          default:
            return true;
        }
      },

      // Get missing fields for a specific step with human-readable labels
      getStepMissingFields: (step: number) => {
        // Overview and Complete steps have no missing fields
        if (step === 0 || step === 8) return [];

        const data = get().data;
        const missing: string[] = [];

        switch (step) {
          case 1:
            const hasProject = data.projectMatrix.projectNames.some((name, idx) => {
              if (!name.trim()) return false;
              return data.projectMatrix.tasks[idx].some((task) => task.trim());
            });
            if (!hasProject) {
              missing.push("At least one project with one task");
            }
            break;
          case 2:
            if (!data.currentResources.some((r) => r.trim())) {
              missing.push("At least one current resource");
            }
            if (!data.neededResources.some((r) => r.trim())) {
              missing.push("At least one needed resource");
            }
            break;
          case 3:
            const hasIdealClient = data.idealClients.some((client) => {
              if (!client.name.trim()) return false;
              return (
                client.whoAreThey.trim() ||
                client.whatMotivatesThem.trim() ||
                client.whereAreThey.trim() ||
                client.howToReachThem.trim()
              );
            });
            if (!hasIdealClient) {
              missing.push("At least one ideal client profile");
            }
            break;
          case 4:
            const hasProspecting = data.prospectingActivities.some((act) => {
              if (!act.activity.trim()) return false;
              return (
                act.how.trim() ||
                act.who.trim() ||
                act.when.trim() ||
                act.farmArea.trim() ||
                act.cost !== null ||
                act.followUpPlan.trim()
              );
            });
            if (!hasProspecting) {
              missing.push("At least one prospecting activity");
            }
            break;
          case 5:
            const hasMarketing = data.marketingActivities.some((act) => {
              if (!act.activity.trim()) return false;
              return (
                act.how.trim() ||
                act.who.trim() ||
                act.when.trim() ||
                act.farmArea.trim() ||
                act.cost !== null
              );
            });
            if (!hasMarketing) {
              missing.push("At least one marketing activity");
            }
            break;
          case 6:
            const qm = data.quarterlyMarketing;
            if (!qm.q1Strategy1.trim() && !qm.q1Strategy2.trim()) {
              missing.push("At least one strategy for Q1");
            }
            if (!qm.q2Strategy1.trim() && !qm.q2Strategy2.trim()) {
              missing.push("At least one strategy for Q2");
            }
            if (!qm.q3Strategy1.trim() && !qm.q3Strategy2.trim()) {
              missing.push("At least one strategy for Q3");
            }
            if (!qm.q4Strategy1.trim() && !qm.q4Strategy2.trim()) {
              missing.push("At least one strategy for Q4");
            }
            break;
          case 7:
            const cc = data.commitmentContract;
            if (!cc.agentName.trim()) {
              missing.push("Agent name");
            }
            if (cc.transactionGoal === null) {
              missing.push("Transaction goal");
            }
            if (!cc.agentSignatureDate.trim()) {
              missing.push("Agent signature date");
            }
            break;
        }

        return missing;
      },
    }),
    {
      name: "myplanforsuccess:section-five",
    }
  )
);
