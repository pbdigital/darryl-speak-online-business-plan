import 'server-only';

import { createClient } from '@/lib/supabase/server';
import type { AdminUser } from '@/types/admin';

interface UserPlanSection {
  id: string;
  section_key: string;
  data: Record<string, unknown>;
  updated_at: string;
}

interface EdgeResponse<T> {
  success: boolean;
  view: string;
  data: T | null;
  errors: Array<{ field?: string; message: string }>;
  meta: { timestamp: string };
}

interface AdminUsersListData {
  users: AdminUser[];
}

interface AdminUserDetailData {
  user: AdminUser;
  planSections?: UserPlanSection[];
}

async function requestAdminUsers<T>(query = ''): Promise<T> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    throw new Error('Supabase is not configured');
  }

  const supabase = await createClient();
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.access_token) {
    throw new Error('An authenticated admin session is required');
  }

  const response = await fetch(
    `${supabaseUrl}/functions/v1/admin-users${query}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        apikey: anonKey,
        Accept: 'application/json',
      },
      cache: 'no-store',
    }
  );
  const responseText = await response.text();
  let payload: EdgeResponse<T>;

  try {
    payload = JSON.parse(responseText) as EdgeResponse<T>;
  } catch {
    throw new Error('Admin users endpoint returned invalid JSON');
  }

  if (
    typeof payload.success !== 'boolean' ||
    typeof payload.view !== 'string' ||
    !Array.isArray(payload.errors) ||
    !payload.meta?.timestamp
  ) {
    throw new Error('Admin users endpoint returned an invalid response');
  }

  if (!response.ok || !payload.success || payload.data === null) {
    throw new Error(payload.errors[0]?.message ?? 'Admin users request failed');
  }

  return payload.data;
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  const data = await requestAdminUsers<AdminUsersListData>();
  return data.users;
}

export async function getAdminUser(
  userId: string,
  includePlanSections = false
): Promise<AdminUserDetailData> {
  const params = new URLSearchParams({ id: userId });
  if (includePlanSections) params.set('include', 'plan-sections');
  return requestAdminUsers<AdminUserDetailData>(`?${params.toString()}`);
}
