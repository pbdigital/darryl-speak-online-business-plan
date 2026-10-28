/**
 * Keap campaign "HTTP Post" webhooks that lock and unlock a free user's plan.
 *
 * Keap posts form-encoded contact fields (JSON is accepted too). The shared
 * secret KEAP_WEBHOOK_SECRET may arrive as a `secret` field, a `key` query
 * parameter or an `X-Webhook-Secret` header. Unknown contacts and members
 * return 200 so Keap's campaign doesn't retry or error.
 */
import { createHash, timingSafeEqual } from 'node:crypto';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export type KeapLockAction = 'lock' | 'unlock';

const EMAIL_FIELDS = ['email', 'email1', 'emailaddress1', 'contact.email'];
const CONTACT_ID_FIELDS = ['contactid', 'contact_id', 'id', 'contact.id'];

function json(body: Record<string, unknown>, status = 200): Response {
  return Response.json(body, { status });
}

function secretsMatch(given: string, expected: string): boolean {
  // Hashing first gives equal-length buffers, so the comparison is constant time.
  const a = createHash('sha256').update(given).digest();
  const b = createHash('sha256').update(expected).digest();
  return timingSafeEqual(a, b);
}

/** Reads the body as form fields or JSON, with lower-cased keys. */
async function readFields(request: Request): Promise<Map<string, string>> {
  const fields = new Map<string, string>();
  const text = await request.text();
  if (!text) return fields;

  const contentType = request.headers.get('content-type') ?? '';
  let entries: Array<[string, unknown]>;

  if (contentType.includes('application/json') || text.trimStart().startsWith('{')) {
    try {
      const parsed = JSON.parse(text);
      entries = parsed && typeof parsed === 'object' ? Object.entries(parsed) : [];
    } catch {
      entries = [];
    }
  } else {
    entries = Array.from(new URLSearchParams(text).entries());
  }

  for (const [key, value] of entries) {
    if (typeof value === 'string' || typeof value === 'number') {
      fields.set(key.toLowerCase(), String(value).trim());
    }
  }

  return fields;
}

function firstField(fields: Map<string, string>, names: string[]): string {
  for (const name of names) {
    const value = fields.get(name);
    if (value) return value;
  }
  return '';
}

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  return `${local.slice(0, 1)}***@${domain ?? ''}`;
}

async function findUserByEmail(
  supabase: SupabaseClient,
  email: string
): Promise<{ id: string } | null> {
  const { data, error } = await supabase.rpc('get_auth_user_id_by_email', {
    p_email: email,
  });
  if (error) throw error;
  return data ? { id: data as string } : null;
}

export async function handleKeapLockWebhook(
  request: Request,
  action: KeapLockAction
): Promise<Response> {
  const expectedSecret = process.env.KEAP_WEBHOOK_SECRET;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!expectedSecret || !supabaseUrl || !serviceRoleKey) {
    console.error(`[keap ${action}] Webhook is not configured`);
    return json({ error: 'Not configured' }, 500);
  }

  const fields = await readFields(request);
  const givenSecret =
    request.headers.get('x-webhook-secret') ??
    new URL(request.url).searchParams.get('key') ??
    fields.get('secret') ??
    '';

  if (!givenSecret || !secretsMatch(givenSecret, expectedSecret)) {
    return json({ error: 'Unauthorized' }, 401);
  }

  const email = firstField(fields, EMAIL_FIELDS);
  const contactId = firstField(fields, CONTACT_ID_FIELDS);

  if (!email) {
    console.warn(`[keap ${action}] No email in request (contact ${contactId || 'unknown'})`);
    return json({ result: 'not_found', reason: 'no_email' });
  }

  try {
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const user = await findUserByEmail(supabase, email);
    const { data: profile, error: profileError } = user
      ? await supabase
          .from('profiles')
          .select('id, account_type, locked_at, keap_contact_id')
          .eq('id', user.id)
          .maybeSingle()
      : { data: null, error: null };

    if (profileError) throw profileError;

    if (!profile) {
      console.warn(`[keap ${action}] No user for ${maskEmail(email)} (contact ${contactId || 'unknown'})`);
      return json({ result: 'not_found' });
    }

    if (contactId && !profile.keap_contact_id) {
      const { error } = await supabase
        .from('profiles')
        .update({ keap_contact_id: contactId })
        .eq('id', profile.id);
      if (error) throw error;
    }

    let result: string;

    if (action === 'lock') {
      if (profile.account_type !== 'free') {
        result = 'skipped';
      } else if (profile.locked_at) {
        result = 'already_locked';
      } else {
        const { error } = await supabase
          .from('profiles')
          .update({ locked_at: new Date().toISOString(), lock_source: 'keap' })
          .eq('id', profile.id)
          .is('locked_at', null);
        if (error) throw error;
        result = 'locked';
      }
    } else if (!profile.locked_at) {
      result = 'already_unlocked';
    } else {
      const { error } = await supabase
        .from('profiles')
        .update({ locked_at: null, lock_source: null })
        .eq('id', profile.id);
      if (error) throw error;
      result = 'unlocked';
    }

    console.info(`[keap ${action}] ${result} for user ${profile.id}`);
    return json(result === 'skipped' ? { result, reason: 'member' } : { result });
  } catch (err) {
    console.error(`[keap ${action}] Failed:`, err instanceof Error ? err.message : err);
    return json({ error: 'Server error' }, 500);
  }
}
