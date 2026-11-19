import { type NextRequest, type NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { hasUtm, pickUtm, serializeUtm, UTM_COOKIE, UTM_COOKIE_MAX_AGE } from '@/lib/utm';

export async function middleware(request: NextRequest) {
  const response = await updateSession(request);
  rememberUtm(request, response);
  return response;
}

/**
 * Keeps the first ad click's utm values for 30 days, so the sign-up can be
 * credited to it. Readable by the page, which copies it into the sign-up.
 */
function rememberUtm(request: NextRequest, response: NextResponse) {
  if (request.cookies.has(UTM_COOKIE)) return;

  const utm = pickUtm((key) => request.nextUrl.searchParams.get(key));
  if (!hasUtm(utm)) return;

  response.cookies.set(UTM_COOKIE, serializeUtm(utm), {
    maxAge: UTM_COOKIE_MAX_AGE,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
