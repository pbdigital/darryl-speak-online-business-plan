-- Admin Team Management
-- Adds audit columns for tracking who granted/revoked admin access and when
-- Also adds RLS policy for admins to update admin status

-- Add audit columns to profiles table
alter table public.profiles
  add column admin_granted_at timestamptz,
  add column admin_granted_by uuid references public.profiles(id),
  add column admin_revoked_at timestamptz,
  add column admin_revoked_by uuid references public.profiles(id);

-- Backfill existing admin with audit fields
-- Find the current admin and set them as self-granted (bootstrap)
update public.profiles
set
  admin_granted_at = now(),
  admin_granted_by = id
where is_admin = true
  and admin_granted_at is null;

-- RLS policy: Admins can update admin-related columns on other profiles
-- This allows granting/revoking admin status
create policy "Admins can update admin status"
  on public.profiles for update
  using (public.is_admin())
  with check (public.is_admin());

-- Update the admin_users_view to include audit fields
drop view if exists public.admin_users_view;

create view public.admin_users_view as
select
  p.id,
  p.first_name,
  p.last_name,
  p.is_admin,
  p.admin_granted_at,
  p.admin_granted_by,
  p.admin_revoked_at,
  p.admin_revoked_by,
  p.created_at,
  p.updated_at,
  u.email,
  u.last_sign_in_at,
  u.raw_app_meta_data->>'provider' as auth_provider,
  u.created_at as auth_created_at,
  -- Get the name of who granted admin
  (
    select concat_ws(' ', granter.first_name, granter.last_name)
    from public.profiles granter
    where granter.id = p.admin_granted_by
  ) as granted_by_name,
  -- Calculate plan completion (5 sections total)
  (
    select count(*)::int
    from public.plan_sections ps
    join public.business_plans bp on bp.id = ps.business_plan_id
    where bp.user_id = p.id
    and ps.data != '{}'::jsonb
    and jsonb_typeof(ps.data) = 'object'
  ) as sections_completed,
  -- Total sections constant
  5 as total_sections,
  -- Check if user has a business plan
  exists(
    select 1 from public.business_plans bp
    where bp.user_id = p.id
  ) as has_plan
from public.profiles p
left join auth.users u on u.id = p.id;

-- Grant access to authenticated users (RLS will handle admin check)
grant select on public.admin_users_view to authenticated;

-- Add comment documenting the purpose
comment on column public.profiles.admin_granted_at is 'When admin access was granted';
comment on column public.profiles.admin_granted_by is 'User ID of admin who granted access';
comment on column public.profiles.admin_revoked_at is 'When admin access was revoked (if ever)';
comment on column public.profiles.admin_revoked_by is 'User ID of admin who revoked access';
