import type {
  AdminAuthorization,
  AdminContext,
} from '../_shared/admin-auth.ts';
import type {
  AdminPlanSection,
  AdminUserRecord,
} from '../_shared/admin-users-data.ts';
import {
  error,
  methodNotAllowed,
  notFound,
  serverError,
  success,
} from '../_shared/response.ts';

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export interface AdminUsersDependencies {
  authorizeAdmin: (
    req: Request,
    view: string
  ) => Promise<AdminAuthorization>;
  listUsers: (context: AdminContext) => Promise<AdminUserRecord[]>;
  getUser: (
    context: AdminContext,
    userId: string
  ) => Promise<AdminUserRecord | null>;
  getPlanSections: (
    context: AdminContext,
    userId: string
  ) => Promise<AdminPlanSection[]>;
  sendPasswordReset: (
    context: AdminContext,
    email: string
  ) => Promise<void>;
}

function getView(req: Request): string {
  if (req.method !== 'GET') return 'admin-user-detail';

  const url = new URL(req.url);
  if (!url.searchParams.get('id')) return 'admin-users-list';
  return url.searchParams.get('include') === 'plan-sections'
    ? 'admin-user-plan'
    : 'admin-user-detail';
}

async function readJsonBody(req: Request): Promise<Record<string, unknown> | null> {
  try {
    const body = await req.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
    return body as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function handleAdminUsersRequest(
  req: Request,
  dependencies: AdminUsersDependencies
): Promise<Response> {
  const view = getView(req);

  try {
    const authorization = await dependencies.authorizeAdmin(req, view);
    if (!authorization.authorized) return authorization.response;

    const { context } = authorization;
    const url = new URL(req.url);

    if (req.method === 'GET') {
      const userId = url.searchParams.get('id');
      const include = url.searchParams.get('include');

      if (!userId) {
        if (include) {
          return error(
            [{ field: 'include', message: 'An id is required with include' }],
            400,
            view
          );
        }

        const users = await dependencies.listUsers(context);
        return success({ users }, 200, view);
      }

      if (!UUID_PATTERN.test(userId)) {
        return error(
          [{ field: 'id', message: 'A valid user ID is required' }],
          400,
          view
        );
      }

      if (include && include !== 'plan-sections') {
        return error(
          [{ field: 'include', message: 'Unsupported include value' }],
          400,
          view
        );
      }

      const user = await dependencies.getUser(context, userId);
      if (!user) return notFound('User not found', view);

      if (include === 'plan-sections') {
        const planSections = await dependencies.getPlanSections(context, userId);
        return success({ user, planSections }, 200, view);
      }

      return success({ user }, 200, view);
    }

    if (req.method === 'POST') {
      const body = await readJsonBody(req);

      if (!body) {
        return error([{ message: 'A JSON request body is required' }], 400, view);
      }

      const userId = typeof body.userId === 'string' ? body.userId : '';
      const action = typeof body.action === 'string' ? body.action : '';

      if (!UUID_PATTERN.test(userId)) {
        return error(
          [{ field: 'userId', message: 'A valid user ID is required' }],
          400,
          view
        );
      }

      if (action !== 'reset-access') {
        return error(
          [{ field: 'action', message: 'Invalid action' }],
          400,
          view
        );
      }

      const user = await dependencies.getUser(context, userId);
      if (!user) return notFound('User not found', view);

      if (user.auth_provider === 'wordpress') {
        return error(
          [
            {
              message:
                'This user authenticates via POWER AGENT SSO. Their access is managed through the Power Agent portal.',
            },
          ],
          400,
          view
        );
      }

      if (!user.email) {
        return error([{ message: 'User has no email address on file' }], 400, view);
      }

      await dependencies.sendPasswordReset(context, user.email);
      return success(
        {
          resetType: 'email',
          message: `Password reset email sent to ${user.email}.`,
        },
        200,
        view
      );
    }

    return methodNotAllowed(view);
  } catch (err) {
    console.error('Admin users request failed:', err);
    return serverError('An unexpected error occurred', view);
  }
}
