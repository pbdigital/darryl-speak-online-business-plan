import { after, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { CURRENT_PLAN_YEAR } from '@/lib/constants';
import { recordPlanEvent, SECTION_KEYS, type PlanEventKey, type SectionKey } from '@/lib/keap/events';
import { isSectionComplete } from '@/lib/keap/plan-data';

/**
 * Records a plan event for the signed-in user: `printed` or
 * `section_done:<section>`. Section completion is checked against the saved
 * plan data, never taken from the client.
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ success: false, error: 'Not signed in' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const event = typeof body?.event === 'string' ? body.event : '';

  let eventKey: PlanEventKey;
  if (event === 'printed') {
    eventKey = 'printed';
  } else if (event.startsWith('section_done:')) {
    const sectionKey = event.slice('section_done:'.length) as SectionKey;
    if (!SECTION_KEYS.includes(sectionKey)) {
      return NextResponse.json({ success: false, error: 'Unknown section' }, { status: 400 });
    }

    const { data: section, error } = await supabase
      .from('plan_sections')
      .select('data, business_plans!inner(user_id, year)')
      .eq('section_key', sectionKey)
      .eq('business_plans.user_id', user.id)
      .eq('business_plans.year', CURRENT_PLAN_YEAR)
      .maybeSingle();

    if (error) {
      console.error('[plan-events] Section lookup failed:', error.message);
      return NextResponse.json({ success: false, error: 'Could not check section' }, { status: 500 });
    }
    if (!section || !isSectionComplete(sectionKey, section.data ?? {})) {
      return NextResponse.json({ success: false, error: 'Section is not complete' }, { status: 409 });
    }

    eventKey = `section_done:${sectionKey}`;
  } else {
    return NextResponse.json({ success: false, error: 'Unknown event' }, { status: 400 });
  }

  // The row is recorded now; the Keap sync runs after the response is sent.
  const result = await recordPlanEvent(user.id, eventKey, { defer: after });
  if (!result.recorded && result.error) {
    return NextResponse.json({ success: false, error: 'Could not record event' }, { status: 500 });
  }
  return NextResponse.json({ success: true, recorded: result.recorded });
}
