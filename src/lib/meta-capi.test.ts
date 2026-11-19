// Run with: npm run test:unit
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildRegistrationPayload, hashEmail } from './meta-capi.ts';

// sha256("test@example.com")
const TEST_EMAIL_HASH = '973dfe463ec85785f5f95af5ba3906eedb2d931c24e69824a89ea65dba4e813b';

test('the email is trimmed and lower-cased before hashing', () => {
  assert.equal(hashEmail('test@example.com'), TEST_EMAIL_HASH);
  assert.equal(hashEmail('  Test@Example.COM '), TEST_EMAIL_HASH);
});

test('the payload carries the event_id, the hashed email and browser IDs, never the plain email', () => {
  const payload = buildRegistrationPayload({
    email: 'Test@Example.com',
    eventId: '5f0c2c1e-1111-4222-8333-944445555666',
    eventTime: new Date('2026-11-25T15:00:00.900Z'),
    eventSourceUrl: 'https://myplanforsuccess.com/register',
    clientUserAgent: 'Mozilla/5.0',
    clientIpAddress: '203.0.113.7',
    fbp: 'fb.1.1700000000000.123',
    fbc: 'fb.1.1700000000000.AbCd',
  });

  assert.deepEqual(payload, {
    data: [
      {
        event_name: 'CompleteRegistration',
        event_time: 1795618800,
        event_id: '5f0c2c1e-1111-4222-8333-944445555666',
        action_source: 'website',
        event_source_url: 'https://myplanforsuccess.com/register',
        user_data: {
          em: [TEST_EMAIL_HASH],
          client_user_agent: 'Mozilla/5.0',
          client_ip_address: '203.0.113.7',
          fbp: 'fb.1.1700000000000.123',
          fbc: 'fb.1.1700000000000.AbCd',
        },
      },
    ],
  });
  assert.equal(JSON.stringify(payload).includes('example.com'), false);
});

test('missing browser IDs are left out, and a test event code is added when given', () => {
  const payload = buildRegistrationPayload(
    {
      email: 'test@example.com',
      eventId: 'abc',
      eventTime: new Date('2026-11-25T15:00:00Z'),
      eventSourceUrl: 'https://myplanforsuccess.com/register',
    },
    'TEST123'
  );
  assert.deepEqual(payload.data[0].user_data, { em: [TEST_EMAIL_HASH] });
  assert.equal(payload.test_event_code, 'TEST123');
});
