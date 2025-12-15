/**
 * Plan Sections API
 * Client-side methods for saving and loading section data
 */
import { apiRequest, ApiResponse } from './client';

export interface PlanSection {
  id: string;
  business_plan_id: string;
  section_key: string;
  data: Record<string, unknown>;
  updated_at: string;
}

/**
 * Valid section keys matching the 5 business plan sections
 */
export type SectionKey =
  | 'reflection'
  | 'swot'
  | 'income-planning'
  | 'mindset'
  | 'accountability';

/**
 * Get all sections for a business plan
 */
export async function getPlanSections(
  planId: string
): Promise<ApiResponse<PlanSection[]>> {
  return apiRequest<PlanSection[]>(`/plan-sections?planId=${planId}`);
}

/**
 * Save (upsert) section data
 * This is the main auto-save endpoint
 */
export async function savePlanSection(
  planId: string,
  sectionKey: SectionKey,
  data: Record<string, unknown>
): Promise<ApiResponse<PlanSection>> {
  return apiRequest<PlanSection>('/plan-sections', {
    method: 'PUT',
    body: JSON.stringify({ planId, sectionKey, data }),
  });
}
