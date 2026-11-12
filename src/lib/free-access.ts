/**
 * Free online access dates. Kept free of imports so it runs in the browser,
 * on the server and under `node --test`.
 *
 * Free access runs for FREE_ACCESS_DAYS from sign-up (the `signed_up` plan
 * event, which is when the Keap "signed up" tag is applied, so the countdown
 * lines up with DDS's day-30 lock in Keap).
 *
 * Days are counted in calendar days in the viewer's own time zone, so "today"
 * and "once a day" mean what a person expects.
 */

export const FREE_ACCESS_DAYS = 30;

/** The countdown pop-up shows on each of the last this-many calendar days. */
export const COUNTDOWN_DAYS = 7;

const DAY_MS = 24 * 60 * 60 * 1000;

export function freeAccessEndsAt(signedUpAt: string | Date): Date {
  return new Date(new Date(signedUpAt).getTime() + FREE_ACCESS_DAYS * DAY_MS);
}

function startOfLocalDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

/**
 * Calendar days of free access left, counting today: 1 on the day access
 * ends, 2 the day before, and so on. 0 once access has ended.
 */
export function freeDaysLeft(signedUpAt: string | Date, now: Date = new Date()): number {
  const endsAt = freeAccessEndsAt(signedUpAt);
  if (now.getTime() >= endsAt.getTime()) return 0;
  // Round, because a daylight saving change makes one day 23 or 25 hours.
  return Math.round((startOfLocalDay(endsAt) - startOfLocalDay(now)) / DAY_MS) + 1;
}

/** True on each of the last COUNTDOWN_DAYS calendar days of free access. */
export function inCountdown(signedUpAt: string | Date, now: Date = new Date()): boolean {
  const left = freeDaysLeft(signedUpAt, now);
  return left >= 1 && left <= COUNTDOWN_DAYS;
}

/** YYYY-MM-DD for the viewer's own calendar day. */
export function localDateKey(now: Date = new Date()): string {
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

/**
 * The browser key that records the pop-up was seen. One per user per
 * calendar day, so it shows once a day however often they come back.
 */
export function countdownSeenKey(userId: string, now: Date = new Date()): string {
  return `myplanforsuccess:countdown-seen:${userId}:${localDateKey(now)}`;
}
