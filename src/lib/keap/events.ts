/**
 * Plan events that tag the user's contact in Keap.
 *
 * Every event is recorded once per user in `plan_events` (unique on
 * user_id + event_key). Rows are then synced to Keap: the matching tag is
 * applied, and for Section 3 and the whole plan the key numbers are written
 * to custom fields. A row stays unsynced (keap_synced_at null) until a sync
 * succeeds, and unsynced rows are retried the next time any event is
 * recorded for that user, or by retryUnsyncedPlanEvents (for a cron).
 * Server-only: uses the service role.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { CURRENT_PLAN_YEAR } from '@/lib/constants';
import { createServiceClient } from './service-client';
import { applyKeapTag, getKeapMode, setKeapPlanFields, setKeapUtmFields } from './keap-api';
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
 * fully filled plans copied forward each year. These rows are never retried.
 */
export const KEAP_SKIPPED_MEMBER = 'skipped: member';

/** Marker stored in plan_events.keap_error while Keap isn't configured. Retried later. */
export const KEAP_NOT_CONFIGURED = 'not sent: Keap not configured';

/** How many unsynced rows one user's sync retries at most. */
const USER_RETRY_LIMIT = 10;

export interface RecordPlanEventOptions {
  /**
   * Runs the Keap sync later instead of waiting for it, for example Next's
   * `after()` so the response isn't held up. Without it the sync is awaited.
   */
  defer?: (task: () => Promise<void>) => void;
}

/**
 * Records a plan event for a user, then syncs that user's unsynced events to
 * Keap (free accounts only). Never throws: Keap failures are stored on the
 * event rows and logged. `error` reports only a failure to record the event.
 */
export async function recordPlanEvent(
  userId: string,
  eventKey: PlanEventKey,
  options: RecordPlanEventOptions = {}
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
    recorded = (inserted?.length ?? 0) > 0;

    if (recorded && eventKey.startsWith('section_done:')) {
      const { count, error: countError } = await supabase
        .from('plan_events')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .in('event_key', SECTION_KEYS.map((key) => `section_done:${key}`));
      if (countError) throw new Error(`Section count failed: ${countError.message}`);

      if (count === SECTION_KEYS.length) {
        // Records plan_done; its own call schedules the sync that covers both rows.
        await recordPlanEvent(userId, 'plan_done', options);
        return { recorded };
      }
    }

    const sync = async () => {
      try {
        await syncUserEvents(supabase, userId, USER_RETRY_LIMIT);
      } catch (err) {
        console.error(`[keap] Sync failed for user ${userId}:`, err instanceof Error ? err.message : err);
      }
    };
    if (options.defer) {
      options.defer(sync);
    } else {
      await sync();
    }

    return { recorded };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[keap] recordPlanEvent ${eventKey} failed for user ${userId}: ${message}`);
    return { recorded, error: message };
  }
}

/**
 * Retries unsynced plan events across all users, oldest first, up to
 * `limit` rows. Safe to run on a schedule (for example a cron route that
 * calls it); member rows are never retried. Never throws.
 */
export async function retryUnsyncedPlanEvents(
  limit = 50
): Promise<{ attempted: number; synced: number }> {
  try {
    const supabase = createServiceClient();
    const rows = await loadUnsynced(supabase, limit);
    let synced = 0;
    for (const row of rows) {
      if (await syncEventRow(supabase, row)) synced++;
    }
    return { attempted: rows.length, synced };
  } catch (err) {
    console.error('[keap] retryUnsyncedPlanEvents failed:', err instanceof Error ? err.message : err);
    return { attempted: 0, synced: 0 };
  }
}

interface PlanEventRow {
  id: string;
  user_id: string;
  event_key: string;
}

// Syncs for one user run one after another in this process, so overlapping
// requests don't send the same tag twice at once.
const userSyncs = new Map<string, Promise<void>>();

function syncUserEvents(supabase: SupabaseClient, userId: string, limit: number): Promise<void> {
  const previous = userSyncs.get(userId) ?? Promise.resolve();
  const next = previous.then(async () => {
    const rows = await loadUnsynced(supabase, limit, userId);
    for (const row of rows) await syncEventRow(supabase, row);
  });
  const settled = next.catch(() => {}).finally(() => {
    if (userSyncs.get(userId) === settled) userSyncs.delete(userId);
  });
  userSyncs.set(userId, settled);
  return next;
}

/** Unsynced rows, oldest first, skipping members. */
async function loadUnsynced(
  supabase: SupabaseClient,
  limit: number,
  userId?: string
): Promise<PlanEventRow[]> {
  let query = supabase
    .from('plan_events')
    .select('id, user_id, event_key')
    .is('keap_synced_at', null)
    .or(`keap_error.is.null,keap_error.neq."${KEAP_SKIPPED_MEMBER}"`)
    .order('created_at', { ascending: true })
    .limit(limit);
  if (userId) query = query.eq('user_id', userId);

  const { data, error } = await query;
  if (error) throw new Error(`Unsynced lookup failed: ${error.message}`);
  return data ?? [];
}

/** Syncs one row to Keap and stores the outcome. Returns true when synced. */
async function syncEventRow(supabase: SupabaseClient, row: PlanEventRow): Promise<boolean> {
  const keapError = await syncToKeap(supabase, row.user_id, row.event_key);
  if (keapError && keapError !== KEAP_SKIPPED_MEMBER && keapError !== KEAP_NOT_CONFIGURED) {
    console.error(`[keap] Sync for ${row.event_key} failed for user ${row.user_id}: ${keapError}`);
  }

  const { error } = await supabase
    .from('plan_events')
    .update(
      keapError
        ? { keap_error: keapError }
        : { keap_synced_at: new Date().toISOString(), keap_error: null }
    )
    .eq('id', row.id);
  if (error) {
    console.error(`[keap] Could not store sync result for event ${row.id}: ${error.message}`);
  }
  return !keapError;
}

/** Tags the contact and, when relevant, writes plan numbers. Returns an error message or null. */
async function syncToKeap(
  supabase: SupabaseClient,
  userId: string,
  eventKey: string
): Promise<string | null> {
  try {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('account_type')
      .eq('id', userId)
      .single();
    if (profileError) return `Profile lookup failed: ${profileError.message}`;
    if (profile.account_type === 'member') return KEAP_SKIPPED_MEMBER;
    if (getKeapMode() === 'unconfigured') return KEAP_NOT_CONFIGURED;

    const errors = [await applyKeapTag(supabase, userId, eventKey)];

    if (eventKey === 'signed_up') {
      // Logged only, so a bad utm field can't keep the sign-up tag retrying.
      const utmError = await setKeapUtmFields(supabase, userId);
      if (utmError) console.error(`[keap] UTM fields not written for user ${userId}: ${utmError}`);
    }

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
  } catch (err) {
    return err instanceof Error ? err.message : String(err);
  }
}
