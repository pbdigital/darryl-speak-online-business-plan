begin;

create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;

select plan(29);

-- Account type backfill and defaults

select is(
  (
    select attmissingval::text
    from pg_attribute
    where attrelid = 'public.profiles'::regclass
      and attname = 'account_type'
  ),
  '{member}',
  'profiles that existed before the migration read as member'
);

select col_not_null('public', 'profiles', 'account_type', 'account_type is never null');
select col_default_is('public', 'profiles', 'account_type', 'free', 'new profile rows default to free');

select throws_ok(
  $$ insert into public.profiles (id, account_type) values (gen_random_uuid(), 'gold') $$,
  '23514',
  null,
  'account_type only allows member or free'
);

-- Test users. The on_auth_user_created trigger creates their profiles.
insert into auth.users (id, instance_id, aud, role, email, raw_app_meta_data, raw_user_meta_data)
values
  ('00000000-0000-0000-0000-0000000000a1', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'free@example.test', '{"provider":"email"}', '{"first_name":"Free"}'),
  ('00000000-0000-0000-0000-0000000000a2', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'member@example.test', '{"provider":"email","account_type":"member"}', '{}'),
  ('00000000-0000-0000-0000-0000000000a3', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'claimer@example.test', '{"provider":"email"}', '{"account_type":"member"}');

select is(
  (select account_type from public.profiles where id = '00000000-0000-0000-0000-0000000000a1'),
  'free',
  'a new user defaults to free'
);

select is(
  (select first_name from public.profiles where id = '00000000-0000-0000-0000-0000000000a1'),
  'Free',
  'handle_new_user still copies the first name'
);

select is(
  (select account_type from public.profiles where id = '00000000-0000-0000-0000-0000000000a2'),
  'member',
  'app_metadata account_type member makes a member'
);

select is(
  (select account_type from public.profiles where id = '00000000-0000-0000-0000-0000000000a3'),
  'free',
  'user_metadata cannot claim membership'
);

-- Plans for user a1 (later locked) and a2 (stays open)
insert into public.business_plans (id, user_id, year) values
  ('00000000-0000-0000-0000-0000000000b1', '00000000-0000-0000-0000-0000000000a1', 2026),
  ('00000000-0000-0000-0000-0000000000b2', '00000000-0000-0000-0000-0000000000a2', 2026);

insert into public.plan_sections (business_plan_id, section_key, data) values
  ('00000000-0000-0000-0000-0000000000b1', 'reflection', '{"v":1}'),
  ('00000000-0000-0000-0000-0000000000b2', 'reflection', '{"v":1}');

insert into public.plan_events (user_id, event_key) values
  ('00000000-0000-0000-0000-0000000000a1', 'signed_up'),
  ('00000000-0000-0000-0000-0000000000a2', 'signed_up');

-- Act as user a1 (free, not yet locked)
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a1","role":"authenticated"}', true);

select throws_ok(
  $$ update public.profiles set account_type = 'member' where id = auth.uid() $$,
  '42501',
  null,
  'a user cannot change their account_type'
);

select throws_ok(
  $$ update public.profiles set locked_at = null where id = auth.uid() $$,
  '42501',
  null,
  'a user cannot change their locked_at'
);

select throws_ok(
  $$ update public.profiles set lock_source = null where id = auth.uid() $$,
  '42501',
  null,
  'a user cannot change their lock_source'
);

select throws_ok(
  $$ update public.profiles set keap_contact_id = '1' where id = auth.uid() $$,
  '42501',
  null,
  'a user cannot change their keap_contact_id'
);

select throws_ok(
  $$ insert into public.profiles (id, account_type) values (auth.uid(), 'member') $$,
  '42501',
  null,
  'a user cannot insert a profile with an account_type'
);

select lives_ok(
  $$ update public.profiles set first_name = 'Freda' where id = auth.uid() $$,
  'a user can still update their name'
);

