import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { validatePowerAgentJwt } from '@/lib/auth/jwt';
import { linkPowerAgentAccount } from '@/lib/auth/account-linking';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

/**
 * Power Agent SSO Callback Handler
 *
 * This route receives the JWT token from the WordPress SSO plugin after
 * a user successfully authenticates with their Power Agent account.
 *
 * Flow:
 * 1. Extract JWT from query params
 * 2. Validate JWT signature and expiration
 * 3. Link or create Supabase account
 * 4. Create session and redirect to /plan
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get('token');
  const errorParam = searchParams.get('error');

  // Handle errors from WordPress
  if (errorParam) {
    console.error('SSO error from WordPress:', errorParam);
    return redirectWithError(request, 'Authentication failed. Please try again.');
  }

  // Validate token presence
  if (!token) {
    return redirectWithError(request, 'No authentication token received.');
  }

  // Validate JWT
  const jwtResult = await validatePowerAgentJwt(token);

  if (!jwtResult.valid || !jwtResult.payload) {
    console.error('JWT validation failed:', jwtResult.error);
    return redirectWithError(request, jwtResult.error || 'Invalid authentication token.');
  }

  // Link or create account
  const linkResult = await linkPowerAgentAccount(jwtResult.payload);

  if (!linkResult.success || !linkResult.userId) {
    console.error('Account linking failed:', linkResult.error);

    if (linkResult.errorCode === 'CONFLICT') {
      return redirectWithError(request, linkResult.error || 'Account conflict. Please contact support.');
    }

    return redirectWithError(request, 'Failed to complete sign in. Please try again.');
  }

  // Create Supabase session for the user
  const sessionResult = await createUserSession(linkResult.userId, request);

  if (!sessionResult.success) {
    console.error('Session creation failed:', sessionResult.error);
    return redirectWithError(request, 'Failed to create session. Please try again.');
  }

  // Redirect to plan page with session cookies
  const response = NextResponse.redirect(new URL('/plan', request.url));

  // Copy cookies from session creation
  if (sessionResult.cookies) {
    for (const cookie of sessionResult.cookies) {
      response.cookies.set(cookie.name, cookie.value, cookie.options);
    }
  }

  return response;
}

/**
 * Creates a Supabase session for the authenticated user
 */
async function createUserSession(
  userId: string,
  request: NextRequest
): Promise<{
  success: boolean;
  error?: string;
  cookies?: Array<{ name: string; value: string; options: Record<string, unknown> }>;
}> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return { success: false, error: 'Server configuration error' };
  }

  try {
    // Use service role to generate session
    const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Generate a magic link/session for the user
    const { data: sessionData, error: sessionError } =
      await adminClient.auth.admin.generateLink({
        type: 'magiclink',
        email: '', // We'll get the email from the user
        options: {
          redirectTo: `${request.nextUrl.origin}/plan`,
        },
      });

    // Alternative approach: Create session directly
    // Since we've verified the user via SSO, we can use signInWithPassword
    // with a one-time generated password, or use the admin API

    // For now, we'll use a workaround: Get user and create OTP session
    const { data: userData, error: userError } = await adminClient.auth.admin.getUserById(userId);

    if (userError || !userData.user) {
      return { success: false, error: 'User not found' };
    }

    // Generate a session token using admin API
    // Note: This creates a session that the user can use
    const { data: linkData, error: linkError } = await adminClient.auth.admin.generateLink({
      type: 'magiclink',
      email: userData.user.email!,
    });

    if (linkError) {
      console.error('Failed to generate session link:', linkError);
      return { success: false, error: 'Failed to create session' };
    }

    // Extract the token from the link and verify it to create a session
    const cookieStore = await cookies();
    const storedCookies: Array<{ name: string; value: string; options: Record<string, unknown> }> = [];

    const supabase = createServerClient(
      supabaseUrl,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            for (const { name, value, options } of cookiesToSet) {
              storedCookies.push({ name, value, options: options as Record<string, unknown> });
              cookieStore.set(name, value, options);
            }
          },
        },
      }
    );

    // Verify the OTP to create a session
    const tokenHash = linkData.properties?.hashed_token;
    if (tokenHash) {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: 'magiclink',
      });

      if (verifyError) {
        console.error('OTP verification failed:', verifyError);
        return { success: false, error: 'Session creation failed' };
      }
    }

    return { success: true, cookies: storedCookies };
  } catch (error) {
    console.error('Session creation error:', error);
    return { success: false, error: 'Unexpected error during session creation' };
  }
}

/**
 * Redirects to login page with an error message
 */
function redirectWithError(request: NextRequest, message: string): NextResponse {
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('error', encodeURIComponent(message));
  return NextResponse.redirect(loginUrl);
}
