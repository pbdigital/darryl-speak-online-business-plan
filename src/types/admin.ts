export interface AdminUser {
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
  account_type: 'member' | 'free';
  locked_at: string | null;
  lock_source: string | null;
  created_at: string;
  updated_at: string;
  last_sign_in_at: string | null;
  auth_provider: string | null;
  auth_created_at: string | null;
  sections_completed: number;
  total_sections: number;
  has_plan: boolean;
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

export type FreePlanSectionKey =
  | 'reflection'
  | 'swot'
  | 'income-planning'
  | 'mindset'
  | 'accountability';

export type FreePlanSectionCounts = Record<FreePlanSectionKey, number>;

export interface FreePlanUser {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  signed_up_at: string;
  sections_done: number;
  /** Finished sections in plan order. Missing from reports made before Nov 2026. */
  sections?: FreePlanSectionKey[];
  printed: boolean;
  locked: boolean;
  joined: boolean;
  last_sign_in_at: string | null;
}

export interface FreePlanReport {
  funnel: {
    all: FreePlanFunnel;
    last_30_days: FreePlanFunnel;
    last_7_days: FreePlanFunnel;
  };
  /** Missing from reports made before Nov 2026. */
  section_counts?: {
    all: FreePlanSectionCounts;
    last_30_days: FreePlanSectionCounts;
    last_7_days: FreePlanSectionCounts;
  };
  users: FreePlanUser[];
}

export interface AdminTeamMember {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  admin_granted_at: string | null;
  granted_by_name: string | null;
}

export interface UsersFilters {
  search: string;
  authProvider: 'all' | 'wordpress' | 'email';
  completionStatus: 'all' | 'not-started' | 'in-progress' | 'completed';
}

export interface UsersPagination {
  page: number;
  pageSize: number;
  total: number;
}
