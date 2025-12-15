'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import {
  getOrCreateBusinessPlan,
  getPlanSections,
  BusinessPlan,
  PlanSection,
  SectionKey,
} from '@/lib/api';

interface BusinessPlanContextType {
  /** The current business plan */
  plan: BusinessPlan | null;
  /** Sections data indexed by section key */
  sections: Record<SectionKey, PlanSection | null>;
  /** Whether the plan is currently loading */
  isLoading: boolean;
  /** Error message if loading failed */
  error: string | null;
  /** Refetch plan and sections from server */
  refetchPlan: () => Promise<void>;
  /** Update a section's cached data after successful save */
  updateSectionCache: (sectionKey: SectionKey, section: PlanSection) => void;
}

const BusinessPlanContext = createContext<BusinessPlanContextType | null>(null);

interface BusinessPlanProviderProps {
  children: ReactNode;
  /** The year for the business plan (defaults to next year) */
  year?: number;
}

export function BusinessPlanProvider({
  children,
  year = new Date().getFullYear() + 1,
}: BusinessPlanProviderProps) {
  const [plan, setPlan] = useState<BusinessPlan | null>(null);
  const [sections, setSections] = useState<Record<SectionKey, PlanSection | null>>({
    reflection: null,
    swot: null,
    'income-planning': null,
    mindset: null,
    accountability: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPlan = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get or create business plan for the year
      const planResult = await getOrCreateBusinessPlan(year);

      if (!planResult.success || !planResult.data) {
        throw new Error(
          planResult.errors?.[0]?.message || 'Failed to load business plan'
        );
      }

      setPlan(planResult.data);

      // Load all sections for this plan
      const sectionsResult = await getPlanSections(planResult.data.id);

      if (sectionsResult.success && sectionsResult.data) {
        const sectionMap: Record<SectionKey, PlanSection | null> = {
          reflection: null,
          swot: null,
          'income-planning': null,
          mindset: null,
          accountability: null,
        };

        // Map sections by their key
        sectionsResult.data.forEach((section) => {
          const key = section.section_key as SectionKey;
          if (key in sectionMap) {
            sectionMap[key] = section;
          }
        });

        setSections(sectionMap);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('Failed to load business plan:', err);
    } finally {
      setIsLoading(false);
    }
  }, [year]);

  // Load plan on mount
  useEffect(() => {
    loadPlan();
  }, [loadPlan]);

  // Update a section's cached data after successful save
  // This prevents stale data from overwriting user changes on navigation
  const updateSectionCache = useCallback(
    (sectionKey: SectionKey, section: PlanSection) => {
      setSections((prev) => ({
        ...prev,
        [sectionKey]: section,
      }));
    },
    []
  );

  return (
    <BusinessPlanContext.Provider
      value={{
        plan,
        sections,
        isLoading,
        error,
        refetchPlan: loadPlan,
        updateSectionCache,
      }}
    >
      {children}
    </BusinessPlanContext.Provider>
  );
}

/**
 * Hook to access the business plan context
 * Must be used within a BusinessPlanProvider
 */
export function useBusinessPlan() {
  const context = useContext(BusinessPlanContext);

  if (!context) {
    throw new Error('useBusinessPlan must be used within a BusinessPlanProvider');
  }

  return context;
}
