/**
 * Plan Sections Edge Function
 *
 * Handles section data persistence for business plans:
 * - GET /plan-sections?planId=xxx - Get all sections for a plan
 * - PUT /plan-sections - Upsert section data (auto-save)
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

// Valid section keys matching the 5 business plan sections
const VALID_SECTION_KEYS = [
  'reflection',
  'swot',
  'income-planning',
  'mindset',
  'accountability',
] as const;

type SectionKey = (typeof VALID_SECTION_KEYS)[number];

interface PlanSection {
  id: string;
  business_plan_id: string;
  section_key: string;
  data: Record<string, unknown>;
  updated_at: string;
}

interface UpsertPayload {
  planId: string;
  sectionKey: SectionKey;
  data: Record<string, unknown>;
}

/**
 * Validate the upsert payload
 */
function validatePayload(
  body: unknown
): { valid: true; data: UpsertPayload } | { valid: false; errors: Array<{ field: string; message: string }> } {
  const errors: Array<{ field: string; message: string }> = [];

  if (!body || typeof body !== 'object') {
    return { valid: false, errors: [{ field: 'body', message: 'Request body must be an object' }] };
  }

  const payload = body as Record<string, unknown>;

  // Validate planId
  if (!payload.planId || typeof payload.planId !== 'string') {
    errors.push({ field: 'planId', message: 'planId is required and must be a string' });
  } else if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(payload.planId)) {
    errors.push({ field: 'planId', message: 'planId must be a valid UUID' });
  }

  // Validate sectionKey
  if (!payload.sectionKey || typeof payload.sectionKey !== 'string') {
    errors.push({ field: 'sectionKey', message: 'sectionKey is required and must be a string' });
  } else if (!VALID_SECTION_KEYS.includes(payload.sectionKey as SectionKey)) {
    errors.push({
      field: 'sectionKey',
      message: `sectionKey must be one of: ${VALID_SECTION_KEYS.join(', ')}`,
    });
  }

  // Validate data
  if (payload.data === undefined) {
    errors.push({ field: 'data', message: 'data is required' });
  } else if (typeof payload.data !== 'object' || payload.data === null || Array.isArray(payload.data)) {
    errors.push({ field: 'data', message: 'data must be an object' });
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      planId: payload.planId as string,
      sectionKey: payload.sectionKey as SectionKey,
      data: payload.data as Record<string, unknown>,
    },
  };
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

    const url = new URL(req.url);

    // GET /plan-sections?planId=xxx - Get all sections for a plan
    if (req.method === 'GET') {
      const planId = url.searchParams.get('planId');

      if (!planId) {
        return error([{ field: 'planId', message: 'planId query parameter is required' }]);
      }

      // Verify user owns the plan (RLS will also check this, but we want a better error message)
      const { data: plan, error: planError } = await supabase
        .from('business_plans')
        .select('id')
        .eq('id', planId)
        .single();

      if (planError || !plan) {
        return notFound('Business plan not found');
      }

      // Get all sections for this plan
      const { data: sections, error: sectionsError } = await supabase
        .from('plan_sections')
        .select('*')
        .eq('business_plan_id', planId);

      if (sectionsError) {
        console.error('Database error:', sectionsError);
        return serverError(sectionsError.message);
      }

      return success(sections);
    }

    // PUT /plan-sections - Upsert section data
    if (req.method === 'PUT') {
      const body = await req.json();
      const validation = validatePayload(body);

      if (!validation.valid) {
        return error(validation.errors);
      }

      const { planId, sectionKey, data } = validation.data;

      // Verify user owns the plan (RLS will check on insert/update, but explicit check gives better error)
      const { data: plan, error: planError } = await supabase
        .from('business_plans')
        .select('id')
        .eq('id', planId)
        .single();

      if (planError || !plan) {
        return notFound('Business plan not found');
      }

      // Upsert the section data
      const { data: section, error: upsertError } = await supabase
        .from('plan_sections')
        .upsert(
          {
            business_plan_id: planId,
            section_key: sectionKey,
            data,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'business_plan_id,section_key',
          }
        )
        .select()
        .single();

      if (upsertError) {
        console.error('Database error:', upsertError);
        return serverError(upsertError.message);
      }

      return success(section);
    }

    return methodNotAllowed();
  } catch (err) {
    console.error('Unexpected error:', err);
    return serverError('An unexpected error occurred');
  }
});
