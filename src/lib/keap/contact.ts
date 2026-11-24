/**
 * Finds or creates a free-plan user's Keap contact and opts it in to
 * marketing. No imports, so node tests can load it directly.
 *
 * Keap REST v1 only moves an email to "Unconfirmed" (marketable) from
 * Unengaged Marketable, Unengaged Non-Marketable, Non-Marketable or Opt-Out:
 * Manual. Anyone who unsubscribed (List Unsubscribe, Opt-Out: System and the
 * like) stays opted out, so sending the reason never overrides an unsubscribe.
 */

/** Shown as the opt-in reason on the contact. The sign-up form tells users we'll email them. */
export const KEAP_OPT_IN_REASON =
  'Signed up for the free Online Business Plan at MyPlanForSuccess.com.';

export type KeapRequest = <T = unknown>(
  method: 'GET' | 'POST' | 'PATCH',
  path: string,
  body?: unknown
) => Promise<T>;

/**
 * Returns the ID of the contact with this email, creating it if there is
 * none. Either way the contact is opted in. A failed opt-in on an existing
 * contact is logged, not thrown, so it can't stop the tag being applied.
 */
export async function findOrCreateKeapContact(
  keapRequest: KeapRequest,
  email: string,
  name: { givenName?: string; familyName?: string }
): Promise<number> {
  const found = await keapRequest<{ contacts?: { id: number }[] }>(
    'GET',
    `/contacts?email=${encodeURIComponent(email)}&limit=1`
  );
  const existingId = found.contacts?.[0]?.id;

  if (!existingId) {
    const created = await keapRequest<{ id: number }>('POST', '/contacts', {
      email_addresses: [{ email, field: 'EMAIL1' }],
      given_name: name.givenName,
      family_name: name.familyName,
      opt_in_reason: KEAP_OPT_IN_REASON,
    });
    return created.id;
  }

  try {
    await keapRequest('PATCH', `/contacts/${existingId}?update_mask=opt_in_reason`, {
      opt_in_reason: KEAP_OPT_IN_REASON,
    });
  } catch (err) {
    console.error(
      `[keap] Could not opt in contact ${existingId}: ${err instanceof Error ? err.message : String(err)}`
    );
  }
  return existingId;
}
