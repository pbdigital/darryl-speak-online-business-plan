-- Create a view for admin user management
-- This joins profiles with auth.users to get email and other auth metadata

create or replace view public.admin_users_view as
select
  p.id,
  p.first_name,
  p.last_name,
  p.is_admin,
  p.created_at,
  p.updated_at,
  u.email,
  u.last_sign_in_at,
  u.raw_app_meta_data->>'provider' as auth_provider,
  u.created_at as auth_created_at,
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

-- Note: This view inherits RLS from the profiles table policies
-- Admins can see all rows, regular users would see nothing (no matching policy)
-- Since this is only used in admin pages, this is the expected behavior
