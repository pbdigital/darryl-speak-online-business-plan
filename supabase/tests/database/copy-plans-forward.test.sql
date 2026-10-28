begin;

create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;

select plan(26);

-- Synthetic years far from real data, so counts are exact whatever else is in
-- the local database. The function takes the years as arguments, so 2090 to
-- 2091 exercises the same code as 2026 to 2027.

insert into auth.users (id, instance_id, aud, role, email, raw_app_meta_data, raw_user_meta_data)
values
  ('00000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'copy-one@example.test', '{"provider":"email","account_type":"member"}', '{}'),
  ('00000000-0000-0000-0000-0000000000c2', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'copy-two@example.test', '{"provider":"email","account_type":"member"}', '{}'),
  ('00000000-0000-0000-0000-0000000000c3', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'copy-three@example.test', '{"provider":"email","account_type":"member"}', '{}'),
  ('00000000-0000-0000-0000-0000000000c4', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'copy-four@example.test', '{"provider":"email","account_type":"member"}', '{}'),
  ('00000000-0000-0000-0000-0000000000c5', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'copy-five@example.test', '{"provider":"email","account_type":"member"}', '{}');

-- c3 is locked: the copy must still reach locked users.
update public.profiles set locked_at = now(), lock_source = 'test'
where id = '00000000-0000-0000-0000-0000000000c3';

-- c1: 2090 plan with four sections (signature dates set), no 2091 plan.
-- c2: 2090 plan with two sections and its own 2091 plan (made a day earlier).
-- c3: 2090 plan with no sections.
-- c4: only a 2089 plan.
-- c5: 2090 plan whose reflection and accountability sections have no date keys.
insert into public.business_plans (id, user_id, year, created_at, updated_at) values
  ('00000000-0000-0000-0000-00000000b101', '00000000-0000-0000-0000-0000000000c1', 2090, now() - interval '300 days', now() - interval '10 days'),
  ('00000000-0000-0000-0000-00000000b201', '00000000-0000-0000-0000-0000000000c2', 2090, now() - interval '300 days', now() - interval '10 days'),
  ('00000000-0000-0000-0000-00000000b202', '00000000-0000-0000-0000-0000000000c2', 2091, now() - interval '1 day', now() - interval '1 day'),
  ('00000000-0000-0000-0000-00000000b301', '00000000-0000-0000-0000-0000000000c3', 2090, now() - interval '300 days', now() - interval '10 days'),
  ('00000000-0000-0000-0000-00000000b401', '00000000-0000-0000-0000-0000000000c4', 2089, now() - interval '600 days', now() - interval '400 days'),
  ('00000000-0000-0000-0000-00000000b501', '00000000-0000-0000-0000-0000000000c5', 2090, now() - interval '300 days', now() - interval '10 days');

insert into public.plan_sections (business_plan_id, section_key, data, updated_at) values
  ('00000000-0000-0000-0000-00000000b101', 'reflection', '{"mantra":"Grow","completionDate":"2090-11-02"}', now() - interval '20 days'),
  ('00000000-0000-0000-0000-00000000b101', 'swot', '{"strengths":["Follow up"]}', now() - interval '15 days'),
  ('00000000-0000-0000-0000-00000000b101', 'income-planning', '{"taxRate":25}', now() - interval '10 days'),
  ('00000000-0000-0000-0000-00000000b101', 'accountability',
   '{"idealClients":[{"name":"First-time buyers"}],"commitmentContract":{"agentName":"Pat","transactionGoal":24,"agentSignatureDate":"2090-11-05","partnerSignatureDate":"2090-11-06","accountabilityPartnerName":"Sam"}}',
   now() - interval '10 days'),
  ('00000000-0000-0000-0000-00000000b501', 'reflection', '{"mantra":"No date yet"}', now() - interval '10 days'),
  ('00000000-0000-0000-0000-00000000b501', 'accountability', '{"idealClients":[]}', now() - interval '10 days'),
  ('00000000-0000-0000-0000-00000000b201', 'reflection', '{"mantra":"Old"}', now() - interval '20 days'),
  ('00000000-0000-0000-0000-00000000b201', 'swot', '{"strengths":["Old"]}', now() - interval '20 days'),
  ('00000000-0000-0000-0000-00000000b202', 'reflection', '{"mantra":"Already started 2091"}', now() - interval '1 day'),
  ('00000000-0000-0000-0000-00000000b401', 'reflection', '{"mantra":"Ancient"}', now() - interval '400 days');

-- Shape and permissions

select is(
  (select prosecdef from pg_proc where oid = 'public.copy_plans_forward(integer, integer)'::regprocedure),
  true,
  'copy_plans_forward is security definer'
);

select is(
  (select proconfig from pg_proc where oid = 'public.copy_plans_forward(integer, integer)'::regprocedure),
  array['search_path=""'],
  'copy_plans_forward pins an empty search_path'
);

select ok(
  not has_function_privilege('anon', 'public.copy_plans_forward(integer, integer)', 'execute'),
  'anon cannot execute copy_plans_forward'
);

select ok(
  not has_function_privilege('authenticated', 'public.copy_plans_forward(integer, integer)', 'execute'),
  'authenticated cannot execute copy_plans_forward'
);

select ok(
  has_function_privilege('service_role', 'public.copy_plans_forward(integer, integer)', 'execute'),
  'service_role can execute copy_plans_forward'
);

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000c1","role":"authenticated"}', true);

select throws_ok(
  $$ select * from public.copy_plans_forward(2090, 2091) $$,
  '42501',
  null,
  'a signed-in user calling copy_plans_forward is refused'
);

reset role;
set local role anon;

select throws_ok(
  $$ select * from public.copy_plans_forward(2090, 2091) $$,
  '42501',
  null,
  'an anonymous caller is refused'
);

reset role;
set local role service_role;

select throws_ok(
  $$ select * from public.copy_plans_forward(2091, 2090) $$,
  '22023',
  null,
  'copying backwards is refused'
);

-- First run

create temp table first_run as select * from public.copy_plans_forward(2090, 2091);

select results_eq(
  $$ select plans_created, sections_copied, users_skipped from first_run $$,
  $$ values (3, 6, 1) $$,
  'first run creates 3 plans, copies 6 sections and skips the user who already had 2091'
);

select is(
  (select run_at from first_run),
  now(),
  'run_at is the transaction start time'
);

select set_eq(
  $$ select s.section_key, s.data from public.plan_sections s
     join public.business_plans p on p.id = s.business_plan_id
     where p.user_id = '00000000-0000-0000-0000-0000000000c1' and p.year = 2091 $$,
  $$ values
       ('reflection'::text, '{"mantra":"Grow","completionDate":""}'::jsonb),
       ('swot', '{"strengths":["Follow up"]}'),
       ('income-planning', '{"taxRate":25}'),
       ('accountability', '{"idealClients":[{"name":"First-time buyers"}],"commitmentContract":{"agentName":"Pat","transactionGoal":24,"agentSignatureDate":"","partnerSignatureDate":"","accountabilityPartnerName":"Sam"}}') $$,
  'every section is copied, with the three signature dates cleared to empty strings'
);

select set_eq(
  $$ select s.section_key, s.data from public.plan_sections s
     join public.business_plans p on p.id = s.business_plan_id
     where p.user_id = '00000000-0000-0000-0000-0000000000c1' and p.year = 2091
       and s.section_key in ('swot', 'income-planning') $$,
  $$ select s.section_key, s.data from public.plan_sections s
     where s.business_plan_id = '00000000-0000-0000-0000-00000000b101'
       and s.section_key in ('swot', 'income-planning') $$,
  'sections without signature dates are copied identically'
);

select set_eq(
  $$ select s.section_key, s.data from public.plan_sections s
     join public.business_plans p on p.id = s.business_plan_id
     where p.user_id = '00000000-0000-0000-0000-0000000000c5' and p.year = 2091 $$,
  $$ select s.section_key, s.data from public.plan_sections s
     where s.business_plan_id = '00000000-0000-0000-0000-00000000b501' $$,
  'reflection and accountability sections without the date keys are copied unchanged (no keys added)'
);

select is(
  (select data -> 'commitmentContract' ->> 'agentSignatureDate' from public.plan_sections
   where business_plan_id = '00000000-0000-0000-0000-00000000b101' and section_key = 'accountability'),
  '2090-11-05',
  'the 2090 accountability section keeps its signature date'
);

select is(
  (select data ->> 'completionDate' from public.plan_sections
   where business_plan_id = '00000000-0000-0000-0000-00000000b101' and section_key = 'reflection'),
  '2090-11-02',
  'the 2090 reflection section keeps its completion date'
);

select ok(
  (select bool_and(p.created_at = f.run_at and p.updated_at = f.run_at)
   from public.business_plans p, first_run f
   where p.year = 2091 and p.user_id in ('00000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-0000000000c3', '00000000-0000-0000-0000-0000000000c5')),
  'new plans carry created_at and updated_at = run_at'
);

select ok(
  (select bool_and(s.updated_at = f.run_at)
   from public.plan_sections s
   join public.business_plans p on p.id = s.business_plan_id, first_run f
   where p.year = 2091 and p.user_id = '00000000-0000-0000-0000-0000000000c1'),
  'copied sections carry updated_at = run_at'
);

select results_eq(
  $$ select id, section_key, data from public.plan_sections
     where business_plan_id = '00000000-0000-0000-0000-00000000b202' $$,
  $$ select s.id, 'reflection'::text, '{"mantra":"Already started 2091"}'::jsonb
     from public.plan_sections s where s.business_plan_id = '00000000-0000-0000-0000-00000000b202' $$,
  'the user who already had 2091 keeps exactly their own section'
);

select is(
  (select count(*)::int from public.business_plans
   where user_id = '00000000-0000-0000-0000-0000000000c2' and year = 2091),
  1,
  'the user who already had 2091 still has one 2091 plan'
);

select is(
  (select count(*)::int from public.plan_sections s
   join public.business_plans p on p.id = s.business_plan_id
   where p.user_id = '00000000-0000-0000-0000-0000000000c3' and p.year = 2091),
  0,
  'the locked user with an empty plan gets a 2091 plan and no sections'
);

select is(
  (select count(*)::int from public.business_plans
   where user_id = '00000000-0000-0000-0000-0000000000c4' and year in (2090, 2091)),
  0,
  'a user without a 2090 plan gets nothing'
);

select is(
  (select count(*)::int from public.plan_sections
   where business_plan_id in ('00000000-0000-0000-0000-00000000b101', '00000000-0000-0000-0000-00000000b201')),
  6,
  'the 2090 sections are left in place'
);

-- Second run is a no-op

select results_eq(
  $$ select plans_created, sections_copied, users_skipped from public.copy_plans_forward(2090, 2091) $$,
  $$ values (0, 0, 4) $$,
  'a second run creates nothing and skips all four users'
);

select is(
  (select count(*)::int from public.plan_sections s
   join public.business_plans p on p.id = s.business_plan_id
   where p.year = 2091 and p.user_id::text like '00000000-0000-0000-0000-0000000000c%'),
  7,
  'after the second run there are still exactly 7 sections on 2091 plans'
);

-- Rollback as the runbook does it: delete the to_year plans created at run_at.

reset role;

delete from public.business_plans
where year = 2091 and created_at = (select run_at from first_run);

select is(
  (select count(*)::int from public.plan_sections s
   join public.business_plans p on p.id = s.business_plan_id
   where p.user_id = '00000000-0000-0000-0000-0000000000c1'),
  4,
  'rollback removes the copied sections with their plan (only the 2090 sections remain)'
);

select results_eq(
  $$ select p.id, count(s.id)::int from public.business_plans p
     left join public.plan_sections s on s.business_plan_id = p.id
     where p.year = 2091 and p.user_id::text like '00000000-0000-0000-0000-0000000000c%'
     group by p.id $$,
  $$ values ('00000000-0000-0000-0000-00000000b202'::uuid, 1) $$,
  'after rollback only the pre-existing 2091 plan and its section remain'
);

select * from finish();
rollback;
