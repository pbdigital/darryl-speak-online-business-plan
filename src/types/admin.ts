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
  created_at: string;
  updated_at: string;
  last_sign_in_at: string | null;
  auth_provider: string | null;
  auth_created_at: string | null;
  sections_completed: number;
  total_sections: number;
  has_plan: boolean;
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
