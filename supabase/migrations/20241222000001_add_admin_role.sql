-- Add is_admin field to profiles table
alter table public.profiles add column is_admin boolean default false not null;

-- Create index for admin lookups
create index profiles_is_admin_idx on public.profiles(is_admin) where is_admin = true;

-- RLS policy: Admins can view all profiles
create policy "Admins can view all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles admin_profile
      where admin_profile.id = auth.uid()
      and admin_profile.is_admin = true
    )
  );

-- RLS policy: Admins can view all business plans
create policy "Admins can view all plans"
  on public.business_plans for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.is_admin = true
    )
  );

-- RLS policy: Admins can view all plan sections
create policy "Admins can view all plan sections"
  on public.plan_sections for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid()
      and profiles.is_admin = true
    )
  );

-- Note: To bootstrap the first admin, run this in Supabase SQL Editor:
-- UPDATE public.profiles SET is_admin = true WHERE id = 'USER_UUID_HERE';
-- Or by email:
-- UPDATE public.profiles SET is_admin = true
-- WHERE id = (SELECT id FROM auth.users WHERE email = 'sarah@darrylspeaks.com');
