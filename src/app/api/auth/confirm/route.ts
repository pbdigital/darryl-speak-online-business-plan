import { type EmailOtpType } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { recordPlanEvent } from '@/lib/keap/events';

/**
 * Email link landing route for sign-up confirmation and password reset.
 *
 * Accepts either a token hash (our email templates, works on any device) or a
 * PKCE code (Supabase's default templates). On success the session cookie is
 * set and the user is sent on to `next`.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const code = searchParams.get('code');
  const next = safeNext(searchParams.get('next'));

  const supabase = await createClient();

  let error: unknown = null;
  if (tokenHash && type) {
    ({ error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type }));
  } else if (code) {
    ({ error } = await supabase.auth.exchangeCodeForSession(code));
  } else {
    error = new Error('Missing token');
  }

  if (error) {
    console.error('Email link verification failed:', error);
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set(
      'error',
      'That link has expired or was already used. Log in, or ask for a new link.'
    );
    return NextResponse.redirect(loginUrl);
  }

  await recordSignUp(supabase);

  return NextResponse.redirect(new URL(next, request.url));
}

/**
 * Tags a confirmed free user as signed up in Keap. recordPlanEvent records
 * each event once per user, so repeat visits here are harmless. A failure is
 * logged and never blocks sign-in.
 */
async function recordSignUp(supabase: Awaited<ReturnType<typeof createClient>>) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.email_confirmed_at) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('account_type')
      .eq('id', user.id)
      .maybeSingle();
    if (profile?.account_type !== 'free') return;

    await recordPlanEvent(user.id, 'signed_up');
  } catch (err) {
    console.error('Failed to record signed_up plan event:', err);
  }
}

// Only allow same-site paths, so the link cannot send people elsewhere.
function safeNext(next: string | null): string {
  if (next && next.startsWith('/') && !next.startsWith('//') && !next.includes('\\')) {
    return next;
  }
  return '/plan';
}
