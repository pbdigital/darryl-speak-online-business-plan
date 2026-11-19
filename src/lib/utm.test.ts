// Run with: npm run test:unit
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hasUtm, parseUtm, pickUtm, readCookie, serializeUtm } from './utm.ts';

test('only the five utm keys are picked from a landing URL', () => {
  const params = new URL(
    'https://myplanforsuccess.com/?utm_source=facebook&utm_medium=paid&utm_campaign=bizplan&utm_content=video1&utm_term=agents&fbclid=abc&email=a@b.com'
  ).searchParams;
  assert.deepEqual(pickUtm((key) => params.get(key)), {
    utm_source: 'facebook',
    utm_medium: 'paid',
    utm_campaign: 'bizplan',
    utm_content: 'video1',
    utm_term: 'agents',
  });
});

test('values are trimmed, capped at 100 characters, and empty ones dropped', () => {
  const utm = pickUtm((key) =>
    ({ utm_source: '  facebook ', utm_medium: '   ', utm_campaign: 'x'.repeat(150) })[key as string]
  );
  assert.deepEqual(utm, { utm_source: 'facebook', utm_campaign: 'x'.repeat(100) });
});

test('a URL with no utm values gives nothing, so no cookie is set', () => {
  const params = new URLSearchParams('mode=signup');
  assert.equal(hasUtm(pickUtm((key) => params.get(key))), false);
});

test('the cookie value round-trips, including spaces and ampersands', () => {
  const utm = { utm_source: 'facebook', utm_campaign: 'Black Friday & more' };
  assert.deepEqual(parseUtm(serializeUtm(utm)), utm);
});

test('the cookie is read back from document.cookie after Next encodes it', () => {
  const stored = encodeURIComponent(serializeUtm({ utm_source: 'fb', utm_term: 'free plan' }));
  const cookies = `_fbp=fb.1.123.456; mps_utm=${stored}; other=1`;
  assert.deepEqual(parseUtm(readCookie(cookies, 'mps_utm')), { utm_source: 'fb', utm_term: 'free plan' });
  assert.equal(readCookie(cookies, '_fbp'), 'fb.1.123.456');
  assert.equal(readCookie(cookies, 'missing'), undefined);
});

test('a damaged cookie gives nothing instead of throwing', () => {
  assert.equal(readCookie('mps_utm=%E0%A4%A', 'mps_utm'), undefined);
  assert.deepEqual(parseUtm(undefined), {});
});

test('sign-up metadata is read safely, ignoring non-text values', () => {
  const metadata: Record<string, unknown> = {
    first_name: 'Ann',
    utm_source: 'facebook',
    utm_medium: 42,
    utm_campaign: null,
  };
  assert.deepEqual(pickUtm((key) => metadata[key]), { utm_source: 'facebook' });
});
