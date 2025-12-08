import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Test the connection by checking auth status
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // Also try to query the database (this will work even without tables)
    const { error: dbError } = await supabase.from('_test_connection').select('*').limit(1);

    // dbError with code 42P01 means table doesn't exist, which is fine - connection works
    const connectionWorks = !dbError || dbError.code === '42P01' || dbError.code === 'PGRST116';

    return NextResponse.json({
      success: true,
      data: {
        connection: connectionWorks ? 'OK' : 'FAILED',
        authenticated: !!user,
        user: user ? { id: user.id, email: user.email } : null,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
        dbError: dbError ? { code: dbError.code, message: dbError.message } : null,
      },
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      errors: [{ message: error instanceof Error ? error.message : 'Unknown error' }],
    }, { status: 500 });
  }
}
