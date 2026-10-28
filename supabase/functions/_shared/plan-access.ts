import type { SupabaseClient } from 'jsr:@supabase/supabase-js@2';

export interface PlanAccess {
  locked: boolean;
  account_type: 'member' | 'free' | null;
}

/**
 * Reads the signed-in user's account type and lock state from their profile.
 * Uses the user's own client, so RLS limits it to their row.
 */
export async function getPlanAccess(
  supabase: SupabaseClient,
  userId: string
): Promise<PlanAccess> {
  const { data, error } = await supabase
    .from('profiles')
    .select('account_type, locked_at')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;

  return {
    locked: !!data?.locked_at,
    account_type: data?.account_type ?? null,
  };
}
