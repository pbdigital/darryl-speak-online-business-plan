import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  IncomePlanningSection,
  CalculatedMetrics,
} from '@/types/business-plan';

// Conversion ratios (constants from the PDF)
const APPOINTMENTS_PER_TRANSACTION = 5;
const CONVERSATIONS_PER_APPOINTMENT = 16;
const REACHOUTS_PER_CONVERSATION = 12.5;
const WEEKS_PER_YEAR = 52;

// Total steps in Section 3 (excluding overview at 0, content steps 1-8, complete at 9)
const TOTAL_CONTENT_STEPS = 8;

// Step validation labels for Section 3
const STEP_VALIDATION_LABELS: Record<number, string[]> = {
  1: ["At least one personal expense"],
  2: ["At least one business expense"],
  3: ["At least one manifest goal with name and amount"],
  4: ["Estimated tax rate"],
  5: ["Broker split percentage"],
  6: ["Average sales price", "Average commission rate"],
  7: ["Work days per week", "Weeks off per year"],
  8: ["What reaching your goal means", "What failing your goal means"],
};

interface BusinessPlanStore {
  // Income Planning Data
  incomePlanning: IncomePlanningSection;

  // Calculated Metrics (derived values)
  calculated: CalculatedMetrics;

  // Step tracking for progress
  currentStep: number;
  highestStepReached: number;

  // Save state tracking
  isDirty: boolean;
  lastSavedAt: number | null;

  // Actions
  updatePersonalExpense: (index: number, amount: number | null) => void;
  updateBusinessExpense: (index: number, amount: number | null) => void;
  updateGoal: (
    category: 'familyGoals' | 'financialGoals' | 'personalGoals' | 'businessGoals',
    index: number,
    field: 'name' | 'amount',
    value: string | number | null
  ) => void;
  updateTaxRate: (rate: number | null) => void;
  updateBrokerSplit: (split: number | null) => void;
  updateBrokerCap: (cap: number | null) => void;
  updateMarketData: (field: 'averageSalesPrice' | 'averageCommissionRate', value: number | null) => void;
  updateWorkSchedule: (field: 'workDaysPerWeek' | 'weeksOff', value: number | null) => void;
  updateCommitmentText: (field: 'reachingGoalMeans' | 'failingGoalMeans', value: string) => void;

  // Step navigation
  setCurrentStep: (step: number) => void;

  // Reset section
  resetSection: () => void;
  markSaved: () => void;

  // Persistence actions
  hydrate: (serverData: Partial<IncomePlanningSection>) => void;
  getData: () => IncomePlanningSection;

  // Recalculate all derived values
  recalculate: () => void;

  // Progress tracking (step-based)
  getProgress: () => number;
  getFilledFieldCount: () => number;

  // Step validation selectors
  isStepComplete: (step: number) => boolean;
  getStepMissingFields: (step: number) => string[];
}

// Default personal expense items from the PDF
const defaultPersonalExpenses = [
  { name: 'Mortgage/Rent', amount: null },
  { name: 'Car Payment', amount: null },
  { name: 'Car Gas', amount: null },
  { name: 'Car Maintenance', amount: null },
  { name: 'Car Insurance', amount: null },
  { name: 'Electric', amount: null },
  { name: 'Gas/Heat', amount: null },
  { name: 'Cable', amount: null },
  { name: 'Internet', amount: null },
  { name: 'Cell Phone', amount: null },
  { name: 'Water/Sewer', amount: null },
  { name: 'Food/Groceries', amount: null },
  { name: 'Dining Out/Entertainment', amount: null },
  { name: 'Travel', amount: null },
  { name: 'Child Care', amount: null },
  { name: 'Savings/Investments', amount: null },
  { name: 'Health Insurance', amount: null },
  { name: 'Credit Card Payments', amount: null },
  { name: 'Student Loans', amount: null },
  { name: 'Other', amount: null },
];

