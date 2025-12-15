import { createClient } from '@supabase/supabase-js';
import type { PowerAgentJwtPayload } from './jwt';

export interface AccountLinkingResult {
  success: boolean;
  userId?: string;
  error?: string;
  errorCode?: 'CONFLICT' | 'DB_ERROR' | 'AUTH_ERROR';
}

/**
 * Links a Power Agent WordPress account to a Supabase account.
 *
 * Scenarios handled:
 * 1. WordPress ID already linked → Sign in that user
 * 2. Email exists, no WP ID → Link accounts (update profile with wordpress_user_id)
 * 3. Email exists, different WP ID → Error (contact support)
 * 4. Email doesn't exist → Create new user + profile with wordpress_user_id
 */
export async function linkPowerAgentAccount(
  payload: PowerAgentJwtPayload
): Promise<AccountLinkingResult> {
  // Use service role client for admin operations
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Supabase credentials not configured');
    return {
      success: false,
      error: 'Server configuration error',
      errorCode: 'DB_ERROR',
    };
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  try {
    // Step 1: Check if a profile with this wordpress_user_id already exists
    const { data: existingWpProfile, error: wpCheckError } = await supabase
      .from('profiles')
      .select('id, wordpress_user_id, first_name, last_name')
      .eq('wordpress_user_id', payload.sub)
      .maybeSingle();

    if (wpCheckError) {
      console.error('Error checking WordPress ID:', wpCheckError);
      return {
        success: false,
        error: 'Database error',
        errorCode: 'DB_ERROR',
      };
    }

    // If WordPress ID already linked to an account, return that user
    if (existingWpProfile) {
      return {
        success: true,
        userId: existingWpProfile.id,
      };
    }

    // Step 2: Check if a user with this email already exists (via auth.users)
    const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();

    if (usersError) {
      console.error('Error listing users:', usersError);
      return {
        success: false,
        error: 'Database error',
        errorCode: 'DB_ERROR',
      };
    }

    const existingUser = usersData.users.find(
      (user) => user.email?.toLowerCase() === payload.email.toLowerCase()
    );

    if (existingUser) {
      // User with this email exists - check their profile for WordPress ID
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id, wordpress_user_id, first_name, last_name')
        .eq('id', existingUser.id)
        .maybeSingle();

      if (profileError) {
        console.error('Error checking profile:', profileError);
        return {
          success: false,
          error: 'Database error',
          errorCode: 'DB_ERROR',
        };
      }

      if (existingProfile?.wordpress_user_id && existingProfile.wordpress_user_id !== payload.sub) {
        // Different WordPress ID linked to this email - conflict!
        return {
          success: false,
          error: 'This email is already linked to a different Power Agent account. Please contact support.',
          errorCode: 'CONFLICT',
        };
      }

      // Email exists but no WordPress ID (or same WP ID) - link accounts
      if (!existingProfile) {
        // Profile doesn't exist yet, create it
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: existingUser.id,
            first_name: payload.first_name,
            last_name: payload.last_name,
            wordpress_user_id: payload.sub,
          });

        if (insertError) {
          console.error('Error creating profile:', insertError);
          // Continue anyway - user can still sign in
        }
      } else if (!existingProfile.wordpress_user_id) {
        // Profile exists but no WordPress ID - update it
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            wordpress_user_id: payload.sub,
            first_name: payload.first_name || existingProfile.first_name,
            last_name: payload.last_name || existingProfile.last_name,
          })
          .eq('id', existingUser.id);

        if (updateError) {
          console.error('Error linking account:', updateError);
          return {
            success: false,
            error: 'Failed to link accounts',
            errorCode: 'DB_ERROR',
          };
        }
      }

      return {
        success: true,
        userId: existingUser.id,
      };
    }

    // Step 3: No existing account - create new user
    const { data: newUser, error: createUserError } = await supabase.auth.admin.createUser({
      email: payload.email,
      email_confirm: true, // Auto-confirm since they verified via Power Agent
      user_metadata: {
        first_name: payload.first_name,
        last_name: payload.last_name,
        wordpress_user_id: payload.sub,
      },
    });

    if (createUserError) {
      console.error('Error creating user:', createUserError);
      return {
        success: false,
        error: 'Failed to create account',
        errorCode: 'AUTH_ERROR',
      };
    }

    // The profile should be created automatically by the trigger,
    // but we need to add the wordpress_user_id
    const { error: updateProfileError } = await supabase
      .from('profiles')
      .update({
        wordpress_user_id: payload.sub,
      })
      .eq('id', newUser.user.id);

    if (updateProfileError) {
      console.error('Error updating profile with WordPress ID:', updateProfileError);
      // Continue anyway - the user was created successfully
    }

    return {
      success: true,
      userId: newUser.user.id,
    };
  } catch (error) {
    console.error('Account linking error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred',
      errorCode: 'DB_ERROR',
    };
  }
}
