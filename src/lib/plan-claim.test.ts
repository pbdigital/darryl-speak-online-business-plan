// Run with: npm run test:unit
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  GENERIC_CLAIM_ERROR,
  HAS_PLAN_MESSAGE,
  claimCodeEmail,
  claimMessage,
  cleanClaimCode,
  generateClaimCode,
} from './plan-claim.ts';

test('codes are always six digits', () => {
  for (let i = 0; i < 500; i++) {
    assert.match(generateClaimCode(), /^\d{6}$/);
  }
});

test('codes vary', () => {
  const codes = new Set(Array.from({ length: 50 }, generateClaimCode));
  assert.ok(codes.size > 40);
});

test('a pasted code keeps only its digits', () => {
  assert.equal(cleanClaimCode(' 123 456 '), '123456');
  assert.equal(cleanClaimCode('123-456'), '123456');
  assert.equal(cleanClaimCode('abc'), '');
});

test('each refusal has its own plain message', () => {
  assert.equal(claimMessage('has_plan'), HAS_PLAN_MESSAGE);
  assert.match(claimMessage('wrong_code'), /didn't match/);
  assert.match(claimMessage('expired'), /expired/);
  assert.match(claimMessage('too_many_attempts'), /Too many tries/);
  assert.match(claimMessage('rate_limited'), /wait an hour/);
  assert.equal(claimMessage('something_new'), GENERIC_CLAIM_ERROR);
});

test('no message uses an em dash', () => {
  for (const status of ['not_member', 'has_plan', 'rate_limited', 'wrong_code', 'expired', 'too_many_attempts', 'not_claimable']) {
    assert.ok(!claimMessage(status).includes('—'), status);
  }
});

test('the email carries the code and how long it lasts', () => {
  const email = claimCodeEmail('012345');
  assert.equal(email.subject, 'Your code to bring over your plan');
  assert.match(email.text, /Your code is 012345\./);
  assert.match(email.text, /10 minutes/);
  assert.match(email.html, />012345</);
});

test('the email refuses anything but a 6-digit code', () => {
  assert.throws(() => claimCodeEmail('<b>1</b>'));
  assert.throws(() => claimCodeEmail('12345'));
});
