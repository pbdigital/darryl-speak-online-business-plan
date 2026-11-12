// Run with: npm run test:unit (sets TZ so the calendar-day maths is fixed).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { countdownSeenKey, freeDaysLeft, inCountdown } from './free-access.ts';

// Tests run with TZ=America/New_York (UTC-5 in November).
// Signed up 1 Nov 15:00 UTC, so access ends 1 Dec 15:00 UTC = 10:00 am in New York.
const signedUp = '2026-11-01T15:00:00.000Z';
const at = (iso: string) => new Date(iso);

test('the tests run in New York time', () => {
  assert.equal(new Date('2026-12-01T15:00:00Z').getHours(), 10);
});

test('a new sign-up has 31 calendar days including today, and no countdown', () => {
  assert.equal(freeDaysLeft(signedUp, at('2026-11-01T15:00:01Z')), 31);
  assert.equal(inCountdown(signedUp, at('2026-11-01T15:00:01Z')), false);
});

test('the countdown starts 7 calendar days out, from midnight', () => {
  // 24 Nov in New York, early and late in the day.
  assert.equal(freeDaysLeft(signedUp, at('2026-11-25T04:59:00Z')), 8); // 24 Nov 11:59 pm
  assert.equal(inCountdown(signedUp, at('2026-11-25T04:59:00Z')), false);
  assert.equal(freeDaysLeft(signedUp, at('2026-11-25T05:00:00Z')), 7); // 25 Nov 12:00 am
  assert.equal(freeDaysLeft(signedUp, at('2026-11-26T02:00:00Z')), 7); // 25 Nov 9:00 pm
  assert.equal(inCountdown(signedUp, at('2026-11-25T05:00:00Z')), true);
});

test('the day before shows 2, and only the end day shows 1', () => {
  assert.equal(freeDaysLeft(signedUp, at('2026-11-30T16:00:00Z')), 2); // 30 Nov 11:00 am
  assert.equal(freeDaysLeft(signedUp, at('2026-11-30T23:00:00Z')), 2); // 30 Nov 6:00 pm
  assert.equal(freeDaysLeft(signedUp, at('2026-12-01T06:00:00Z')), 1); // 1 Dec 1:00 am
  assert.equal(freeDaysLeft(signedUp, at('2026-12-01T14:59:00Z')), 1); // 1 Dec 9:59 am
});

test('nothing shows once free access has ended', () => {
  assert.equal(freeDaysLeft(signedUp, at('2026-12-01T15:00:00Z')), 0);
  assert.equal(inCountdown(signedUp, at('2026-12-01T15:00:00Z')), false);
  assert.equal(freeDaysLeft(signedUp, at('2027-01-10T00:00:00Z')), 0);
});

test('the seen key is one per user per calendar day', () => {
  // 9 am and 11 am the same New York day share a key.
  assert.equal(
    countdownSeenKey('u1', at('2026-11-27T14:00:00Z')),
    countdownSeenKey('u1', at('2026-11-27T16:00:00Z'))
  );
  // 11 pm and 1 am the next day don't.
  assert.notEqual(
    countdownSeenKey('u1', at('2026-11-28T04:00:00Z')),
    countdownSeenKey('u1', at('2026-11-28T06:00:00Z'))
  );
  assert.notEqual(countdownSeenKey('u1'), countdownSeenKey('u2'));
});
