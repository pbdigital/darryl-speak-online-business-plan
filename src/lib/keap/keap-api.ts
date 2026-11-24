import type { SupabaseClient } from '@supabase/supabase-js';
import type { PlanNumbers } from './plan-data';
import { pickUtm, UTM_KEYS, type UtmKey } from '@/lib/utm';
import { findOrCreateKeapContact } from './contact';

/**
 * Applies Keap tags and plan fields to a user's contact.
 *
 * Modes:
 * - KEAP_MODE=fake: logs what it would send, calls nothing, and counts as
 *   synced. For local testing only.
 * - KEAP_MODE=live, or KEAP_MODE unset with KEAP_API_KEY set: calls Keap's
 *   REST v1 API with a Service Account Key in the X-Keap-API-Key header.
 * - Anything else (no key): "unconfigured". Nothing is sent and the event
 *   stays unsynced so it is retried once the key exists.
 * Tag and custom field IDs come from env variables, see docs/keap-tags.md.
 */

const KEAP_API_BASE = 'https://api.infusionsoft.com/crm/rest/v1';
const KEAP_TIMEOUT_MS = 10_000;

export type KeapMode = 'fake' | 'live' | 'unconfigured';

let warnedUnconfigured = false;

export function getKeapMode(): KeapMode {
  if (process.env.KEAP_MODE === 'fake') return 'fake';
  if (process.env.KEAP_API_KEY) return 'live';

  if (process.env.NODE_ENV === 'production' && !warnedUnconfigured) {
    warnedUnconfigured = true;
    console.warn('[keap] KEAP_API_KEY is not set: plan events are recorded but not sent to Keap.');
  }
  return 'unconfigured';
}

/** Env variable holding the tag ID for an event, e.g. section_done:swot -> KEAP_TAG_SECTION_DONE_SWOT. */
export function tagEnvName(eventKey: string): string {
  return `KEAP_TAG_${eventKey.toUpperCase().replace(/[^A-Z0-9]+/g, '_')}`;
}

/**
 * Applies the event's tag to the user's Keap contact, finding or creating the
 * contact first. Call only in fake or live mode.
 * Returns null on success or an error message. Never throws.
 */
export async function applyKeapTag(
  supabase: SupabaseClient,
  userId: string,
  eventKey: string
): Promise<string | null> {
  const envName = tagEnvName(eventKey);
  const tagId = process.env[envName];

  if (getKeapMode() === 'fake') {
    console.info(
      `[keap:fake] Would apply tag ${tagId || `(${envName} not set)`} for ${eventKey} to user ${userId}: ` +
        `find or create the contact by email and opt it in, then POST /contacts/{id}/tags {"tagIds":[${tagId || ''}]}`
    );
    return null;
  }

  if (!tagId || !/^\d+$/.test(tagId)) {
    return `No Keap tag ID set in ${envName}`;
  }

  try {
    const contactId = await getContactId(supabase, userId);
    await keapRequest('POST', `/contacts/${contactId}/tags`, {
      tagIds: [Number(tagId)],
    });
    return null;
  } catch (err) {
    return err instanceof Error ? err.message : String(err);
  }
}

/** Env variables holding the Keap custom field ID for each plan number. */
const PLAN_FIELD_ENV: Record<keyof PlanNumbers | 'planYear', string> = {
  gciGoal: 'KEAP_FIELD_GCI_GOAL',
  transactionsGoal: 'KEAP_FIELD_TRANSACTIONS_GOAL',
  conversationsPerWeek: 'KEAP_FIELD_CONVERSATIONS_PER_WEEK',
  planYear: 'KEAP_FIELD_PLAN_YEAR',
};

/**
 * Writes the plan's key numbers to the contact's custom fields. Fields whose
 * env variable isn't set are skipped; with none set this does nothing. Call
 * only in fake or live mode.
 * Returns null on success or an error message. Never throws.
 */
export async function setKeapPlanFields(
  supabase: SupabaseClient,
  userId: string,
  values: PlanNumbers & { planYear: number }
): Promise<string | null> {
  const customFields = (Object.keys(PLAN_FIELD_ENV) as (keyof typeof PLAN_FIELD_ENV)[])
    .map((name) => ({ id: Number(process.env[PLAN_FIELD_ENV[name]]), content: values[name] }))
    .filter((field) => Number.isInteger(field.id) && field.id > 0);

  if (customFields.length === 0) return null;

  if (getKeapMode() === 'fake') {
    console.info(
      `[keap:fake] Would set plan fields for user ${userId}: ` +
        `PATCH /contacts/{id} ${JSON.stringify({ custom_fields: customFields })}`
    );
    return null;
  }

  try {
    const contactId = await getContactId(supabase, userId);
    await keapRequest('PATCH', `/contacts/${contactId}?update_mask=custom_fields`, {
      custom_fields: customFields,
    });
    return null;
  } catch (err) {
    return err instanceof Error ? err.message : String(err);
  }
}

