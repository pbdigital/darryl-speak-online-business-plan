import type { User } from 'jsr:@supabase/supabase-js@2';
import { buildFreePlanReport } from './admin-free-plan-data.ts';
import type { ProfileRow } from './admin-users-data.ts';

function assertEquals(actual: unknown, expected: unknown): void {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a !== e) throw new Error(`Expected ${e}, received ${a}`);
}

const NOW = new Date('2026-11-30T00:00:00.000Z');

function authUser(id: string): User {
  return {
    id,
    email: `${id}@example.com`,
    created_at: '2026-01-01T00:00:00.000Z',
    last_sign_in_at: null,
  } as unknown as User;
}

function profile(id: string, overrides: Partial<ProfileRow> = {}): ProfileRow {
  return {
    id,
    first_name: null,
    last_name: null,
    is_admin: false,
    admin_granted_at: null,
    admin_granted_by: null,
    admin_revoked_at: null,
    admin_revoked_by: null,
    account_type: 'free',
    locked_at: null,
    lock_source: null,
    created_at: '2026-11-01T00:00:00.000Z',
    updated_at: '2026-11-01T00:00:00.000Z',
    ...overrides,
  };
}

Deno.test('counts the free plan funnel by sign-up window', () => {
  const report = buildFreePlanReport(
    {
      authUsers: ['a', 'b', 'c', 'old-member'].map(authUser),
      profiles: [
        // a: signed up 2 days ago, started, finished section 3 and plan, printed
        profile('a'),
        // b: signed up 20 days ago, locked
        profile('b', { locked_at: '2026-11-29T00:00:00.000Z' }),
        // c: signed up 60 days ago via free plan, now a member
        profile('c', { account_type: 'member' }),
        // old-member: member who never used the free plan, not in the cohort
        profile('old-member', { account_type: 'member' }),
      ],
      plans: [
        { id: 'plan-a', user_id: 'a', year: 2027 },
        { id: 'plan-a-old', user_id: 'a', year: 2026 },
      ],
      sections: [
        { id: 's1', business_plan_id: 'plan-a', section_key: 'swot', data: { x: 1 }, updated_at: '' },
      ],
      events: [
        { user_id: 'a', event_key: 'signed_up', created_at: '2026-11-28T00:00:00.000Z' },
        { user_id: 'a', event_key: 'section_done:income-planning', created_at: '2026-11-28T00:00:00.000Z' },
        { user_id: 'a', event_key: 'section_done:swot', created_at: '2026-11-28T00:00:00.000Z' },
        { user_id: 'a', event_key: 'plan_done', created_at: '2026-11-28T00:00:00.000Z' },
        { user_id: 'a', event_key: 'printed', created_at: '2026-11-28T00:00:00.000Z' },
        { user_id: 'b', event_key: 'signed_up', created_at: '2026-11-10T00:00:00.000Z' },
        { user_id: 'c', event_key: 'signed_up', created_at: '2026-10-01T00:00:00.000Z' },
      ],
    },
    NOW
  );

  assertEquals(report.funnel.all, {
    signed_up: 3,
    started: 1,
    finished_section_3: 1,
    finished_plan: 1,
    printed: 1,
    locked: 1,
    became_member: 1,
  });
  assertEquals(report.funnel.last_30_days.signed_up, 2);
  assertEquals(report.funnel.last_7_days.signed_up, 1);
  assertEquals(report.users.map((u) => u.id), ['a', 'b', 'c']);
  assertEquals(report.users[0].sections_done, 2);
  assertEquals(report.users[2].joined, true);
});
