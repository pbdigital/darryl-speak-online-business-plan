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

interface BusinessPlanStore {
  // Income Planning Data
  incomePlanning: IncomePlanningSection;

  // Calculated Metrics (derived values)
  calculated: CalculatedMetrics;

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

  // Reset section
  resetSection: () => void;

  // Recalculate all derived values
  recalculate: () => void;

  // Progress tracking
  getProgress: () => number;
  getFilledFieldCount: () => number;
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

// Total fields for progress calculation:
// 20 personal expenses + 14 business expenses + 20 goals (4 categories × 5)
// + tax rate + broker split + broker cap + avg price + avg commission rate
// + work days + weeks off + 2 commitment texts = 63 fields
const TOTAL_FIELDS = 63;

export const useBusinessPlanStore = create<BusinessPlanStore>()(
  persist(
    (set, get) => ({
  incomePlanning: initialIncomePlanning,
  calculated: initialCalculated,

  updatePersonalExpense: (index, amount) => {
    set((state) => {
      const newExpenses = [...state.incomePlanning.personalExpenses];
      newExpenses[index] = { ...newExpenses[index], amount };
      return {
        incomePlanning: { ...state.incomePlanning, personalExpenses: newExpenses },
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
      };
    });
    get().recalculate();
  },

  updateTaxRate: (rate) => {
    set((state) => ({
      incomePlanning: { ...state.incomePlanning, estimatedTaxRate: rate },
    }));
    get().recalculate();
  },

  updateBrokerSplit: (split) => {
    set((state) => ({
      incomePlanning: { ...state.incomePlanning, brokerSplitPercentage: split },
    }));
    get().recalculate();
  },

  updateBrokerCap: (cap) => {
    set((state) => ({
      incomePlanning: { ...state.incomePlanning, brokerCapAmount: cap },
    }));
    get().recalculate();
  },

  updateMarketData: (field, value) => {
    set((state) => ({
      incomePlanning: { ...state.incomePlanning, [field]: value },
    }));
    get().recalculate();
  },

  updateWorkSchedule: (field, value) => {
    set((state) => ({
      incomePlanning: { ...state.incomePlanning, [field]: value },
    }));
    get().recalculate();
  },

  updateCommitmentText: (field, value) => {
    set((state) => ({
      incomePlanning: { ...state.incomePlanning, [field]: value },
    }));
  },

  resetSection: () => {
    set({
      incomePlanning: initialIncomePlanning,
      calculated: initialCalculated,
    });
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
    const filledCount = get().getFilledFieldCount();
    return Math.round((filledCount / TOTAL_FIELDS) * 100);
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
    }),
    {
      name: 'myplanforsuccess:section-three',
    }
  )
);
