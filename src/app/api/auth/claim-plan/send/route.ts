import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/keap/service-client';
import {
  GENERIC_CLAIM_ERROR,
  claimCodeEmail,
  claimMessage,
  generateClaimCode,
} from '@/lib/plan-claim';

const bodySchema = z.object({ email: z.string().trim().email().max(254) });

/**
 * Step 1 of bringing a free plan over: emails a 6-digit code to the free
 * account's address. The answer is the same whether or not that email has a
 * free plan, so it never reveals who has an account.
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ ok: false, message: claimMessage('not_member') }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: 'Please enter a valid email.' },
      { status: 400 }
    );
  }

  try {
    const service = createServiceClient();
    const code = generateClaimCode();
    const { data, error } = await service
      .rpc('start_plan_claim', { p_member: user.id, p_email: parsed.data.email, p_code: code })
      .single<{ status: string; claim_id: string | null; email: string | null }>();

    if (error || !data) throw error ?? new Error('start_plan_claim returned nothing');

    if (data.status !== 'sent') {
      return NextResponse.json({ ok: false, status: data.status, message: claimMessage(data.status) });
    }

    if (data.claim_id && data.email) {
      const sendError = await sendCode(data.email, code);
      if (sendError) {
        console.error('[claim-plan] Code email not sent:', sendError);
        await service.from('plan_claims').delete().eq('id', data.claim_id);
        return NextResponse.json(
          { ok: false, message: "We couldn't send the code just now. Please try again in a minute." },
          { status: 502 }
        );
      }
      console.info(`[claim-plan] Code sent for member ${user.id}`);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[claim-plan] Send failed:', err instanceof Error ? err.message : err);
    return NextResponse.json({ ok: false, message: GENERIC_CLAIM_ERROR }, { status: 500 });
  }
}

/** Returns null when sent, or what went wrong. */
async function sendCode(to: string, code: string): Promise<string | null> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (process.env.NODE_ENV !== 'production') {
      // Local development only: there is no email, so show the code here.
      console.info(`[claim-plan:dev] Code for ${to} is ${code}`);
      return null;
    }
    return 'RESEND_API_KEY is not set';
  }

  try {
    const { subject, text, html } = claimCodeEmail(code);
    const { error } = await new Resend(apiKey).emails.send({
      from: 'My Plan For Success <support@myplanforsuccess.com>',
      to: [to],
      subject,
      text,
      html,
    });
    return error ? error.message : null;
  } catch (err) {
    return err instanceof Error ? err.message : String(err);
  }
}