// Default business expense items from the PDF
const defaultBusinessExpenses = [
  { name: 'Board Dues (annual ÷ 12)', amount: null },
  { name: 'MLS Fees (annual ÷ 12)', amount: null },
  { name: 'Desk Fees', amount: null },
  { name: 'E&O Insurance (annual ÷ 12)', amount: null },
  { name: 'Education/Training', amount: null },
  { name: 'Advertising/Lead Generation', amount: null },
  { name: 'Print Marketing', amount: null },
  { name: 'Signs/For Sale Signs', amount: null },
  { name: 'Business Cards', amount: null },
  { name: 'Events/Networking', amount: null },
  { name: 'Photography', amount: null },
  { name: 'CRM/Software', amount: null },
  { name: 'Other', amount: null },
  { name: 'Other', amount: null },
];

const defaultGoals = [
  { name: '', amount: null },
  { name: '', amount: null },
  { name: '', amount: null },
  { name: '', amount: null },
  { name: '', amount: null },
];

const initialIncomePlanning: IncomePlanningSection = {
  personalExpenses: [...defaultPersonalExpenses],
  businessExpenses: [...defaultBusinessExpenses],
  familyGoals: [...defaultGoals],
  financialGoals: [...defaultGoals],
  personalGoals: [...defaultGoals],
  businessGoals: [...defaultGoals],
  estimatedTaxRate: null,
  brokerSplitPercentage: null,
  brokerCapAmount: null,
  averageSalesPrice: null,
  averageCommissionRate: null,
  workDaysPerWeek: 5,
  weeksOff: 2,
  reachingGoalMeans: '',
  failingGoalMeans: '',
};

const initialCalculated: CalculatedMetrics = {
  monthlyPersonalTotal: 0,
  monthlyBusinessTotal: 0,
  combinedMonthlyTotal: 0,
  annualExpenses: 0,
  manifestGoalsTotal: 0,
  targetTakeHomeIncome: 0,
  annualTaxableIncomeNeeded: 0,
  gciNeeded: 0,
  adjustedGciNeeded: 0,
  averageCommissionPerTransaction: 0,
  totalTransactionsNeeded: 0,
  appointmentsNeeded: 0,
  conversationsNeeded: 0,
  reachOutsNeeded: 0,
  workingDays: 0,
  dailyReachOuts: 0,
  dailyConversations: 0,
  dailyAppointments: 0,
};

// Helper to sum amounts from an array of items
const sumAmounts = (items: { amount: number | null }[]): number => {
  return items.reduce((sum, item) => sum + (item.amount || 0), 0);
};

