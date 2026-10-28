import { randomBytes } from 'crypto';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { PowerAgentJwtPayload } from './jwt';

export interface AccountLinkingResult {
  success: boolean;
  userId?: string;
  upgradedFromFree?: boolean; // a free account just became a member
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
 *
 * In every successful case the account becomes a member and is unlocked, so a
 * free user who joins POWER AGENT keeps their existing plan.
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
      return markAsMember(supabase, existingWpProfile.id);
    }

    // Step 2: Check if a user with this email already exists (via auth.users)
    const { data: existingUserId, error: lookupError } = await supabase.rpc(
      'get_auth_user_id_by_email',
      { p_email: payload.email }
    );

    if (lookupError) {
      console.error('Error looking up email:', lookupError);
      return {
        success: false,
        error: 'Database error',
        errorCode: 'DB_ERROR',
      };
    }

    const existingUser = existingUserId ? { id: existingUserId as string } : null;

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

      return markAsMember(supabase, existingUser.id);
    }

    // Step 3: No existing account - create new user
    const { data: newUser, error: createUserError } = await supabase.auth.admin.createUser({
      email: payload.email,
      email_confirm: true, // Auto-confirm since they verified via Power Agent
      app_metadata: { account_type: 'member' },
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

    // GoTrue saves app_metadata after the insert trigger runs, so the new
    // profile starts as free. markAsMember fixes that; it is not an upgrade.
    return { ...(await markAsMember(supabase, newUser.user.id)), upgradedFromFree: false };
  } catch (error) {
    console.error('Account linking error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred',
      errorCode: 'DB_ERROR',
    };
  }
}

/**
 * Makes the account a POWER AGENT member and clears any lock. Signing in
 * through POWER AGENT always unlocks, whatever Keap did before.
 *
 * If the email was never confirmed, someone else may have signed up with this
 * member's address and chosen the password. The SSO sign-in confirms the
 * email, so the password is replaced first to shut that person out. The
 * member can set their own with "Forgotten your password?".
 */
async function markAsMember(
  supabase: SupabaseClient,
  userId: string
): Promise<AccountLinkingResult> {
  const { data: userData, error: getUserError } = await supabase.auth.admin.getUserById(userId);

  if (getUserError || !userData.user) {
    console.error('Error loading user to mark as member:', getUserError);
    return { success: false, error: 'Database error', errorCode: 'DB_ERROR' };
  }

  const { error: authError } = await supabase.auth.admin.updateUserById(userId, {
    app_metadata: { account_type: 'member' },
    ...(userData.user.email_confirmed_at
      ? {}
      : { email_confirm: true, password: randomBytes(32).toString('base64url') }),
  });

  if (authError) {
    console.error('Error marking auth user as member:', authError);
    return { success: false, error: 'Database error', errorCode: 'DB_ERROR' };
  }

  const { data: before, error: readError } = await supabase
    .from('profiles')
    .select('account_type')
    .eq('id', userId)
    .maybeSingle();

  if (readError) {
    console.error('Error reading profile before marking as member:', readError);
    return { success: false, error: 'Database error', errorCode: 'DB_ERROR' };
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .update({ account_type: 'member', locked_at: null, lock_source: null })
    .eq('id', userId);

  if (profileError) {
    console.error('Error marking profile as member:', profileError);
    return { success: false, error: 'Database error', errorCode: 'DB_ERROR' };
  }

  return { success: true, userId, upgradedFromFree: before?.account_type === 'free' };
}
