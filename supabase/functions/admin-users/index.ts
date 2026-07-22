/**
 * Admin user management Edge Function
 *
 * Sensitive Auth data is read only after the caller has been verified as an
 * administrator. The service role key never leaves this server boundary.
 */
import { handleCors } from '../_shared/index.ts';
import { authorizeAdmin } from '../_shared/admin-auth.ts';
import {
  getAdminUser,
  getAdminUsers,
  getLatestPlanSections,
} from '../_shared/admin-users-data.ts';
import { handleAdminUsersRequest } from './handler.ts';

Deno.serve(async (req) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  return handleAdminUsersRequest(req, {
    authorizeAdmin,
    listUsers: ({ serviceClient }) => getAdminUsers(serviceClient),
    getUser: ({ serviceClient }, userId) =>
      getAdminUser(serviceClient, userId),
    getPlanSections: ({ serviceClient }, userId) =>
      getLatestPlanSections(serviceClient, userId),
    sendPasswordReset: async ({ serviceClient }, email) => {
      const { error } = await serviceClient.auth.resetPasswordForEmail(email);
      if (error) throw error;
    },
  });
});
