import type { StoreApi } from 'zustand';
import type { SectionKey } from './events';
import { useSectionOneStore, type SectionOneData } from '@/stores/section-one-store';
import { useSectionTwoStore, type SectionTwoData } from '@/stores/section-two-store';
import { useBusinessPlanStore } from '@/stores/business-plan-store';
import { useSectionFourStore } from '@/stores/section-four-store';
import { useSectionFiveStore } from '@/stores/section-five-store';
import type {
  AccountabilitySection,
  IncomePlanningSection,
  MindsetSection,
} from '@/types/business-plan';

/**
 * Server-side readings of saved plan data, using the section stores' own
 * rules so the server always agrees with what the user sees.
 *
 * The app has no stored "section complete" flag: a section counts as done
 * when its store's getProgress() reaches 100, which is what the dashboard
 * shows. To read that on the server, the saved section data is loaded into
 * the store (merged over its initial state, as hydrate does), the value is
 * read, and the store is put back. This runs synchronously, so requests
 * can't interleave.
 */

type SwappableStore<S> = Pick<StoreApi<S>, 'getState' | 'setState' | 'getInitialState'>;

function withStoreState<S, R>(
  store: SwappableStore<S>,
  patch: (initial: S) => Partial<S>,
  read: () => R
): R {
  const previous = store.getState();
  store.setState(patch(store.getInitialState()));
  try {
    return read();
  } finally {
    store.setState(previous, true);
  }
}

const incomePlanningPatch =
  (data: Record<string, unknown>) =>
  (initial: { incomePlanning: IncomePlanningSection }) => ({
    incomePlanning: { ...initial.incomePlanning, ...(data as Partial<IncomePlanningSection>) },
  });

const PROGRESS: Record<SectionKey, (data: Record<string, unknown>) => number> = {
  reflection: (data) =>
    withStoreState(
      useSectionOneStore,
      (initial) => ({ data: { ...initial.data, ...(data as Partial<SectionOneData>) } }),
      () => useSectionOneStore.getState().getProgress()
    ),
  swot: (data) =>
    withStoreState(
      useSectionTwoStore,
      (initial) => ({ data: { ...initial.data, ...(data as Partial<SectionTwoData>) } }),
      () => useSectionTwoStore.getState().getProgress()
    ),
  'income-planning': (data) =>
    withStoreState(useBusinessPlanStore, incomePlanningPatch(data), () =>
      useBusinessPlanStore.getState().getProgress()
    ),
  mindset: (data) =>
    withStoreState(
      useSectionFourStore,
      (initial) => ({ data: { ...initial.data, ...(data as Partial<MindsetSection>) } }),
      () => useSectionFourStore.getState().getProgress()
    ),
  accountability: (data) =>
    withStoreState(
      useSectionFiveStore,
      (initial) => ({ data: { ...initial.data, ...(data as Partial<AccountabilitySection>) } }),
      () => useSectionFiveStore.getState().getProgress()
    ),
};

/** True when the saved section data meets the section's completion rules. */
export function isSectionComplete(sectionKey: SectionKey, data: Record<string, unknown>): boolean {
  try {
    return PROGRESS[sectionKey](data) === 100;
  } catch {
    // Malformed saved data can't be complete.
    return false;
  }
}

export interface PlanNumbers {
  gciGoal: number;
  transactionsGoal: number;
  conversationsPerWeek: number;
}

/**
 * The plan's headline numbers from saved Section 3 data, calculated by the
 * Section 3 store. On the server the store's persist middleware logs one
 * "storage is currently unavailable" warning per call, because recalculate()
 * writes through it; that is harmless.
 */
export function calculatePlanNumbers(data: Record<string, unknown>): PlanNumbers {
  return withStoreState(useBusinessPlanStore, incomePlanningPatch(data), () => {
    useBusinessPlanStore.getState().recalculate();
    const { calculated, incomePlanning } = useBusinessPlanStore.getState();
    const gciGoal =
      (incomePlanning.brokerCapAmount || 0) > 0 ? calculated.adjustedGciNeeded : calculated.gciNeeded;
    const workingWeeks = 52 - (incomePlanning.weeksOff || 0);
    return {
      gciGoal: Math.round(gciGoal),
      transactionsGoal: calculated.totalTransactionsNeeded,
      conversationsPerWeek:
        workingWeeks > 0 ? Math.ceil(calculated.conversationsNeeded / workingWeeks) : 0,
    };
  });
}
