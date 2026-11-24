// Run with: npm run test:unit
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { findOrCreateKeapContact, KEAP_OPT_IN_REASON, type KeapRequest } from './contact.ts';

interface Call {
  method: string;
  path: string;
  body?: unknown;
}

/** A stand-in for Keap: records each call and answers from `respond`. */
function fakeKeap(respond: (call: Call) => unknown): { request: KeapRequest; calls: Call[] } {
  const calls: Call[] = [];
  const request = (async (method: string, path: string, body?: unknown) => {
    const call = { method, path, body };
    calls.push(call);
    return respond(call);
  }) as KeapRequest;
  return { request, calls };
}

test('the opt-in reason is the one Sarah asked for', () => {
  assert.equal(
    KEAP_OPT_IN_REASON,
    'Signed up for the free Online Business Plan at MyPlanForSuccess.com.'
  );
});

test('a new contact is created with the opt-in reason', async () => {
  const keap = fakeKeap((call) => (call.method === 'GET' ? { contacts: [] } : { id: 501 }));

  const id = await findOrCreateKeapContact(keap.request, 'new@example.com', {
    givenName: 'Ann',
    familyName: 'Lee',
  });

  assert.equal(id, 501);
  assert.deepEqual(keap.calls.map((c) => c.method), ['GET', 'POST']);
  assert.deepEqual(keap.calls[1], {
    method: 'POST',
    path: '/contacts',
    body: {
      email_addresses: [{ email: 'new@example.com', field: 'EMAIL1' }],
      given_name: 'Ann',
      family_name: 'Lee',
      opt_in_reason: KEAP_OPT_IN_REASON,
    },
  });
});

test('an existing contact is opted in, not created again', async () => {
  const keap = fakeKeap((call) => (call.method === 'GET' ? { contacts: [{ id: 77 }] } : {}));

  const id = await findOrCreateKeapContact(keap.request, 'old+tag@example.com', {});

  assert.equal(id, 77);
  assert.equal(keap.calls[0].path, '/contacts?email=old%2Btag%40example.com&limit=1');
  assert.deepEqual(keap.calls[1], {
    method: 'PATCH',
    path: '/contacts/77?update_mask=opt_in_reason',
    body: { opt_in_reason: KEAP_OPT_IN_REASON },
  });
  assert.equal(keap.calls.length, 2);
});

test('a failed opt-in still returns the existing contact', async (t) => {
  const logged = t.mock.method(console, 'error', () => {});
  const keap = fakeKeap((call) => {
    if (call.method === 'PATCH') throw new Error('Keap PATCH /contacts/77 returned 500: boom');
    return { contacts: [{ id: 77 }] };
  });

  const id = await findOrCreateKeapContact(keap.request, 'old@example.com', {});

  assert.equal(id, 77);
  assert.equal(logged.mock.callCount(), 1);
  assert.match(String(logged.mock.calls[0].arguments[0]), /Could not opt in contact 77.*500/);
});

test('a failed lookup or create is still an error, so the event is retried', async () => {
  const lookupFails = fakeKeap(() => {
    throw new Error('Keap GET /contacts returned 401');
  });
  await assert.rejects(findOrCreateKeapContact(lookupFails.request, 'a@example.com', {}), /401/);

  const createFails = fakeKeap((call) => {
    if (call.method === 'POST') throw new Error('Keap POST /contacts returned 400');
    return { contacts: [] };
  });
  await assert.rejects(findOrCreateKeapContact(createFails.request, 'a@example.com', {}), /400/);
});
