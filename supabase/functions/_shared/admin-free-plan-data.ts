import type { SupabaseClient, User } from 'jsr:@supabase/supabase-js@2';
import {
  CURRENT_PLAN_YEAR,
  hasCompletedData,
  listAuthUsers,
  listBusinessPlans,
  listPlanSections,
  listProfiles,
  type BusinessPlanRow,
  type PlanSectionRow,
  type ProfileRow,
} from './admin-users-data.ts';

const DATA_PAGE_SIZE = 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

export interface PlanEventRow {
  user_id: string;
  event_key: string;
  created_at: string;
}

export interface FreePlanFunnel {
  signed_up: number;
  started: number;
  finished_section_3: number;
  finished_plan: number;
  printed: number;
  locked: number;
  became_member: number;
}

export interface FreePlanUser {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  signed_up_at: string;
  sections_done: number;
  printed: boolean;
  locked: boolean;
  joined: boolean;
  last_sign_in_at: string | null;
}

export interface FreePlanReport {
  funnel: { all: FreePlanFunnel; last_30_days: FreePlanFunnel; last_7_days: FreePlanFunnel };
  users: FreePlanUser[];
}

export async function listPlanEvents(
  serviceClient: SupabaseClient
): Promise<PlanEventRow[]> {
  const rows: PlanEventRow[] = [];
  let from = 0;

  while (true) {
    const { data, error } = await serviceClient
      .from('plan_events')
      .select('user_id, event_key, created_at')
      .order('id')
      .range(from, from + DATA_PAGE_SIZE - 1);

    if (error) throw error;

    const page = (data ?? []) as PlanEventRow[];
    rows.push(...page);

    if (page.length < DATA_PAGE_SIZE) break;
    from += DATA_PAGE_SIZE;
  }

  return rows;
}

interface ReportInput {
  authUsers: User[];
  profiles: ProfileRow[];
  plans: BusinessPlanRow[];
  sections: PlanSectionRow[];
  events: PlanEventRow[];
}

interface CohortUser extends FreePlanUser {
  started: boolean;
  finished_section_3: boolean;
  finished_plan: boolean;
}

function countFunnel(users: CohortUser[]): FreePlanFunnel {
  return {
    signed_up: users.length,
    started: users.filter((u) => u.started).length,
    finished_section_3: users.filter((u) => u.finished_section_3).length,
    finished_plan: users.filter((u) => u.finished_plan).length,
    printed: users.filter((u) => u.printed).length,
    locked: users.filter((u) => u.locked).length,
    became_member: users.filter((u) => u.joined).length,
  };
}

/**
 * Builds the free plan funnel and user list.
 *
 * The cohort is everyone who signed up through the free plan: a 'signed_up'
 * plan event, or a free account (covers anyone from before events existed).
 * "Became member" means a cohort user whose account is now a member.
 * The 7 and 30 day counts are for users who signed up in that window.
 */
export function buildFreePlanReport(
  input: ReportInput,
  now = new Date()
): FreePlanReport {
  const profilesById = new Map(input.profiles.map((p) => [p.id, p]));
  const eventsByUser = new Map<string, Map<string, string>>();
  input.events.forEach((event) => {
    const userEvents = eventsByUser.get(event.user_id) ?? new Map<string, string>();
    userEvents.set(event.event_key, event.created_at);
    eventsByUser.set(event.user_id, userEvents);
  });
  const currentPlanByUser = new Map(
    input.plans
      .filter((plan) => plan.year === CURRENT_PLAN_YEAR)
      .map((plan) => [plan.user_id, plan.id])
  );
  const startedPlanIds = new Set(
    input.sections
      .filter((section) => hasCompletedData(section.data))
      .map((section) => section.business_plan_id)
  );

  const cohort: CohortUser[] = [];

  input.authUsers.forEach((authUser) => {
    const profile = profilesById.get(authUser.id);
    const events = eventsByUser.get(authUser.id) ?? new Map<string, string>();
    const signedUpEvent = events.get('signed_up');
    if (!signedUpEvent && profile?.account_type !== 'free') return;

    const planId = currentPlanByUser.get(authUser.id);
    const sectionsDone = Array.from(events.keys()).filter((key) =>
      key.startsWith('section_done:')
    ).length;

    cohort.push({
      id: authUser.id,
      email: authUser.email ?? null,
      first_name: profile?.first_name ?? null,
      last_name: profile?.last_name ?? null,
      signed_up_at: signedUpEvent ?? profile?.created_at ?? authUser.created_at,
      sections_done: sectionsDone,
      printed: events.has('printed'),
      locked: !!profile?.locked_at,
      joined: profile?.account_type === 'member',
      last_sign_in_at: authUser.last_sign_in_at ?? null,
      started: !!planId && startedPlanIds.has(planId),
      finished_section_3: events.has('section_done:income-planning'),
      finished_plan: events.has('plan_done'),
    });
  });

  cohort.sort((a, b) => b.signed_up_at.localeCompare(a.signed_up_at));

  const since = (days: number) =>
    cohort.filter(
      (u) => now.getTime() - new Date(u.signed_up_at).getTime() <= days * DAY_MS
    );

  return {
    funnel: {
      all: countFunnel(cohort),
      last_30_days: countFunnel(since(30)),
      last_7_days: countFunnel(since(7)),
    },
    users: cohort.map(
      ({ started: _s, finished_section_3: _f3, finished_plan: _fp, ...user }) => user
    ),
  };
}

export async function getFreePlanReport(
  serviceClient: SupabaseClient
): Promise<FreePlanReport> {
  const [authUsers, profiles, plans, sections, events] = await Promise.all([
    listAuthUsers(serviceClient),
    listProfiles(serviceClient),
    listBusinessPlans(serviceClient),
    listPlanSections(serviceClient),
    listPlanEvents(serviceClient),
  ]);

  return buildFreePlanReport({ authUsers, profiles, plans, sections, events });
}
