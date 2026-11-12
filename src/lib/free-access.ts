/**
 * Free online access dates. Kept free of imports so it runs in the browser,
 * on the server and under `node --test`.
 *
 * Free access runs for FREE_ACCESS_DAYS from sign-up. DDS's Keap campaign
 * locks the plan on day 30, timed from the same sign-up, so the app's
 * countdown and Keap's lock line up.
 */

export const FREE_ACCESS_DAYS = 30;

/** The countdown pop-up shows on each of the last this-many days. */
export const COUNTDOWN_DAYS = 7;

const DAY_MS = 24 * 60 * 60 * 1000;

export function freeAccessEndsAt(signedUpAt: string | Date): Date {
  return new Date(new Date(signedUpAt).getTime() + FREE_ACCESS_DAYS * DAY_MS);
}

/**
 * Whole days of free access left, counting today: 7 on the first countdown
 * day, 1 on the last day, 0 once access has ended.
 */
export function freeDaysLeft(signedUpAt: string | Date, now: Date = new Date()): number {
  const msLeft = freeAccessEndsAt(signedUpAt).getTime() - now.getTime();
  if (msLeft <= 0) return 0;
  return Math.ceil(msLeft / DAY_MS);
}

/** True on each of the last COUNTDOWN_DAYS days of free access. */
export function inCountdown(signedUpAt: string | Date, now: Date = new Date()): boolean {
  const left = freeDaysLeft(signedUpAt, now);
  return left >= 1 && left <= COUNTDOWN_DAYS;
}

/**
 * The browser key that records the pop-up was seen. One per user per
 * countdown day, so it shows once a day however often they come back.
 */
export function countdownSeenKey(userId: string, daysLeft: number, signedUpAt: string): string {
  return `myplanforsuccess:countdown-seen:${userId}:${signedUpAt.slice(0, 10)}:${daysLeft}`;
}
