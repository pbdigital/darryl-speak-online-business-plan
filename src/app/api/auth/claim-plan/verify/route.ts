import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/keap/service-client';
import { GENERIC_CLAIM_ERROR, claimMessage, cleanClaimCode } from '@/lib/plan-claim';

/**
 * Step 2 of bringing a free plan over: checks the code and, if it is right,
 * makes the free account the member's account (complete_plan_claim does it
 * in one transaction) and signs the browser in to it.
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ ok: false, message: claimMessage('not_member') }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as { code?: unknown } | null;
  const code = cleanClaimCode(typeof body?.code === 'string' ? body.code : '');
  if (code.length !== 6) {
    return NextResponse.json(
      { ok: false, message: 'Please enter the 6 digits from your email.' },
      { status: 400 }
    );
  }

  let claimedUserId: string;
  const service = createServiceClient();

  try {
    const { data, error } = await service
      .rpc('complete_plan_claim', { p_member: user.id, p_code: code })
      .single<{ status: string; user_id: string | null }>();

    if (error || !data) throw error ?? new Error('complete_plan_claim returned nothing');

    if (data.status !== 'claimed' || !data.user_id) {
      return NextResponse.json({ ok: false, status: data.status, message: claimMessage(data.status) });
    }
    claimedUserId = data.user_id;
    console.info(`[claim-plan] Member ${user.id} claimed account ${claimedUserId}`);
  } catch (err) {
    console.error('[claim-plan] Verify failed:', err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false, message: GENERIC_CLAIM_ERROR }, { status: 500 });
  }

  // The plan has moved. Sign the browser in to the account that holds it.
  // If this fails, the next POWER AGENT sign-in lands there anyway.
  try {
    const { data: userData, error: userError } = await service.auth.admin.getUserById(claimedUserId);
    if (userError || !userData.user?.email) throw userError ?? new Error('Claimed user has no email');

    const { data: link, error: linkError } = await service.auth.admin.generateLink({
      type: 'magiclink',
      email: userData.user.email,
    });
    if (linkError || !link.properties?.hashed_token) throw linkError ?? new Error('No token');

    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: link.properties.hashed_token,
      type: 'magiclink',
    });
    if (verifyError) throw verifyError;
  } catch (err) {
    console.error('[claim-plan] Session after claim failed:', err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: true, redirect: '/login' });
  }

  return NextResponse.json({ ok: true, redirect: '/plan?welcome=power-agent' });
}