export const useBusinessPlanStore = create<BusinessPlanStore>()(
  persist(
    (set, get) => ({
  incomePlanning: initialIncomePlanning,
  calculated: initialCalculated,
  currentStep: 0,
  highestStepReached: 0,
  isDirty: false,
  lastSavedAt: null,

  updatePersonalExpense: (index, amount) => {
    set((state) => {
      const newExpenses = [...state.incomePlanning.personalExpenses];
      newExpenses[index] = { ...newExpenses[index], amount };
      return {
        incomePlanning: { ...state.incomePlanning, personalExpenses: newExpenses },
        isDirty: true,
      };
    });
    get().recalculate();
  },

  updateBusinessExpense: (index, amount) => {
    set((state) => {
      const newExpenses = [...state.incomePlanning.businessExpenses];
      newExpenses[index] = { ...newExpenses[index], amount };
      return {
        incomePlanning: { ...state.incomePlanning, businessExpenses: newExpenses },
        isDirty: true,
      };
    });
    get().recalculate();
  },

  updateGoal: (category, index, field, value) => {
    set((state) => {
      const newGoals = [...state.incomePlanning[category]];
      newGoals[index] = {
        ...newGoals[index],
        [field]: value,
      };
      return {
        incomePlanning: { ...state.incomePlanning, [category]: newGoals },
        isDirty: true,
      };
    });
    get().recalculate();
  },

  updateTaxRate: (rate) => {
    set((state) => ({
      incomePlanning: { ...state.incomePlanning, estimatedTaxRate: rate },
      isDirty: true,
    }));
    get().recalculate();
  },

  updateBrokerSplit: (split) => {
    set((state) => ({
      incomePlanning: { ...state.incomePlanning, brokerSplitPercentage: split },
      isDirty: true,
    }));
    get().recalculate();
  },

  updateBrokerCap: (cap) => {
    set((state) => ({
      incomePlanning: { ...state.incomePlanning, brokerCapAmount: cap },
      isDirty: true,
    }));
    get().recalculate();
  },

  updateMarketData: (field, value) => {
    set((state) => ({
      incomePlanning: { ...state.incomePlanning, [field]: value },
      isDirty: true,
    }));
    get().recalculate();
  },

  updateWorkSchedule: (field, value) => {
    set((state) => ({
      incomePlanning: { ...state.incomePlanning, [field]: value },
      isDirty: true,
    }));
    get().recalculate();
  },

  updateCommitmentText: (field, value) => {
    set((state) => ({
      incomePlanning: { ...state.incomePlanning, [field]: value },
      isDirty: true,
    }));
  },

  setCurrentStep: (step) => {
    set((state) => ({
      currentStep: step,
      // Track the highest step reached (for progress calculation)
      highestStepReached: Math.max(state.highestStepReached, step),
    }));
  },

  resetSection: () => {
    set({
      incomePlanning: initialIncomePlanning,
      calculated: initialCalculated,
      currentStep: 0,
      highestStepReached: 0,
      isDirty: false,
      lastSavedAt: null,
    });
  },

  markSaved: () => {
    set({ isDirty: false, lastSavedAt: Date.now() });
  },

  hydrate: (serverData) => {
    set((state) => ({
      incomePlanning: { ...state.incomePlanning, ...serverData },
      isDirty: false,
      lastSavedAt: Date.now(),
    }));
    // Recalculate all derived values after hydration
    get().recalculate();
  },

  getData: () => {
    return get().incomePlanning;
  },

  getFilledFieldCount: () => {
    const { incomePlanning } = get();
    let count = 0;

    // Count filled personal expenses
    count += incomePlanning.personalExpenses.filter(e => e.amount !== null).length;

    // Count filled business expenses
    count += incomePlanning.businessExpenses.filter(e => e.amount !== null).length;

    // Count filled goals (both name and amount count)
    const countFilledGoals = (goals: { name: string; amount: number | null }[]) =>
      goals.filter(g => g.name.trim() !== '' || g.amount !== null).length;

    count += countFilledGoals(incomePlanning.familyGoals);
    count += countFilledGoals(incomePlanning.financialGoals);
    count += countFilledGoals(incomePlanning.personalGoals);
    count += countFilledGoals(incomePlanning.businessGoals);

    // Count other fields
    if (incomePlanning.estimatedTaxRate !== null) count++;
    if (incomePlanning.brokerSplitPercentage !== null) count++;
    if (incomePlanning.brokerCapAmount !== null) count++;
    if (incomePlanning.averageSalesPrice !== null) count++;
    if (incomePlanning.averageCommissionRate !== null) count++;
    if (incomePlanning.workDaysPerWeek !== null) count++;
    if (incomePlanning.weeksOff !== null) count++;
    if (incomePlanning.reachingGoalMeans.trim() !== '') count++;
    if (incomePlanning.failingGoalMeans.trim() !== '') count++;

    return count;
  },

  getProgress: () => {
    // Field-based progress: count filled required fields
    // Requirements (per Sarah's rules):
    // - At least 1 personal expense (not null, 0 counts)
    // - At least 1 business expense (not null, 0 counts)
    // - At least 1 manifest goal (name + amount filled)
    // - Tax rate, broker split, market data (not null)
    // - Work schedule (not null, have defaults)
    // - Commitment texts (non-empty)
    const { incomePlanning } = get();
    let filled = 0;
    const totalRequirements = 11;

    // At least 1 personal expense (amount not null)
    const hasPersonalExpense = incomePlanning.personalExpenses.some(
      (e) => e.amount !== null
    );
    if (hasPersonalExpense) filled++;

    // At least 1 business expense (amount not null)
    const hasBusinessExpense = incomePlanning.businessExpenses.some(
      (e) => e.amount !== null
    );
    if (hasBusinessExpense) filled++;

    // At least 1 manifest goal (name + amount)
    const allGoals = [
      ...incomePlanning.familyGoals,
      ...incomePlanning.financialGoals,
      ...incomePlanning.personalGoals,
      ...incomePlanning.businessGoals,
    ];
    const hasManifestGoal = allGoals.some(
      (g) => g.name.trim() && g.amount !== null
    );
    if (hasManifestGoal) filled++;

    // Tax rate (not null)
    if (incomePlanning.estimatedTaxRate !== null) filled++;

    // Broker split (not null)
    if (incomePlanning.brokerSplitPercentage !== null) filled++;

    // Average sales price (not null)
    if (incomePlanning.averageSalesPrice !== null) filled++;

    // Average commission rate (not null)
    if (incomePlanning.averageCommissionRate !== null) filled++;

    // Work days per week (not null)
    if (incomePlanning.workDaysPerWeek !== null) filled++;

    // Weeks off (not null)
    if (incomePlanning.weeksOff !== null) filled++;

    // Commitment texts (non-empty)
    if (incomePlanning.reachingGoalMeans.trim()) filled++;
    if (incomePlanning.failingGoalMeans.trim()) filled++;

    return Math.round((filled / totalRequirements) * 100);
  },

  recalculate: () => {
    const { incomePlanning } = get();

    // Part 3A: Calculate expense totals
    const monthlyPersonalTotal = sumAmounts(incomePlanning.personalExpenses);
    const monthlyBusinessTotal = sumAmounts(incomePlanning.businessExpenses);
    const combinedMonthlyTotal = monthlyPersonalTotal + monthlyBusinessTotal;
    const annualExpenses = combinedMonthlyTotal * 12;

    // Part 3B: Calculate manifest goals total
    const manifestGoalsTotal =
      sumAmounts(incomePlanning.familyGoals) +
      sumAmounts(incomePlanning.financialGoals) +
      sumAmounts(incomePlanning.personalGoals) +
      sumAmounts(incomePlanning.businessGoals);

    // Part 3C: Target take-home income
    const targetTakeHomeIncome = annualExpenses + manifestGoalsTotal;

    // Part 3D: Account for taxes
    const taxRate = incomePlanning.estimatedTaxRate || 0;
    const taxMultiplier = 1 - taxRate / 100;
    const annualTaxableIncomeNeeded =
      taxMultiplier > 0 ? targetTakeHomeIncome / taxMultiplier : 0;

    // Part 3E: Account for broker split
    const brokerSplit = incomePlanning.brokerSplitPercentage || 0;
    const agentShare = 1 - brokerSplit / 100;
    const gciNeeded =
      agentShare > 0 ? annualTaxableIncomeNeeded / agentShare : 0;

    // Adjusted GCI if broker has a cap
    const brokerCap = incomePlanning.brokerCapAmount || 0;
    const adjustedGciNeeded =
      brokerCap > 0 ? brokerCap + annualTaxableIncomeNeeded : gciNeeded;

    // Part 3F: Calculate transactions needed
    const avgPrice = incomePlanning.averageSalesPrice || 0;
    const avgRate = incomePlanning.averageCommissionRate || 0;
    const averageCommissionPerTransaction = avgPrice * avgRate;
    const finalGci = brokerCap > 0 ? adjustedGciNeeded : gciNeeded;
    const totalTransactionsNeeded =
      averageCommissionPerTransaction > 0
        ? Math.ceil(finalGci / averageCommissionPerTransaction)
        : 0;

    // Part 3G: Reverse engineer daily activities
    const appointmentsNeeded = totalTransactionsNeeded * APPOINTMENTS_PER_TRANSACTION;
    const conversationsNeeded = appointmentsNeeded * CONVERSATIONS_PER_APPOINTMENT;
    const reachOutsNeeded = conversationsNeeded * REACHOUTS_PER_CONVERSATION;

    // Calculate working days
    const daysPerWeek = incomePlanning.workDaysPerWeek || 5;
    const weeksOff = incomePlanning.weeksOff || 0;
    const workingDays = daysPerWeek * WEEKS_PER_YEAR - daysPerWeek * weeksOff;

    // Daily targets
    const dailyReachOuts = workingDays > 0 ? reachOutsNeeded / workingDays : 0;
    const dailyConversations = workingDays > 0 ? conversationsNeeded / workingDays : 0;
    const dailyAppointments = workingDays > 0 ? appointmentsNeeded / workingDays : 0;

    set({
      calculated: {
        monthlyPersonalTotal,
        monthlyBusinessTotal,
        combinedMonthlyTotal,
        annualExpenses,
        manifestGoalsTotal,
        targetTakeHomeIncome,
        annualTaxableIncomeNeeded,
        gciNeeded,
        adjustedGciNeeded,
        averageCommissionPerTransaction,
        totalTransactionsNeeded,
        appointmentsNeeded,
        conversationsNeeded,
        reachOutsNeeded,
        workingDays,
        dailyReachOuts,
        dailyConversations,
        dailyAppointments,
      },
    });
  },

  // Check if a specific step is complete
  isStepComplete: (step: number) => {
    // Step 0 (Overview) and Step 9 (Complete) are always complete
    if (step === 0 || step === 9) return true;

    const { incomePlanning } = get();

    switch (step) {
      case 1: // Personal Expenses - at least 1 expense
        return incomePlanning.personalExpenses.some((e) => e.amount !== null);
      case 2: // Business Expenses - at least 1 expense
        return incomePlanning.businessExpenses.some((e) => e.amount !== null);
      case 3: // Manifest List - at least 1 goal with name + amount
        const allGoals = [
          ...incomePlanning.familyGoals,
          ...incomePlanning.financialGoals,
          ...incomePlanning.personalGoals,
          ...incomePlanning.businessGoals,
        ];
        return allGoals.some((g) => g.name.trim() && g.amount !== null);
      case 4: // Tax Calculation - tax rate
        return incomePlanning.estimatedTaxRate !== null;
      case 5: // GCI Goal - broker split
        return incomePlanning.brokerSplitPercentage !== null;
      case 6: // Transactions - avg sales price + commission rate
        return incomePlanning.averageSalesPrice !== null && incomePlanning.averageCommissionRate !== null;
      case 7: // Daily Activities - work days + weeks off
        return incomePlanning.workDaysPerWeek !== null && incomePlanning.weeksOff !== null;
      case 8: // Income Commitment - reaching + failing goal texts
        return incomePlanning.reachingGoalMeans.trim() !== '' && incomePlanning.failingGoalMeans.trim() !== '';
      default:
        return true;
    }
  },

  // Get missing fields for a specific step with human-readable labels
  getStepMissingFields: (step: number) => {
    // Overview and Complete steps have no missing fields
    if (step === 0 || step === 9) return [];

    const { incomePlanning } = get();
    const missing: string[] = [];

    switch (step) {
      case 1:
        if (!incomePlanning.personalExpenses.some((e) => e.amount !== null)) {
          missing.push("At least one personal expense");
        }
        break;
      case 2:
        if (!incomePlanning.businessExpenses.some((e) => e.amount !== null)) {
          missing.push("At least one business expense");
        }
        break;
      case 3:
        const allGoals = [
          ...incomePlanning.familyGoals,
          ...incomePlanning.financialGoals,
          ...incomePlanning.personalGoals,
          ...incomePlanning.businessGoals,
        ];
        if (!allGoals.some((g) => g.name.trim() && g.amount !== null)) {
          missing.push("At least one manifest goal with name and amount");
        }
        break;
      case 4:
        if (incomePlanning.estimatedTaxRate === null) {
          missing.push("Estimated tax rate");
        }
        break;
      case 5:
        if (incomePlanning.brokerSplitPercentage === null) {
          missing.push("Broker split percentage");
        }
        break;
      case 6:
        if (incomePlanning.averageSalesPrice === null) {
          missing.push("Average sales price");
        }
        if (incomePlanning.averageCommissionRate === null) {
          missing.push("Average commission rate");
        }
        break;
      case 7:
        if (incomePlanning.workDaysPerWeek === null) {
          missing.push("Work days per week");
        }
        if (incomePlanning.weeksOff === null) {
          missing.push("Weeks off per year");
        }
        break;
      case 8:
        if (!incomePlanning.reachingGoalMeans.trim()) {
          missing.push("What reaching your goal means");
        }
        if (!incomePlanning.failingGoalMeans.trim()) {
          missing.push("What failing your goal means");
        }
        break;
    }

    return missing;
  },
    }),
    {
      name: 'myplanforsuccess:section-three',
    }
  )
);
