-- Free plan sign-up and POWER AGENT linking (MYP-83).

-- wordpress_user_id decides which account a POWER AGENT SSO sign-in lands in.
-- Only the service role (the SSO callback) may set it. If users could write
-- it, a free user could copy a member's WordPress ID and take over that
-- member's SSO sign-in.
revoke insert (wordpress_user_id), update (wordpress_user_id)
  on table public.profiles
  from anon, authenticated;

-- Finds the auth user for an email, so SSO linking sees every user rather
-- than the first page of auth.admin.listUsers(). Service role only: it must
-- never be callable by the public, or it would reveal who has an account.
create or replace function public.get_auth_user_id_by_email(p_email text)
returns uuid
language sql
security definer
stable
set search_path = ''
as $$
  select id
  from auth.users
  where lower(email) = lower(trim(p_email))
  order by created_at
  limit 1
$$;

revoke all on function public.get_auth_user_id_by_email(text) from public, anon, authenticated;
grant execute on function public.get_auth_user_id_by_email(text) to service_role;
