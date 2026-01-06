// Business Plan Types
// Based on the Real Estate Business Plan PDF structure

export interface BusinessPlan {
  id: string;
  userId: string;
  year: number;
  createdAt: string;
  updatedAt: string;
}

// Section 1: Annual Reflection & Intention Setting
export interface ReflectionSection {
  // Past 12 Months in Review - Production Numbers
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

// Project Matrix - 5 projects with 6 tasks each (simple grid)
export interface ProjectMatrixData {
  projectNames: string[]; // 5 project column names
  tasks: string[][]; // 5 projects × 6 tasks = string[5][6]
}

export interface IdealClientProfile {
  name: string;
  whoAreThey: string;
  whatMotivatesThem: string;
  whereAreThey: string;
  howToReachThem: string;
}

export interface ProspectingActivity {
  activity: string;
  how: string; // Method/Tool
  who: string; // Target audience
  when: string; // Schedule
  farmArea: string;
  cost: number | null; // Currency
  followUpPlan: string;
}

export interface MarketingActivity {
  activity: string;
  how: string; // Platform/Method
  who: string; // Target audience
  when: string; // Timeline
  farmArea: string;
  cost: number | null; // Currency
}

export interface QuarterlyMarketing {
  q1Strategy1: string;
  q1Strategy2: string;
  q2Strategy1: string;
  q2Strategy2: string;
  q3Strategy1: string;
  q3Strategy2: string;
  q4Strategy1: string;
  q4Strategy2: string;
}

export interface CommitmentContract {
  agentName: string;
  transactionGoal: number | null;
  rewardIfAchieved: string;
  consequenceIfFailed: string;
  accountabilityPartnerName: string;
  agentSignatureDate: string;
  partnerSignatureDate: string;
}

export interface AccountabilitySection {
  projectMatrix: ProjectMatrixData;
  currentResources: string[]; // 4 items
  neededResources: string[]; // 4 items
  idealClients: IdealClientProfile[]; // 2 profiles
  prospectingActivities: ProspectingActivity[]; // 3 activities
  marketingActivities: MarketingActivity[]; // 3 activities
  quarterlyMarketing: QuarterlyMarketing;
  commitmentContract: CommitmentContract;
}

// Complete Business Plan Data
export interface BusinessPlanData {
  reflection: ReflectionSection;
  swot: SwotSection;
  incomePlanning: IncomePlanningSection;
  mindset: MindsetSection;
  accountability: AccountabilitySection;
}
