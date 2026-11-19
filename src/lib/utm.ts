/**
 * UTM tags from an ad click, kept so a sign-up can be credited to the ad.
 *
 * The middleware stores the first set it sees in a cookie for 30 days. The
 * sign-up form copies the cookie into the new user's metadata, and the
 * signed_up Keap sync writes them to the contact. Plain functions only, so
 * they run in the middleware, the browser, the server and node tests.
 */

export const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
] as const;

export type UtmKey = (typeof UTM_KEYS)[number];
export type Utm = Partial<Record<UtmKey, string>>;

export const UTM_COOKIE = 'mps_utm';
export const UTM_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

const MAX_LENGTH = 100;

/** Picks the five UTM values, trimmed and capped, dropping empty or non-text ones. */
export function pickUtm(get: (key: UtmKey) => unknown): Utm {
  const utm: Utm = {};
  for (const key of UTM_KEYS) {
    const value = get(key);
    if (typeof value !== 'string') continue;
    const trimmed = value.trim().slice(0, MAX_LENGTH);
    if (trimmed) utm[key] = trimmed;
  }
  return utm;
}

export function hasUtm(utm: Utm): boolean {
  return Object.keys(utm).length > 0;
}

export function serializeUtm(utm: Utm): string {
  return new URLSearchParams(utm as Record<string, string>).toString();
}

export function parseUtm(value: string | null | undefined): Utm {
  if (!value) return {};
  const params = new URLSearchParams(value);
  return pickUtm((key) => params.get(key));
}

/** Reads one cookie's decoded value from a `document.cookie` style string. */
export function readCookie(cookieString: string, name: string): string | undefined {
  for (const part of cookieString.split(';')) {
    const separator = part.indexOf('=');
    if (separator === -1 || part.slice(0, separator).trim() !== name) continue;
    try {
      return decodeURIComponent(part.slice(separator + 1).trim());
    } catch {
      return undefined;
    }
  }
  return undefined;
}
