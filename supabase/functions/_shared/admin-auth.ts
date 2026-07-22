import {
  createClient,
  type SupabaseClient,
} from 'jsr:@supabase/supabase-js@2';
import { forbidden, serverError, unauthorized } from './response.ts';

export interface AdminContext {
  userId: string;
  userClient: SupabaseClient;
  serviceClient: SupabaseClient;
}

export type AdminAuthorization =
  | { authorized: true; context: AdminContext }
  | { authorized: false; response: Response };

export async function authorizeAdmin(
  req: Request,
  view: string
): Promise<AdminAuthorization> {
  const authorization = req.headers.get('Authorization');

  if (!authorization?.startsWith('Bearer ')) {
    return {
      authorized: false,
      response: unauthorized('Authentication required', view),
    };
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');

  if (!supabaseUrl || !anonKey) {
    return {
      authorized: false,
      response: serverError('Server configuration error', view),
    };
  }

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authorization } },
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const {
    data: { user },
    error: authError,
  } = await userClient.auth.getUser();

  if (authError || !user) {
    return {
      authorized: false,
      response: unauthorized('Authentication required', view),
    };
  }

  const { data: profile, error: profileError } = await userClient
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error('Admin profile lookup failed:', profileError);
    return {
      authorized: false,
      response: serverError('Unable to verify admin access', view),
    };
  }

  if (!profile?.is_admin) {
    return {
      authorized: false,
      response: forbidden('Admin access required', view),
    };
  }

  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!serviceRoleKey) {
    return {
      authorized: false,
      response: serverError('Server configuration error', view),
    };
  }

  const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  return {
    authorized: true,
    context: { userId: user.id, userClient, serviceClient },
  };
}
