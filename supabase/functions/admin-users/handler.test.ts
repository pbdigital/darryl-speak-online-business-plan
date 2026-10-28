import type { AdminContext } from '../_shared/admin-auth.ts';
import type { AdminUserRecord } from '../_shared/admin-users-data.ts';
import { forbidden, unauthorized } from '../_shared/response.ts';
import {
  handleAdminUsersRequest,
  type AdminUsersDependencies,
} from './handler.ts';

const USER_ID = '123e4567-e89b-42d3-a456-426614174000';
const context = {} as AdminContext;

const adminUser: AdminUserRecord = {
  id: USER_ID,
  first_name: 'Admin',
  last_name: 'User',
  email: 'admin@example.com',
  is_admin: true,
  admin_granted_at: null,
  admin_granted_by: null,
  admin_revoked_at: null,
  admin_revoked_by: null,
  granted_by_name: null,
  account_type: 'member',
  locked_at: null,
  lock_source: null,
  created_at: '2026-01-01T00:00:00.000Z',
  updated_at: '2026-01-01T00:00:00.000Z',
  last_sign_in_at: null,
  auth_provider: 'email',
  auth_created_at: '2026-01-01T00:00:00.000Z',
  sections_completed: 0,
  total_sections: 5,
  has_plan: false,
};

function assertEquals(actual: unknown, expected: unknown): void {
  const actualJson = JSON.stringify(actual);
  const expectedJson = JSON.stringify(expected);
  if (actualJson !== expectedJson) {
    throw new Error(`Expected ${expectedJson}, received ${actualJson}`);
  }
}

function createDependencies(
  overrides: Partial<AdminUsersDependencies> = {}
): AdminUsersDependencies {
  return {
    authorizeAdmin: async () => ({ authorized: true, context }),
    listUsers: async () => [adminUser],
    getUser: async () => adminUser,
    getPlanSections: async () => [],
    sendPasswordReset: async () => undefined,
    setPlanLock: async () => undefined,
    getFreePlanReport: async () => {
      throw new Error('not expected');
    },
    ...overrides,
  };
}

Deno.test('returns JSON 401 when the token is missing', async () => {
  const response = await handleAdminUsersRequest(
    new Request('http://localhost/admin-users'),
    createDependencies({
      authorizeAdmin: async (_req, view) => ({
        authorized: false,
        response: unauthorized('Authentication required', view),
      }),
    })
  );
  const body = await response.json();

  assertEquals(response.status, 401);
  assertEquals(response.headers.get('content-type'), 'application/json');
  assertEquals(body.view, 'admin-users-list');
  assertEquals(body.success, false);
});

Deno.test('returns JSON 403 for an authenticated non-admin', async () => {
  const response = await handleAdminUsersRequest(
    new Request('http://localhost/admin-users'),
    createDependencies({
      authorizeAdmin: async (_req, view) => ({
        authorized: false,
        response: forbidden('Admin access required', view),
      }),
    })
  );
  const body = await response.json();

  assertEquals(response.status, 403);
  assertEquals(body.view, 'admin-users-list');
  assertEquals(body.success, false);
});

Deno.test('returns the admin user list in the JSON envelope', async () => {
  const response = await handleAdminUsersRequest(
    new Request('http://localhost/admin-users'),
    createDependencies()
  );
  const body = await response.json();

  assertEquals(response.status, 200);
  assertEquals(body.view, 'admin-users-list');
  assertEquals(body.data.users, [adminUser]);
  assertEquals(body.errors, []);
});

Deno.test('returns 404 for an unknown user ID', async () => {
  const response = await handleAdminUsersRequest(
    new Request(`http://localhost/admin-users?id=${USER_ID}`),
    createDependencies({ getUser: async () => null })
  );
  const body = await response.json();

  assertEquals(response.status, 404);
  assertEquals(body.view, 'admin-user-detail');
  assertEquals(body.success, false);
});

Deno.test('returns plan sections only for an authorized admin', async () => {
  const planSections = [
    {
      id: USER_ID,
      section_key: 'reflection',
      data: { mantra: 'Focus' },
      updated_at: '2026-01-02T00:00:00.000Z',
    },
  ];
  const response = await handleAdminUsersRequest(
    new Request(
      `http://localhost/admin-users?id=${USER_ID}&include=plan-sections`
    ),
    createDependencies({ getPlanSections: async () => planSections })
  );
  const body = await response.json();

  assertEquals(response.status, 200);
  assertEquals(body.view, 'admin-user-plan');
  assertEquals(body.data, { user: adminUser, planSections });
});

function postAction(action: string): Request {
  return new Request('http://localhost/admin-users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: USER_ID, action }),
  });
}

Deno.test('locks a free user', async () => {
  const calls: boolean[] = [];
  const response = await handleAdminUsersRequest(
    postAction('lock'),
    createDependencies({
      getUser: async () => ({ ...adminUser, account_type: 'free' }),
      setPlanLock: async (_context, _userId, locked) => {
        calls.push(locked);
      },
    })
  );
  const body = await response.json();

  assertEquals(response.status, 200);
  assertEquals(body.data, { userId: USER_ID, locked: true });
  assertEquals(calls, [true]);
});

Deno.test('refuses to lock a member', async () => {
  const calls: boolean[] = [];
  const response = await handleAdminUsersRequest(
    postAction('lock'),
    createDependencies({
      setPlanLock: async (_context, _userId, locked) => {
        calls.push(locked);
      },
    })
  );

  assertEquals(response.status, 400);
  assertEquals(calls, []);
});

Deno.test('unlocks a locked member', async () => {
  const calls: boolean[] = [];
  const response = await handleAdminUsersRequest(
    postAction('unlock'),
    createDependencies({
      getUser: async () => ({
        ...adminUser,
        locked_at: '2026-01-03T00:00:00.000Z',
        lock_source: 'keap',
      }),
      setPlanLock: async (_context, _userId, locked) => {
        calls.push(locked);
      },
    })
  );
  const body = await response.json();

  assertEquals(response.status, 200);
  assertEquals(body.data, { userId: USER_ID, locked: false });
  assertEquals(calls, [false]);
});
