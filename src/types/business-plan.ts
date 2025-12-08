// Business Plan Types
// Based on the 2026 Real Estate Business Plan PDF structure

export interface BusinessPlan {
  id: string;
  userId: string;
  year: number;
  createdAt: string;
  updatedAt: string;
}

// Section 1: Annual Reflection & Intention Setting
export interface ReflectionSection {
  // Last Year in Review - Production Numbers
  listingsTaken: number | null;
  sellerSidesClosed: number | null;
  buyerSidesClosed: number | null;
  renterTransactions: number | null;
  grossClosedCommissions: number | null;

  // Reflection Questions
  didAchieveGoals: string;
  biggestStruggles: string;
  biggestAccomplishment: string;
  howProspected: string;
  whatWentWell: string;

  // New Year's Reflection
  lookingBack: string;
  gratitude: string;
  selfReflection: string;
  valuesAndPriorities: string;
  goalsAndIntentions: string;
  obstaclesAndStrategies: string;
  selfCareAndWellBeing: string;
  personalGrowthAndLearning: string;
  givingBackAndContribution: string;
  oneWordOrMantra: string;
  accountabilityAndTracking: string;
  celebrationAndReflection: string;
}

// Section 2: SWOT Analysis
export interface SwotItem {
  content: string;
  action: string;
}

export interface WeaknessItem {
  content: string;
  action: 'accept' | 'delegate' | 'improve' | null;
}

export interface SwotSection {
  strengths: SwotItem[];
  weaknesses: WeaknessItem[];
  opportunities: SwotItem[];
  threats: SwotItem[];
}

// Section 3: Vision, Goals & Income Planning
export interface ExpenseItem {
  name: string;
  amount: number | null;
}

export interface GoalItem {
  name: string;
  amount: number | null;
}

export interface IncomePlanningSection {
  // Part 3A: Financial Foundation
  personalExpenses: ExpenseItem[];
  businessExpenses: ExpenseItem[];

  // Part 3B: Manifest List
  familyGoals: GoalItem[];
  financialGoals: GoalItem[];
  personalGoals: GoalItem[];
  businessGoals: GoalItem[];

  // Part 3D: Tax Rate
  estimatedTaxRate: number | null;

  // Part 3E: Broker Split
  brokerSplitPercentage: number | null;
  brokerCapAmount: number | null;

  // Part 3F: Market Data
  averageSalesPrice: number | null;
  averageCommissionRate: number | null;

  // Part 3G: Work Schedule
  workDaysPerWeek: number | null;
  weeksOff: number | null;

  // Part 3H: Commitment Text
  reachingGoalMeans: string;
  failingGoalMeans: string;
}

// Calculated values from Section 3 (derived, not stored)
export interface CalculatedMetrics {
  monthlyPersonalTotal: number;
  monthlyBusinessTotal: number;
  combinedMonthlyTotal: number;
  annualExpenses: number;
  manifestGoalsTotal: number;
  targetTakeHomeIncome: number;
  annualTaxableIncomeNeeded: number;
  gciNeeded: number;
  adjustedGciNeeded: number;
  averageCommissionPerTransaction: number;
  totalTransactionsNeeded: number;
  appointmentsNeeded: number;
  conversationsNeeded: number;
  reachOutsNeeded: number;
  workingDays: number;
  dailyReachOuts: number;
  dailyConversations: number;
  dailyAppointments: number;
}

// Section 4: Mindset, Self-Care & Motivation
export interface MindsetSection {
  affirmations: string[];
  morningRoutine: string;
  eveningRoutine: string;
  boundaries: string[];
  selfCareCommitments: string[];
  whatMotivatesMe: string;
  supportSystem: string[];
  whoINeedToBecome: string;
}

// Section 5: Accountability & Progress Tracking
export interface ProjectTask {
  task: string;
  completed: boolean;
}

export interface Project {
  name: string;
  tasks: ProjectTask[];
}

export interface IdealClient {
  name: string;
  whoAreThey: string;
  whatMotivatesThem: string;
  whereAreThey: string;
  howToReachThem: string;
}

export interface ProspectingActivity {
  activity: string;
  method: string;
  targetAudience: string;
  schedule: string;
  farmArea: string;
  cost: string;
  followUpPlan: string;
}

export interface MarketingActivity {
  activity: string;
  platform: string;
  targetAudience: string;
  timeline: string;
  farmArea: string;
  cost: string;
}

export interface QuarterlyMarketing {
  q1: string[];
  q2: string[];
  q3: string[];
  q4: string[];
}

export interface AccountabilitySection {
  projects: Project[];
  currentResources: string[];
  neededResources: string[];
  idealClients: IdealClient[];
  prospectingActivities: ProspectingActivity[];
  marketingActivities: MarketingActivity[];
  quarterlyMarketing: QuarterlyMarketing;

  // Commitment Contract
  commitmentName: string;
  transactionGoal: number | null;
  rewardIfAchieved: string;
  consequenceIfFailed: string;
  accountabilityPartner: string;
}

// Complete Business Plan Data
export interface BusinessPlanData {
  reflection: ReflectionSection;
  swot: SwotSection;
  incomePlanning: IncomePlanningSection;
  mindset: MindsetSection;
  accountability: AccountabilitySection;
}
