/**
 * Plan events that tag the user's contact in Keap.
 *
 * Every event is recorded once per user in `plan_events` (unique on
 * user_id + event_key). The first time an event is recorded, the matching
 * Keap tag is applied. Server-only: uses the service role.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { CURRENT_PLAN_YEAR } from '@/lib/constants';
import { createServiceClient } from './service-client';
import { applyKeapTag, setKeapPlanFields } from './keap-api';
import { calculatePlanNumbers } from './plan-data';

export const SECTION_KEYS = [
  'reflection',
  'swot',
  'income-planning',
  'mindset',
  'accountability',
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

export type PlanEventKey =
  | 'signed_up'
  | `section_done:${SectionKey}`
  | 'plan_done'
  | 'printed';

export interface RecordPlanEventResult {
  recorded: boolean; // false when the event already existed
  error?: string;
}

/**
 * Marker stored in plan_events.keap_error for POWER AGENT members. Members are
 * never tagged: DDS's free-plan nudges hang off these tags, and members get
 * fully filled plans copied forward each year.
 */
export const KEAP_SKIPPED_MEMBER = 'skipped: member';

/**
 * Records a plan event for a user and applies its Keap tag the first time
 * (free accounts only). When Section 3 or the whole plan is done, also writes
 * the plan's key numbers to Keap custom fields.
 * Never throws: Keap failures are stored on the event row and logged.
 */
export async function recordPlanEvent(
  userId: string,
  eventKey: PlanEventKey
): Promise<RecordPlanEventResult> {
  let recorded = false;

  try {
    const supabase = createServiceClient();

    const { data: inserted, error: insertError } = await supabase
      .from('plan_events')
      .upsert(
        { user_id: userId, event_key: eventKey },
        { onConflict: 'user_id,event_key', ignoreDuplicates: true }
      )
      .select('id');

    if (insertError) throw new Error(`Insert failed: ${insertError.message}`);
    if (!inserted || inserted.length === 0) return { recorded: false };
    recorded = true;

    const keapError = await syncToKeap(supabase, userId, eventKey);
    if (keapError && keapError !== KEAP_SKIPPED_MEMBER) {
      console.error(`[keap] Sync for ${eventKey} failed for user ${userId}: ${keapError}`);
    }

    const { error: updateError } = await supabase
      .from('plan_events')
      .update(
        keapError
          ? { keap_error: keapError }
          : { keap_synced_at: new Date().toISOString(), keap_error: null }
      )
      .eq('id', inserted[0].id);
    if (updateError) throw new Error(`Sync status update failed: ${updateError.message}`);

    if (eventKey.startsWith('section_done:')) {
      const { count, error: countError } = await supabase
        .from('plan_events')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .in('event_key', SECTION_KEYS.map((key) => `section_done:${key}`));
      if (countError) throw new Error(`Section count failed: ${countError.message}`);

      if (count === SECTION_KEYS.length) {
        await recordPlanEvent(userId, 'plan_done');
      }
    }

    return keapError && keapError !== KEAP_SKIPPED_MEMBER ? { recorded, error: keapError } : { recorded };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[keap] recordPlanEvent ${eventKey} failed for user ${userId}: ${message}`);
    return { recorded, error: message };
  }
}

/** Tags the contact and, when relevant, writes plan numbers. Returns an error message or null. */
async function syncToKeap(
  supabase: SupabaseClient,
  userId: string,
  eventKey: PlanEventKey
): Promise<string | null> {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('account_type')
    .eq('id', userId)
    .single();
  if (profileError) return `Profile lookup failed: ${profileError.message}`;
  if (profile.account_type === 'member') return KEAP_SKIPPED_MEMBER;

  const errors = [await applyKeapTag(supabase, userId, eventKey)];

  if (eventKey === 'section_done:income-planning' || eventKey === 'plan_done') {
    const { data: section, error: sectionError } = await supabase
      .from('plan_sections')
      .select('data, business_plans!inner(user_id, year)')
      .eq('section_key', 'income-planning')
      .eq('business_plans.user_id', userId)
      .eq('business_plans.year', CURRENT_PLAN_YEAR)
      .maybeSingle();

    if (sectionError) {
      errors.push(`Plan numbers lookup failed: ${sectionError.message}`);
    } else if (section) {
      const numbers = calculatePlanNumbers(section.data ?? {});
      errors.push(
        await setKeapPlanFields(supabase, userId, { ...numbers, planYear: CURRENT_PLAN_YEAR })
      );
    }
  }

  return errors.filter(Boolean).join('; ') || null;
}
