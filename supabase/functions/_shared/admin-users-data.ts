import type { SupabaseClient, User } from 'jsr:@supabase/supabase-js@2';

const AUTH_PAGE_SIZE = 1000;
const DATA_PAGE_SIZE = 1000;

interface ProfileRow {
  id: string;
  first_name: string | null;
  last_name: string | null;
  is_admin: boolean;
  admin_granted_at: string | null;
  admin_granted_by: string | null;
  admin_revoked_at: string | null;
  admin_revoked_by: string | null;
  created_at: string;
  updated_at: string;
}

interface BusinessPlanRow {
  id: string;
  user_id: string;
  year: number;
}

interface PlanSectionRow {
  id: string;
  business_plan_id: string;
  section_key: string;
  data: Record<string, unknown>;
  updated_at: string;
}

export interface AdminUserRecord {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  is_admin: boolean;
  admin_granted_at: string | null;
  admin_granted_by: string | null;
  admin_revoked_at: string | null;
  admin_revoked_by: string | null;
  granted_by_name: string | null;
  created_at: string;
  updated_at: string;
  last_sign_in_at: string | null;
  auth_provider: string | null;
  auth_created_at: string | null;
  sections_completed: number;
  total_sections: number;
  has_plan: boolean;
}

export interface AdminPlanSection {
  id: string;
  section_key: string;
  data: Record<string, unknown>;
  updated_at: string;
}

async function listAuthUsers(serviceClient: SupabaseClient): Promise<User[]> {
  const users: User[] = [];
  let page = 1;

  while (true) {
    const { data, error } = await serviceClient.auth.admin.listUsers({
      page,
      perPage: AUTH_PAGE_SIZE,
    });

    if (error) throw error;

    users.push(...data.users);

    if (data.users.length < AUTH_PAGE_SIZE) break;
    page += 1;
  }

  return users;
}

async function listProfiles(
  serviceClient: SupabaseClient
): Promise<ProfileRow[]> {
  const rows: ProfileRow[] = [];
  let from = 0;

  while (true) {
    const { data, error } = await serviceClient
      .from('profiles')
      .select(
        'id, first_name, last_name, is_admin, admin_granted_at, admin_granted_by, admin_revoked_at, admin_revoked_by, created_at, updated_at'
      )
      .order('id')
      .range(from, from + DATA_PAGE_SIZE - 1);

    if (error) throw error;

    const page = (data ?? []) as ProfileRow[];
    rows.push(...page);

    if (page.length < DATA_PAGE_SIZE) break;
    from += DATA_PAGE_SIZE;
  }

  return rows;
}

async function listBusinessPlans(
  serviceClient: SupabaseClient
): Promise<BusinessPlanRow[]> {
  const rows: BusinessPlanRow[] = [];
  let from = 0;

  while (true) {
    const { data, error } = await serviceClient
      .from('business_plans')
      .select('id, user_id, year')
      .order('id')
      .range(from, from + DATA_PAGE_SIZE - 1);

    if (error) throw error;

    const page = (data ?? []) as BusinessPlanRow[];
    rows.push(...page);

    if (page.length < DATA_PAGE_SIZE) break;
    from += DATA_PAGE_SIZE;
  }

  return rows;
}

async function listPlanSections(
  serviceClient: SupabaseClient
): Promise<PlanSectionRow[]> {
  const rows: PlanSectionRow[] = [];
  let from = 0;

  while (true) {
    const { data, error } = await serviceClient
      .from('plan_sections')
      .select('id, business_plan_id, section_key, data, updated_at')
      .order('id')
      .range(from, from + DATA_PAGE_SIZE - 1);

    if (error) throw error;

    const page = (data ?? []) as PlanSectionRow[];
    rows.push(...page);

    if (page.length < DATA_PAGE_SIZE) break;
    from += DATA_PAGE_SIZE;
  }

  return rows;
}

function hasCompletedData(data: Record<string, unknown>): boolean {
  return (
    data !== null &&
    typeof data === 'object' &&
    !Array.isArray(data) &&
    Object.keys(data).length > 0
  );
}

