/**
 * Browser side of the Meta pixel. The base code is only loaded on the
 * production site (see MetaPixel), so everywhere else these do nothing.
 */

import { readCookie } from './utm';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/** A fresh event_id. randomUUID is missing outside secure pages, so fall back. */
export function newMetaEventId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/** Sends a pixel event with an event_id the server event can be matched to. */
export function trackMetaEvent(eventName: string, eventId: string): void {
  try {
    window.fbq?.('track', eventName, {}, { eventID: eventId });
  } catch {
    // Tracking must never break the page.
  }
}

/** Meta's browser and click IDs, stored at sign-up for the server event. */
export function readMetaBrowserIds(cookieString: string): { fbp?: string; fbc?: string } {
  const fbp = readCookie(cookieString, '_fbp');
  const fbc = readCookie(cookieString, '_fbc');
  return { ...(fbp && { fbp }), ...(fbc && { fbc }) };
}
