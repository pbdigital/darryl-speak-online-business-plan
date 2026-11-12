/**
 * Admin Team Management Edge Function
 *
 * Handles admin team CRUD operations:
 * - GET /admin-team - List all admin users
 * - POST /admin-team - Grant admin access to a user, by ID or by email
 *   (creating a member account when the email has none)
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
import type { SupabaseClient } from 'jsr:@supabase/supabase-js@2';
import { getAdminUsers, listAuthUsers } from '../_shared/admin-users-data.ts';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function cleanName(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim().slice(0, 100);
  return trimmed || null;
}

function randomPassword(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes));
}

async function findUserIdByEmail(
  serviceClient: SupabaseClient,
  email: string
): Promise<string | null> {
  const users = await listAuthUsers(serviceClient);
  return users.find((user) => user.email?.toLowerCase() === email)?.id ?? null;
}

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

    // POST /admin-team - Grant admin access.
    // Body { userId } grants an existing user. Body { email, firstName?,
    // lastName? } grants whoever has that email, creating the account first if
    // there is none. Admins are always made members, so they are never in the
    // free plan cohort, never tagged in Keap and never locked.
    if (req.method === 'POST') {
      const body = await req.json().catch(() => ({}));
      let requestedUserId: string | null =
        typeof body.userId === 'string' && body.userId ? body.userId : null;
      const email =
        typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
      let created = false;

      if (!requestedUserId && !email) {
        return error(
          [{ field: 'userId', message: 'A user or an email address is required' }],
          400,
          view
        );
      }

      if (!requestedUserId) {
        if (!EMAIL_PATTERN.test(email)) {
          return error([{ field: 'email', message: 'Enter a valid email address' }], 400, view);
        }

        const existing = await findUserIdByEmail(serviceClient, email);
        if (existing) {
          requestedUserId = existing;
        } else {
          const firstName = cleanName(body.firstName);
          const lastName = cleanName(body.lastName);
          const { data: newUser, error: createError } =
            await serviceClient.auth.admin.createUser({
              email,
              email_confirm: true,
              // Nobody knows this password. They set their own from the
              // set-password email the admin page sends next.
              password: randomPassword(),
              app_metadata: { account_type: 'member' },
              user_metadata: { first_name: firstName, last_name: lastName },
            });

          if (createError || !newUser.user) {
            console.error('Create admin user error:', createError);
            return serverError('Could not create the account', view);
          }

          requestedUserId = newUser.user.id;
          created = true;
        }
      }

      // Check if user exists
      const { data: targetUser, error: userError } = await serviceClient
        .from('profiles')
        .select('id, is_admin, first_name, last_name, account_type')
        .eq('id', requestedUserId)
        .single();

      if (userError || !targetUser) {
        return notFound('User not found', view);
      }

      if (targetUser.is_admin) {
        return error([{ message: 'User is already an admin' }], 400, view);
      }

      if (targetUser.account_type !== 'member') {
        // GoTrue saves app_metadata after the profile trigger runs, so a new
        // account starts as free in profiles; keep auth and profile in step.
        const { error: metaError } = await serviceClient.auth.admin.updateUserById(
          requestedUserId,
          { app_metadata: { account_type: 'member' } }
        );
        if (metaError) {
          console.error('Mark admin as member error:', metaError);
          return serverError(metaError.message, view);
        }
      }

      // Grant admin access
      const { error: updateError } = await serviceClient
        .from('profiles')
        .update({
          is_admin: true,
          account_type: 'member',
          locked_at: null,
          lock_source: null,
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
          created,
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
