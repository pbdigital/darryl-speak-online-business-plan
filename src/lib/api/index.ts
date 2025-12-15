/**
 * API module exports
 * Import from '@/lib/api' for convenience
 */
export { apiRequest, isAuthenticated } from './client';
export type { ApiResponse } from './client';

export {
  getBusinessPlans,
  getBusinessPlan,
  createBusinessPlan,
  deleteBusinessPlan,
  getOrCreateBusinessPlan,
} from './business-plans';
export type { BusinessPlan, BusinessPlanWithSections } from './business-plans';

export { getPlanSections, savePlanSection } from './plan-sections';
export type { PlanSection, SectionKey } from './plan-sections';