/**
 * DDS's Keap custom fields for the utm tags. These IDs are the ones AccessAlly
 * lists for the fields; Keap's REST v1 API is expected to use the same IDs,
 * but the first live write is what proves it. Change them here if not.
 */
export const KEAP_UTM_FIELD_IDS: Record<UtmKey, number> = {
  utm_source: 246,
  utm_term: 302,
  utm_medium: 312,
  utm_campaign: 314,
  utm_content: 316,
};

/**
 * Writes the utm tags saved at sign-up to the contact's custom fields,
 * replacing any older values. Does nothing when the sign-up had none. Call
 * only in fake or live mode.
 * Returns null on success or an error message. Never throws.
 */
export async function setKeapUtmFields(
  supabase: SupabaseClient,
  userId: string
): Promise<string | null> {
  try {
    const { data, error } = await supabase.auth.admin.getUserById(userId);
    if (error) return `User lookup failed: ${error.message}`;

    const metadata: Record<string, unknown> = data.user?.user_metadata ?? {};
    const utm = pickUtm((key) => metadata[key]);
    const customFields = UTM_KEYS.filter((key) => utm[key]).map((key) => ({
      id: KEAP_UTM_FIELD_IDS[key],
      content: utm[key],
    }));
    if (customFields.length === 0) return null;

    if (getKeapMode() === 'fake') {
      console.info(
        `[keap:fake] Would set utm fields for user ${userId}: ` +
          `PATCH /contacts/{id} ${JSON.stringify({ custom_fields: customFields })}`
      );
      return null;
    }

    const contactId = await getContactId(supabase, userId);
    await keapRequest('PATCH', `/contacts/${contactId}?update_mask=custom_fields`, {
      custom_fields: customFields,
    });
    return null;
  } catch (err) {
    return err instanceof Error ? err.message : String(err);
  }
}

// One contact lookup at a time per user in this process, so two events for
// the same user can't both create a Keap contact.
const contactLookups = new Map<string, Promise<number>>();

function getContactId(supabase: SupabaseClient, userId: string): Promise<number> {
  const running = contactLookups.get(userId);
  if (running) return running;

  const lookup = findOrCreateContact(supabase, userId).finally(() => contactLookups.delete(userId));
  contactLookups.set(userId, lookup);
  return lookup;
}

/**
 * Returns the user's Keap contact ID: the stored one, an existing contact
 * with the same email, or a new contact. A found or new contact is opted in
 * to marketing. Stores the ID on the profile only if
 * none is stored yet; if another process stored one first, that one wins.
 */
async function findOrCreateContact(
  supabase: SupabaseClient,
  userId: string
): Promise<number> {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('first_name, last_name, keap_contact_id')
    .eq('id', userId)
    .single();

  if (profileError) throw new Error(`Profile lookup failed: ${profileError.message}`);
  if (profile.keap_contact_id) return Number(profile.keap_contact_id);

  const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId);
  const email = userData?.user?.email;
  if (userError || !email) {
    throw new Error(`No email found for user: ${userError?.message ?? 'email missing'}`);
  }

  const contactId = await findOrCreateKeapContact(keapRequest, email, {
    givenName: profile.first_name ?? undefined,
    familyName: profile.last_name ?? undefined,
  });

  const { data: stored, error: updateError } = await supabase
    .from('profiles')
    .update({ keap_contact_id: String(contactId) })
    .eq('id', userId)
    .is('keap_contact_id', null)
    .select('keap_contact_id');
  if (updateError) {
    console.error(`[keap] Could not store contact ${contactId} for user ${userId}:`, updateError.message);
    return contactId;
  }

  if (!stored || stored.length === 0) {
    // Another process stored a contact first: use that one.
    const { data: current } = await supabase
      .from('profiles')
      .select('keap_contact_id')
      .eq('id', userId)
      .single();
    if (current?.keap_contact_id && Number(current.keap_contact_id) !== contactId) {
      console.warn(
        `[keap] User ${userId} already has contact ${current.keap_contact_id}; contact ${contactId} may be a duplicate.`
      );
      return Number(current.keap_contact_id);
    }
  }

  return contactId;
}

async function keapRequest<T = unknown>(
  method: 'GET' | 'POST' | 'PATCH',
  path: string,
  body?: unknown
): Promise<T> {
  const response = await fetch(`${KEAP_API_BASE}${path}`, {
    method,
    headers: {
      'X-Keap-API-Key': process.env.KEAP_API_KEY ?? '',
      Accept: 'application/json',
      ...(body !== undefined && { 'Content-Type': 'application/json' }),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(KEAP_TIMEOUT_MS),
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Keap ${method} ${path.split('?')[0]} returned ${response.status}: ${text.slice(0, 300)}`);
  }
  return (text ? JSON.parse(text) : {}) as T;
}
