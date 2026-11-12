// Run with: node --test --experimental-strip-types src/lib/free-access.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { countdownSeenKey, freeDaysLeft, inCountdown } from './free-access.ts';

const signedUp = '2026-11-01T15:00:00.000Z';
const at = (iso: string) => new Date(iso);

test('a new sign-up has 30 days left and no countdown', () => {
  assert.equal(freeDaysLeft(signedUp, at('2026-11-01T15:00:01Z')), 30);
  assert.equal(inCountdown(signedUp, at('2026-11-01T15:00:01Z')), false);
});

test('the countdown starts with 7 days left', () => {
  // Access ends 1 Dec 15:00 UTC. Seven days before is 24 Nov 15:00.
  assert.equal(freeDaysLeft(signedUp, at('2026-11-24T14:59:59Z')), 8);
  assert.equal(inCountdown(signedUp, at('2026-11-24T14:59:59Z')), false);
  assert.equal(freeDaysLeft(signedUp, at('2026-11-24T15:00:00Z')), 7);
  assert.equal(inCountdown(signedUp, at('2026-11-24T15:00:00Z')), true);
});

test('it counts down to 1 on the last day', () => {
  assert.equal(freeDaysLeft(signedUp, at('2026-11-27T16:00:00Z')), 4);
  assert.equal(freeDaysLeft(signedUp, at('2026-12-01T14:59:59Z')), 1);
  assert.equal(inCountdown(signedUp, at('2026-12-01T14:59:59Z')), true);
});

test('nothing shows once free access has ended', () => {
  assert.equal(freeDaysLeft(signedUp, at('2026-12-01T15:00:00Z')), 0);
  assert.equal(inCountdown(signedUp, at('2026-12-01T15:00:00Z')), false);
  assert.equal(freeDaysLeft(signedUp, at('2027-01-10T00:00:00Z')), 0);
});

test('the seen key changes each countdown day', () => {
  assert.notEqual(countdownSeenKey('u1', 7, signedUp), countdownSeenKey('u1', 6, signedUp));
  assert.notEqual(countdownSeenKey('u1', 7, signedUp), countdownSeenKey('u2', 7, signedUp));
});
