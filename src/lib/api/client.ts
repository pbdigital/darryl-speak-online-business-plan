/**
 * API client for Supabase Edge Functions
 * Handles authentication and standard response envelope
 */
import { createClient } from '@/lib/supabase/client';

const FUNCTIONS_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1`;

export interface PlanAccess {
  locked: boolean;
  account_type: 'member' | 'free' | null;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  view: string;
  data: T | null;
  /** 'PLAN_LOCKED' when a write was refused because the plan is locked */
  error?: string;
  errors: Array<{ field?: string; message: string }>;
  /** Plan GET responses include the user's lock state as `account` */
  meta: { timestamp: string; account?: PlanAccess };
}

/** Window event fired when the server refuses a write because the plan is locked */
export const PLAN_LOCKED_EVENT = 'plan-locked';

export function isPlanLocked(response: ApiResponse<unknown>): boolean {
  return response.error === 'PLAN_LOCKED';
}

/**
 * Get authorization headers with current session token
 */
async function getAuthHeaders(): Promise<Record<string, string>> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error('Not authenticated');
  }

  return {
    Authorization: `Bearer ${session.access_token}`,
    'Content-Type': 'application/json',
  };
}

/**
 * Make an authenticated request to a Supabase Edge Function
 */
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${FUNCTIONS_URL}${endpoint}`, {
    ...options,
    headers: { ...headers, ...options.headers },
  });

  const json = await response.json();

  if (
    response.status === 423 &&
    json.error === 'PLAN_LOCKED' &&
    typeof window !== 'undefined'
  ) {
    window.dispatchEvent(new Event(PLAN_LOCKED_EVENT));
  }

  // Handle non-JSON error responses from Supabase infrastructure
  if (!json.success && !json.errors) {
    return {
      success: false,
      view: 'unknown',
      data: null,
      errors: [{ message: json.message || 'Request failed' }],
      meta: { timestamp: new Date().toISOString() },
    };
  }

  return json;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return !!session?.access_token;
  } catch {
    return false;
  }
}
