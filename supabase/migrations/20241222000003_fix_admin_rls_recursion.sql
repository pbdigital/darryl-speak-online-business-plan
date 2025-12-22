-- Fix infinite recursion in admin RLS policies
-- The issue: policies on profiles table were querying profiles table to check admin status

-- Drop the problematic policies
drop policy if exists "Admins can view all profiles" on public.profiles;
drop policy if exists "Admins can view all plans" on public.business_plans;
drop policy if exists "Admins can view all plan sections" on public.plan_sections;

-- Create a security definer function to check admin status
-- This bypasses RLS and prevents recursion
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select coalesce(
    (select is_admin from public.profiles where id = auth.uid()),
    false
  )
$$;

-- Recreate policies using the function
create policy "Admins can view all profiles"
  on public.profiles for select
  using (public.is_admin());

create policy "Admins can view all plans"
  on public.business_plans for select
  using (public.is_admin());

create policy "Admins can view all plan sections"
  on public.plan_sections for select
  using (public.is_admin());
