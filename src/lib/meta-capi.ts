/**
 * Meta Conversions API: tells Meta about a confirmed sign-up from the server.
 *
 * The browser pixel sends CompleteRegistration with the same event_id when
 * the "Check your email" screen shows, so Meta counts the pair once. Does
 * nothing unless META_CAPI_TOKEN and NEXT_PUBLIC_META_PIXEL_ID are set.
 * Only the hashed email and browser identifiers are sent, never plan content.
 * Server-only.
 */

import { createHash } from 'node:crypto';

const GRAPH_URL = 'https://graph.facebook.com/v21.0';
const TIMEOUT_MS = 10_000;

export interface RegistrationEvent {
  email: string;
  eventId: string;
  eventTime: Date;
  eventSourceUrl: string;
  clientUserAgent?: string;
  clientIpAddress?: string;
  fbp?: string;
  fbc?: string;
}

/** SHA-256 of the trimmed, lower-cased email, as Meta's customer information rules ask. */
export function hashEmail(email: string): string {
  return createHash('sha256').update(email.trim().toLowerCase()).digest('hex');
}

export function buildRegistrationPayload(event: RegistrationEvent, testEventCode?: string) {
  return {
    data: [
      {
        event_name: 'CompleteRegistration',
        event_time: Math.floor(event.eventTime.getTime() / 1000),
        event_id: event.eventId,
        action_source: 'website',
        event_source_url: event.eventSourceUrl,
        user_data: {
          em: [hashEmail(event.email)],
          ...(event.clientUserAgent && { client_user_agent: event.clientUserAgent }),
          ...(event.clientIpAddress && { client_ip_address: event.clientIpAddress }),
          ...(event.fbp && { fbp: event.fbp }),
          ...(event.fbc && { fbc: event.fbc }),
        },
      },
    ],
    ...(testEventCode && { test_event_code: testEventCode }),
  };
}

/** Sends the event. Never throws: failures are logged without the email. */
export async function sendRegistrationEvent(event: RegistrationEvent): Promise<void> {
  const token = process.env.META_CAPI_TOKEN;
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  if (!token || !pixelId || !/^\d+$/.test(pixelId)) return;

  try {
    const response = await fetch(`${GRAPH_URL}/${pixelId}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...buildRegistrationPayload(event, process.env.META_CAPI_TEST_EVENT_CODE || undefined),
        access_token: token,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) {
      const text = await response.text();
      console.error(`[meta] CompleteRegistration ${event.eventId} returned ${response.status}: ${text.slice(0, 300)}`);
    }
  } catch (err) {
    console.error(`[meta] CompleteRegistration ${event.eventId} failed:`, err instanceof Error ? err.message : err);
  }
}
