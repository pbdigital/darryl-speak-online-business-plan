import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Test the connection by checking auth status
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // Test database connection by querying auth.users (always exists)
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    // Connection works if we can reach Supabase at all (even without being logged in)
    const connectionWorks = !authError || authError.message !== 'fetch failed';

    return NextResponse.json({
      success: true,
      data: {
        connection: connectionWorks ? 'OK' : 'FAILED',
        authenticated: !!user,
        user: user ? { id: user.id, email: user.email } : null,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasSession: !!sessionData?.session,
        authError: authError ? { message: authError.message } : null,
      },
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      errors: [{ message: error instanceof Error ? error.message : 'Unknown error' }],
    }, { status: 500 });
  }
}
