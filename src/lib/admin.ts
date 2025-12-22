import { createClient } from '@/lib/supabase/server';

export interface AdminCheckResult {
  isAdmin: boolean;
  userId: string | null;
}

/**
 * Check if the current user has admin privileges.
 * Must be called from a Server Component or Server Action.
 */
export async function checkAdminAccess(): Promise<AdminCheckResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { isAdmin: false, userId: null };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  return {
    isAdmin: profile?.is_admin === true,
    userId: user.id,
  };
}

/**
 * Get admin user profile with full details.
 */
export async function getAdminProfile() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    firstName: profile.first_name,
    lastName: profile.last_name,
  };
}
