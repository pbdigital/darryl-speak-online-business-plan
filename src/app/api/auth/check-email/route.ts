import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          errors: [{ field: 'email', message: 'Invalid email address' }],
        },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check if user exists in profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', parsed.data.email)
      .maybeSingle();

    if (error) {
      console.error('Error checking email:', error);
      return NextResponse.json(
        {
          success: false,
          errors: [{ message: 'Unable to check email' }],
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { exists: !!data },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        errors: [{ message: 'An unexpected error occurred' }],
      },
      { status: 500 }
    );
  }
}
