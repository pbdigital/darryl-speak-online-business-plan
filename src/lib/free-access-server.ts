import 'server-only';

import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * When a free user's 30 days started: their `signed_up` plan event, which is
 * when Keap gets the "signed up" tag that DDS's day-30 lock is timed from.
 * Falls back to the profile's creation for anyone from before events existed.
 */
export async function freeAccessStart(
  supabase: SupabaseClient,
  userId: string,
  profileCreatedAt: string
): Promise<string> {
  const { data } = await supabase
    .from('plan_events')
    .select('created_at')
    .eq('user_id', userId)
    .eq('event_key', 'signed_up')
    .maybeSingle();
  return data?.created_at ?? profileCreatedAt;
}
