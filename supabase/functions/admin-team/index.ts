/**
 * Admin Team Management Edge Function
 *
 * Handles admin team CRUD operations:
 * - GET /admin-team - List all admin users
 * - POST /admin-team - Grant admin access to a user
 * - DELETE /admin-team?id=xxx - Revoke admin access from a user
 */
import { createClient } from 'jsr:@supabase/supabase-js@2';
import {
  handleCors,
  success,
  error,
  unauthorized,
  notFound,
  methodNotAllowed,
  serverError,
} from '../_shared/index.ts';

interface AdminProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  is_admin: boolean;
  admin_granted_at: string | null;
  admin_granted_by: string | null;
  granted_by_name: string | null;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    // Create Supabase client with user's auth context
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization') ?? '' },
        },
      }
    );

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return unauthorized();
    }

    // Check if current user is an admin
    const { data: currentProfile, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    if (profileError || !currentProfile?.is_admin) {
      return unauthorized('Admin access required');
    }

    const url = new URL(req.url);
    const targetUserId = url.searchParams.get('id');

    // GET /admin-team - List all admins
    if (req.method === 'GET') {
      const { data: admins, error: dbError } = await supabase
        .from('admin_users_view')
        .select('id, first_name, last_name, email, is_admin, admin_granted_at, admin_granted_by, granted_by_name')
        .eq('is_admin', true)
        .order('admin_granted_at', { ascending: false });

      if (dbError) {
        console.error('Database error:', dbError);
        return serverError(dbError.message);
      }

      return success(admins);
    }

    // POST /admin-team - Grant admin access
    if (req.method === 'POST') {
      const body = await req.json();
      const { userId } = body;

      if (!userId) {
        return error([{ field: 'userId', message: 'User ID is required' }]);
      }

      // Check if user exists
      const { data: targetUser, error: userError } = await supabase
        .from('profiles')
        .select('id, is_admin, first_name, last_name')
        .eq('id', userId)
        .single();

      if (userError || !targetUser) {
        return notFound('User not found');
      }

      if (targetUser.is_admin) {
        return error([{ message: 'User is already an admin' }], 400);
      }

      // Grant admin access
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          is_admin: true,
          admin_granted_at: new Date().toISOString(),
          admin_granted_by: user.id,
          admin_revoked_at: null,
          admin_revoked_by: null,
        })
        .eq('id', userId);

      if (updateError) {
        console.error('Update error:', updateError);
        return serverError(updateError.message);
      }

      return success({
        granted: true,
        userId,
        userName: [targetUser.first_name, targetUser.last_name].filter(Boolean).join(' ') || 'Unnamed',
      }, 201);
    }

    // DELETE /admin-team?id=xxx - Revoke admin access
    if (req.method === 'DELETE' && targetUserId) {
      // Check how many admins exist
      const { data: adminCount, error: countError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('is_admin', true);

      if (countError) {
        console.error('Count error:', countError);
        return serverError(countError.message);
      }

      // Prevent removing the last admin
      // @ts-ignore - count is available when head: true
      if (adminCount?.length <= 1 || (adminCount as unknown as { count: number })?.count <= 1) {
        // Fallback: query again with proper count
        const { count } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('is_admin', true);

        if (count !== null && count <= 1) {
          return error([{ message: 'Cannot remove the last admin. Add another admin first.' }], 400);
        }
      }

      // Check if target user exists and is an admin
      const { data: targetUser, error: userError } = await supabase
        .from('profiles')
        .select('id, is_admin, first_name, last_name')
        .eq('id', targetUserId)
        .single();

      if (userError || !targetUser) {
        return notFound('User not found');
      }

      if (!targetUser.is_admin) {
        return error([{ message: 'User is not an admin' }], 400);
      }

      // Revoke admin access
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          is_admin: false,
          admin_revoked_at: new Date().toISOString(),
          admin_revoked_by: user.id,
        })
        .eq('id', targetUserId);

      if (updateError) {
        console.error('Update error:', updateError);
        return serverError(updateError.message);
      }

      return success({
        revoked: true,
        userId: targetUserId,
        userName: [targetUser.first_name, targetUser.last_name].filter(Boolean).join(' ') || 'Unnamed',
        selfRevoked: targetUserId === user.id,
      });
    }

    return methodNotAllowed();
  } catch (err) {
    console.error('Unexpected error:', err);
    return serverError('An unexpected error occurred');
  }
});
