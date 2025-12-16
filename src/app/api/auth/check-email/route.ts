import { createClient } from '@supabase/supabase-js';
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

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        {
          success: false,
          errors: [{ message: 'Server configuration error' }],
        },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Check if user exists in auth.users via admin API
    const { data: usersData, error } = await supabase.auth.admin.listUsers();

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

    const user = usersData.users.find(
      (u) => u.email?.toLowerCase() === parsed.data.email.toLowerCase()
    );

    const exists = !!user;
    let isPowerAgentLinked = false;

    // If user exists, check if they have a linked Power Agent account
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('wordpress_user_id')
        .eq('id', user.id)
        .single();

      isPowerAgentLinked = !!profile?.wordpress_user_id;
    }

    return NextResponse.json({
      success: true,
      data: { exists, isPowerAgentLinked },
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
