export interface AdminUser {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
  last_sign_in_at: string | null;
  auth_provider: string | null;
  auth_created_at: string | null;
  sections_completed: number;
  total_sections: number;
  has_plan: boolean;
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
