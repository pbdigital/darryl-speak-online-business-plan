/**
 * Business Plans Edge Function
 *
 * Handles CRUD operations for business plans:
 * - GET /business-plans - List user's business plans
 * - GET /business-plans?id=xxx - Get single plan with sections
 * - POST /business-plans - Create new business plan
 *
 * GET responses carry the user's lock state in meta.account. Writes return
 * 423 PLAN_LOCKED while the user's plan is locked.
 */
import { createClient } from 'jsr:@supabase/supabase-js@2';
import {
  handleCors,
  success,
  error,
  unauthorized,
  notFound,
  methodNotAllowed,
  conflict,
  serverError,
  planLocked,
  getPlanAccess,
} from '../_shared/index.ts';

interface BusinessPlan {
  id: string;
  user_id: string;
  year: number;
  created_at: string;
  updated_at: string;
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

    const access = await getPlanAccess(supabase, user.id);
    const meta = { account: access };

    if (access.locked && (req.method === 'POST' || req.method === 'DELETE')) {
      return planLocked();
    }

    const url = new URL(req.url);
    const planId = url.searchParams.get('id');

    // GET /business-plans - List all plans for user
    if (req.method === 'GET' && !planId) {
      const { data, error: dbError } = await supabase
        .from('business_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('year', { ascending: false });

      if (dbError) {
        console.error('Database error:', dbError);
        return serverError(dbError.message);
      }

      return success(data, 200, undefined, meta);
    }

    // GET /business-plans?id=xxx - Get single plan with sections
    if (req.method === 'GET' && planId) {
      const { data: plan, error: planError } = await supabase
        .from('business_plans')
        .select(
          `
          *,
          plan_sections (*)
        `
        )
        .eq('id', planId)
        .single();

      if (planError) {
        if (planError.code === 'PGRST116') {
          return notFound('Business plan not found');
        }
        console.error('Database error:', planError);
        return serverError(planError.message);
      }

      return success(plan, 200, undefined, meta);
    }

    // POST /business-plans - Create new plan
    if (req.method === 'POST') {
      const body = await req.json();
      const year = body.year;

      // Validate year (required: guessing it from the clock creates the wrong plan)
      if (typeof year !== 'number' || year < 2024 || year > 2100) {
        return error([{ field: 'year', message: 'Year must be between 2024 and 2100' }]);
      }

      const { data, error: dbError } = await supabase
        .from('business_plans')
        .insert({ user_id: user.id, year })
        .select()
        .single();

      if (dbError) {
        // Handle unique constraint violation (plan already exists for this year)
        if (dbError.code === '23505') {
          return conflict(`You already have a business plan for ${year}`, 'year');
        }
        console.error('Database error:', dbError);
        return serverError(dbError.message);
      }

      return success(data, 201);
    }

    // DELETE /business-plans?id=xxx - Delete a plan
    if (req.method === 'DELETE' && planId) {
      const { error: dbError } = await supabase
        .from('business_plans')
        .delete()
        .eq('id', planId);

      if (dbError) {
        console.error('Database error:', dbError);
        return serverError(dbError.message);
      }

      return success({ deleted: true });
    }

    return methodNotAllowed();
  } catch (err) {
    console.error('Unexpected error:', err);
    return serverError('An unexpected error occurred');
  }
});
