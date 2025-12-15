/**
 * API client for Supabase Edge Functions
 * Handles authentication and standard response envelope
 */
import { createClient } from '@/lib/supabase/client';

const FUNCTIONS_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1`;

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  errors?: Array<{ field?: string; message: string }>;
  meta?: { timestamp: string };
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

  // Handle non-JSON error responses from Supabase infrastructure
  if (!json.success && !json.errors) {
    return {
      success: false,
      errors: [{ message: json.message || 'Request failed' }],
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