function mapAdminUser(
  authUser: User,
  profile: ProfileRow | undefined,
  profilesById: Map<string, ProfileRow>,
  plans: BusinessPlanRow[],
  sectionsByPlanId: Map<string, PlanSectionRow[]>
): AdminUserRecord {
  const userPlans = plans.filter((plan) => plan.user_id === authUser.id);
  const sectionsCompleted = userPlans.reduce((total, plan) => {
    const completedForPlan = (sectionsByPlanId.get(plan.id) ?? []).filter(
      (section) => hasCompletedData(section.data)
    ).length;
    return total + completedForPlan;
  }, 0);
  const granter = profile?.admin_granted_by
    ? profilesById.get(profile.admin_granted_by)
    : undefined;
  const grantedByName = granter
    ? [granter.first_name, granter.last_name].filter(Boolean).join(' ') || null
    : null;

  return {
    id: authUser.id,
    first_name: profile?.first_name ?? null,
    last_name: profile?.last_name ?? null,
    email: authUser.email ?? null,
    is_admin: profile?.is_admin ?? false,
    admin_granted_at: profile?.admin_granted_at ?? null,
    admin_granted_by: profile?.admin_granted_by ?? null,
    admin_revoked_at: profile?.admin_revoked_at ?? null,
    admin_revoked_by: profile?.admin_revoked_by ?? null,
    granted_by_name: grantedByName,
    created_at: profile?.created_at ?? authUser.created_at,
    updated_at: profile?.updated_at ?? authUser.updated_at ?? authUser.created_at,
    last_sign_in_at: authUser.last_sign_in_at ?? null,
    auth_provider:
      typeof authUser.app_metadata?.provider === 'string'
        ? authUser.app_metadata.provider
        : null,
    auth_created_at: authUser.created_at,
    sections_completed: sectionsCompleted,
    total_sections: 5,
    has_plan: userPlans.length > 0,
  };
}

export async function getAdminUsers(
  serviceClient: SupabaseClient
): Promise<AdminUserRecord[]> {
  const [authUsers, profiles, plans, sections] = await Promise.all([
    listAuthUsers(serviceClient),
    listProfiles(serviceClient),
    listBusinessPlans(serviceClient),
    listPlanSections(serviceClient),
  ]);
  const profilesById = new Map(profiles.map((profile) => [profile.id, profile]));
  const sectionsByPlanId = new Map<string, PlanSectionRow[]>();

  sections.forEach((section) => {
    const planSections = sectionsByPlanId.get(section.business_plan_id) ?? [];
    planSections.push(section);
    sectionsByPlanId.set(section.business_plan_id, planSections);
  });

  return authUsers
    .map((authUser) =>
      mapAdminUser(
        authUser,
        profilesById.get(authUser.id),
        profilesById,
        plans,
        sectionsByPlanId
      )
    )
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export async function getAdminUser(
  serviceClient: SupabaseClient,
  userId: string
): Promise<AdminUserRecord | null> {
  const { data: authData, error: authError } =
    await serviceClient.auth.admin.getUserById(userId);

  if (authError) {
    if (authError.status === 404) return null;
    throw authError;
  }

  const [profileResult, profiles, plans, sections] = await Promise.all([
    serviceClient
      .from('profiles')
      .select(
        'id, first_name, last_name, is_admin, admin_granted_at, admin_granted_by, admin_revoked_at, admin_revoked_by, created_at, updated_at'
      )
      .eq('id', userId)
      .maybeSingle(),
    listProfiles(serviceClient),
    listBusinessPlans(serviceClient),
    listPlanSections(serviceClient),
  ]);

  if (profileResult.error) throw profileResult.error;

  const profilesById = new Map(profiles.map((profile) => [profile.id, profile]));
  const sectionsByPlanId = new Map<string, PlanSectionRow[]>();

  sections.forEach((section) => {
    const planSections = sectionsByPlanId.get(section.business_plan_id) ?? [];
    planSections.push(section);
    sectionsByPlanId.set(section.business_plan_id, planSections);
  });

  return mapAdminUser(
    authData.user,
    (profileResult.data as ProfileRow | null) ?? undefined,
    profilesById,
    plans,
    sectionsByPlanId
  );
}

export async function getLatestPlanSections(
  serviceClient: SupabaseClient,
  userId: string
): Promise<AdminPlanSection[]> {
  const { data: plan, error: planError } = await serviceClient
    .from('business_plans')
    .select('id')
    .eq('user_id', userId)
    .order('year', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (planError) throw planError;
  if (!plan) return [];

  const { data: sections, error: sectionsError } = await serviceClient
    .from('plan_sections')
    .select('id, section_key, data, updated_at')
    .eq('business_plan_id', plan.id)
    .order('updated_at', { ascending: false });

  if (sectionsError) throw sectionsError;
  return (sections ?? []) as AdminPlanSection[];
}
