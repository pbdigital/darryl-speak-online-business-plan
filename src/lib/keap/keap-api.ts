import type { SupabaseClient } from '@supabase/supabase-js';
import type { PlanNumbers } from './plan-data';

/**
 * Applies Keap tags to a user's contact.
 *
 * KEAP_MODE=fake (the default when KEAP_API_KEY is empty) logs what it would
 * send and calls nothing. KEAP_MODE=live calls Keap's REST API with a Service
 * Account Key. Tag and custom field IDs come from env variables, see
 * docs/keap-tags.md.
 */

const KEAP_API_BASE = 'https://api.infusionsoft.com/crm/rest/v1';
const KEAP_TIMEOUT_MS = 10_000;

export type KeapMode = 'fake' | 'live';

export function getKeapMode(): KeapMode {
  const mode = process.env.KEAP_MODE;
  if (mode === 'fake' || mode === 'live') return mode;
  return process.env.KEAP_API_KEY ? 'live' : 'fake';
}

/** Env variable holding the tag ID for an event, e.g. section_done:swot -> KEAP_TAG_SECTION_DONE_SWOT. */
export function tagEnvName(eventKey: string): string {
  return `KEAP_TAG_${eventKey.toUpperCase().replace(/[^A-Z0-9]+/g, '_')}`;
}

/**
 * Applies the event's tag to the user's Keap contact, finding or creating the
 * contact first. Returns null on success or an error message. Never throws.
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
        `find or create the contact by email, then POST /contacts/{id}/tags {"tagIds":[${tagId || ''}]}`
    );
    return null;
  }

  if (!process.env.KEAP_API_KEY) {
    return 'KEAP_MODE is live but KEAP_API_KEY is not set';
  }
  if (!tagId || !/^\d+$/.test(tagId)) {
    return `No Keap tag ID set in ${envName}`;
  }

  try {
    const contactId = await findOrCreateContact(supabase, userId);
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
 * env variable isn't set are skipped; with none set this does nothing.
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

  if (!process.env.KEAP_API_KEY) {
    return 'KEAP_MODE is live but KEAP_API_KEY is not set';
  }

  try {
    const contactId = await findOrCreateContact(supabase, userId);
    await keapRequest('PATCH', `/contacts/${contactId}?update_mask=custom_fields`, {
      custom_fields: customFields,
    });
    return null;
  } catch (err) {
    return err instanceof Error ? err.message : String(err);
  }
}

/**
 * Returns the user's Keap contact ID: the stored one, an existing contact
 * with the same email, or a new contact. Stores the ID on the profile.
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

  const found = await keapRequest<{ contacts?: { id: number }[] }>(
    'GET',
    `/contacts?email=${encodeURIComponent(email)}&limit=1`
  );
  let contactId = found.contacts?.[0]?.id;

  if (!contactId) {
    const created = await keapRequest<{ id: number }>('POST', '/contacts', {
      email_addresses: [{ email, field: 'EMAIL1' }],
      given_name: profile.first_name ?? undefined,
      family_name: profile.last_name ?? undefined,
    });
    contactId = created.id;
  }

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ keap_contact_id: String(contactId) })
    .eq('id', userId);
  if (updateError) {
    console.error(`[keap] Could not store contact ${contactId} for user ${userId}:`, updateError.message);
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
