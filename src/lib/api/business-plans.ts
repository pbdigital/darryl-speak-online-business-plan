/**
 * Business Plans API
 * Client-side methods for interacting with business plan Edge Functions
 */
import { apiRequest, ApiResponse } from './client';

export interface BusinessPlan {
  id: string;
  user_id: string;
  year: number;
  created_at: string;
  updated_at: string;
}

export interface BusinessPlanWithSections extends BusinessPlan {
  plan_sections: Array<{
    id: string;
    business_plan_id: string;
    section_key: string;
    data: Record<string, unknown>;
    updated_at: string;
  }>;
}

/**
 * Get all business plans for the current user
 */
export async function getBusinessPlans(): Promise<ApiResponse<BusinessPlan[]>> {
  return apiRequest<BusinessPlan[]>('/business-plans');
}

/**
 * Get a single business plan with all its sections
 */
export async function getBusinessPlan(
  id: string
): Promise<ApiResponse<BusinessPlanWithSections>> {
  return apiRequest<BusinessPlanWithSections>(`/business-plans?id=${id}`);
}

/**
 * Create a new business plan for a specific year
 */
export async function createBusinessPlan(
  year: number
): Promise<ApiResponse<BusinessPlan>> {
  return apiRequest<BusinessPlan>('/business-plans', {
    method: 'POST',
    body: JSON.stringify({ year }),
  });
}

/**
 * Delete a business plan
 */
export async function deleteBusinessPlan(
  id: string
): Promise<ApiResponse<{ deleted: boolean }>> {
  return apiRequest<{ deleted: boolean }>(`/business-plans?id=${id}`, {
    method: 'DELETE',
  });
}

/**
 * Get or create a business plan for a specific year
 * Returns existing plan if one exists, otherwise creates a new one
 */
export async function getOrCreateBusinessPlan(
  year: number
): Promise<ApiResponse<BusinessPlan>> {
  // First, try to get existing plans
  const plansResult = await getBusinessPlans();

  if (plansResult.success && plansResult.data) {
    const existingPlan = plansResult.data.find((p) => p.year === year);
    if (existingPlan) {
      return { success: true, data: existingPlan };
    }
  }

  // No existing plan, create a new one
  return createBusinessPlan(year);
}
