/**
 * Admin Team Management Edge Function
 *
 * Handles admin team CRUD operations:
 * - GET /admin-team - List all admin users
 * - POST /admin-team - Grant admin access to a user
 * - DELETE /admin-team?id=xxx - Revoke admin access from a user
 */
import {
  handleCors,
  success,
  error,
  notFound,
  methodNotAllowed,
  serverError,
} from '../_shared/index.ts';
import { authorizeAdmin } from '../_shared/admin-auth.ts';
import { getAdminUsers } from '../_shared/admin-users-data.ts';

Deno.serve(async (req) => {
  const view = 'admin-team';

  // Handle CORS preflight
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const authorization = await authorizeAdmin(req, view);
    if (!authorization.authorized) return authorization.response;

    const { userId, serviceClient } = authorization.context;

    const url = new URL(req.url);
    const targetUserId = url.searchParams.get('id');

    // GET /admin-team - List all admins
    if (req.method === 'GET') {
      const admins = (await getAdminUsers(serviceClient))
        .filter((admin) => admin.is_admin)
        .map((admin) => ({
          id: admin.id,
          first_name: admin.first_name,
          last_name: admin.last_name,
          email: admin.email,
          is_admin: admin.is_admin,
          admin_granted_at: admin.admin_granted_at,
          admin_granted_by: admin.admin_granted_by,
          granted_by_name: admin.granted_by_name,
        }))
        .sort((a, b) =>
          (b.admin_granted_at ?? '').localeCompare(a.admin_granted_at ?? '')
        );

      return success(admins, 200, view);
    }

    // POST /admin-team - Grant admin access
    if (req.method === 'POST') {
      const body = await req.json();
      const requestedUserId = body.userId;

      if (!requestedUserId) {
        return error(
          [{ field: 'userId', message: 'User ID is required' }],
          400,
          view
        );
      }

      // Check if user exists
      const { data: targetUser, error: userError } = await serviceClient
        .from('profiles')
        .select('id, is_admin, first_name, last_name')
        .eq('id', requestedUserId)
        .single();

      if (userError || !targetUser) {
        return notFound('User not found', view);
      }

      if (targetUser.is_admin) {
        return error([{ message: 'User is already an admin' }], 400, view);
      }

      // Grant admin access
      const { error: updateError } = await serviceClient
        .from('profiles')
        .update({
          is_admin: true,
          admin_granted_at: new Date().toISOString(),
          admin_granted_by: userId,
          admin_revoked_at: null,
          admin_revoked_by: null,
        })
        .eq('id', requestedUserId);

      if (updateError) {
        console.error('Update error:', updateError);
        return serverError(updateError.message, view);
      }

      return success(
        {
          granted: true,
          userId: requestedUserId,
          userName:
            [targetUser.first_name, targetUser.last_name]
              .filter(Boolean)
              .join(' ') || 'Unnamed',
        },
        201,
        view
      );
    }

    // DELETE /admin-team?id=xxx - Revoke admin access
    if (req.method === 'DELETE' && targetUserId) {
      // Check how many admins exist
      const { count: adminCount, error: countError } = await serviceClient
        .from('profiles')
        .select('id', { count: 'exact', head: true })
        .eq('is_admin', true);

      if (countError) {
        console.error('Count error:', countError);
        return serverError(countError.message, view);
      }

      if (adminCount !== null && adminCount <= 1) {
        return error(
          [{ message: 'Cannot remove the last admin. Add another admin first.' }],
          400,
          view
        );
      }

      // Check if target user exists and is an admin
      const { data: targetUser, error: userError } = await serviceClient
        .from('profiles')
        .select('id, is_admin, first_name, last_name')
        .eq('id', targetUserId)
        .single();

      if (userError || !targetUser) {
        return notFound('User not found', view);
      }

      if (!targetUser.is_admin) {
        return error([{ message: 'User is not an admin' }], 400, view);
      }

      // Revoke admin access
      const { error: updateError } = await serviceClient
        .from('profiles')
        .update({
          is_admin: false,
          admin_revoked_at: new Date().toISOString(),
          admin_revoked_by: userId,
        })
        .eq('id', targetUserId);

      if (updateError) {
        console.error('Update error:', updateError);
        return serverError(updateError.message, view);
      }

      return success(
        {
          revoked: true,
          userId: targetUserId,
          userName:
            [targetUser.first_name, targetUser.last_name]
              .filter(Boolean)
              .join(' ') || 'Unnamed',
          selfRevoked: targetUserId === userId,
        },
        200,
        view
      );
    }

    return methodNotAllowed(view);
  } catch (err) {
    console.error('Unexpected error:', err);
    return serverError('An unexpected error occurred', view);
  }
});