-- Unlocked user can write
select lives_ok(
  $$ update public.plan_sections set data = '{"v":2}'
     where business_plan_id = '00000000-0000-0000-0000-0000000000b1' $$,
  'an unlocked user can update a section'
);

select lives_ok(
  $$ insert into public.plan_sections (business_plan_id, section_key, data)
     values ('00000000-0000-0000-0000-0000000000b1', 'goals', '{}') $$,
  'an unlocked user can create a section'
);

select lives_ok(
  $$ insert into public.business_plans (user_id, year) values (auth.uid(), 2027) $$,
  'an unlocked user can create a plan'
);

-- plan_events: owners read their own rows, nobody but the service role writes
select results_eq(
  $$ select event_key from public.plan_events $$,
  $$ values ('signed_up') $$,
  'a user sees only their own plan events'
);

select throws_ok(
  $$ insert into public.plan_events (user_id, event_key) values (auth.uid(), 'plan_done') $$,
  '42501',
  null,
  'a user cannot insert plan events'
);

-- Service role locks user a1
reset role;
set local role service_role;

select lives_ok(
  $$ update public.profiles set locked_at = now(), lock_source = 'keap'
     where id = '00000000-0000-0000-0000-0000000000a1' $$,
  'the service role can lock a user'
);

-- Act as locked user a1
reset role;
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a1","role":"authenticated"}', true);

select results_eq(
  $$ select count(*) from public.plan_sections
     where business_plan_id = '00000000-0000-0000-0000-0000000000b1' $$,
  $$ values (2::bigint) $$,
  'a locked user can still read their sections'
);

select results_eq(
  $$ with changed as (
       update public.plan_sections set data = '{"v":3}'
       where business_plan_id = '00000000-0000-0000-0000-0000000000b1'
       returning 1
     )
     select count(*) from changed $$,
  $$ values (0::bigint) $$,
  'a locked user cannot update a section'
);

select throws_ok(
  $$ insert into public.plan_sections (business_plan_id, section_key, data)
     values ('00000000-0000-0000-0000-0000000000b1', 'vision', '{}') $$,
  '42501',
  null,
  'a locked user cannot create a section'
);

select results_eq(
  $$ with changed as (
       update public.business_plans set year = 2030
       where id = '00000000-0000-0000-0000-0000000000b1'
       returning 1
     )
     select count(*) from changed $$,
  $$ values (0::bigint) $$,
  'a locked user cannot update a plan'
);

select throws_ok(
  $$ insert into public.business_plans (user_id, year) values (auth.uid(), 2028) $$,
  '42501',
  null,
  'a locked user cannot create a plan'
);

-- Act as user a2 (member, never locked)
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a2","role":"authenticated"}', true);

select results_eq(
  $$ with changed as (
       update public.plan_sections set data = '{"v":2}'
       where business_plan_id = '00000000-0000-0000-0000-0000000000b2'
       returning 1
     )
     select count(*) from changed $$,
  $$ values (1::bigint) $$,
  'another user is unaffected by the lock'
);

-- Service role unlocks user a1
reset role;
set local role service_role;

select lives_ok(
  $$ update public.profiles set locked_at = null, lock_source = null
     where id = '00000000-0000-0000-0000-0000000000a1' $$,
  'the service role can unlock a user'
);

reset role;
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000a1","role":"authenticated"}', true);

select results_eq(
  $$ with changed as (
       update public.plan_sections set data = '{"v":4}'
       where business_plan_id = '00000000-0000-0000-0000-0000000000b1'
         and section_key = 'reflection'
       returning 1
     )
     select count(*) from changed $$,
  $$ values (1::bigint) $$,
  'an unlocked user can write again'
);

reset role;

select is(
  (select data from public.plan_sections
   where business_plan_id = '00000000-0000-0000-0000-0000000000b1' and section_key = 'reflection'),
  '{"v":4}'::jsonb,
  'the locked update left no trace and the unlocked one landed'
);

select * from finish();
rollback;
