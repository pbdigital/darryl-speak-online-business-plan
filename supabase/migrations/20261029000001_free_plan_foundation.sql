-- Free Business Plan foundation (MYP-83).
-- Adds account types and locking to profiles, a plan_events log for Keap sync,
-- and an RLS backstop that stops locked users writing their plan.

-- Account type. Every existing user is a POWER AGENT member and must never be
-- lockable, so the column is added with 'member' (which backfills every row)
-- and the default for new rows then switches to 'free'.
alter table public.profiles
  add column account_type text not null default 'member'
    constraint profiles_account_type_check check (account_type in ('member', 'free'));

alter table public.profiles
  alter column account_type set default 'free';

alter table public.profiles
  add column locked_at timestamptz,
  add column lock_source text,
  add column keap_contact_id text;

comment on column public.profiles.account_type is 'member (POWER AGENT) or free. Only the service role can change it.';
comment on column public.profiles.locked_at is 'When plan editing was locked. Null means open.';
comment on column public.profiles.lock_source is 'What set the lock, for example keap or admin.';
comment on column public.profiles.keap_contact_id is 'Keap contact ID for this user.';

-- Users keep their column-level grants from 20260723070000 (first_name,
-- last_name, wordpress_user_id). The new columns get no insert or update grant
-- for anon or authenticated, so only the service role can set them. Admin
-- changes go through the service-role edge functions, as admin-team does.

-- New users are free unless the service role created them with
-- app_metadata.account_type = 'member'. Users cannot set app_metadata
-- themselves, so they cannot claim membership at sign-up.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, first_name, last_name, account_type)
  values (
    new.id,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    case
      when new.raw_app_meta_data->>'account_type' = 'member' then 'member'
      else 'free'
    end
  );
  return new;
end;
$$ language plpgsql security definer;

-- Plan events, written by the service role and synced to Keap.
create table public.plan_events (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  event_key text not null,
  created_at timestamptz default now() not null,
  keap_synced_at timestamptz,
  keap_error text,

  unique(user_id, event_key)
);

alter table public.plan_events enable row level security;

create policy "Users can view own plan events"
  on public.plan_events for select
  using (auth.uid() = user_id);

revoke insert, update, delete, truncate on table public.plan_events from anon, authenticated;

-- RLS backstop: a locked user cannot create or change plans or sections.
-- Reads and the service role are unaffected.
create or replace function public.is_plan_locked()
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select coalesce(
    (select locked_at is not null from public.profiles where id = auth.uid()),
    false
  )
$$;

create policy "Locked users cannot create plans"
  on public.business_plans
  as restrictive
  for insert
  with check (not public.is_plan_locked());

create policy "Locked users cannot update plans"
  on public.business_plans
  as restrictive
  for update
  using (not public.is_plan_locked())
  with check (not public.is_plan_locked());

create policy "Locked users cannot create plan sections"
  on public.plan_sections
  as restrictive
  for insert
  with check (not public.is_plan_locked());

create policy "Locked users cannot update plan sections"
  on public.plan_sections
  as restrictive
  for update
  using (not public.is_plan_locked())
  with check (not public.is_plan_locked());
