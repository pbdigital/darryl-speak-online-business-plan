begin;

create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;

select plan(44);

-- Only the service role can use any of it

select ok(not has_function_privilege('authenticated', 'public.start_plan_claim(uuid, text, text)', 'EXECUTE'),
  'users cannot start a claim');
select ok(not has_function_privilege('authenticated', 'public.complete_plan_claim(uuid, text)', 'EXECUTE'),
  'users cannot complete a claim');
select ok(not has_function_privilege('anon', 'public.complete_plan_claim(uuid, text)', 'EXECUTE'),
  'visitors cannot complete a claim');
select ok(not has_function_privilege('authenticated', 'public.plan_claim_status(uuid)', 'EXECUTE'),
  'users cannot read claim status directly');
select ok(not has_table_privilege('authenticated', 'public.plan_claims', 'SELECT'),
  'users cannot read plan_claims');
select ok(not has_table_privilege('anon', 'public.plan_claims', 'SELECT'),
  'visitors cannot read plan_claims');

-- Test users. The on_auth_user_created trigger creates their profiles.
--   f1 free, confirmed, has a plan with a section, locked
--   f2 free, confirmed, has a plan
--   f3 free, confirmed (rate-limit and expiry target)
--   fu free, email never confirmed
--   m1..m6 POWER AGENT members with an empty plan (fresh SSO accounts)
--   mh a member who already has plan data
insert into auth.users (id, instance_id, aud, role, email, email_confirmed_at, raw_app_meta_data, raw_user_meta_data)
values
  ('00000000-0000-0000-0000-0000000000f1', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'free1@example.test', now(), '{"provider":"email"}', '{"first_name":"Fran"}'),
  ('00000000-0000-0000-0000-0000000000f2', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'free2@example.test', now(), '{"provider":"email"}', '{}'),
  ('00000000-0000-0000-0000-0000000000f3', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'free3@example.test', now(), '{"provider":"email"}', '{}'),
  ('00000000-0000-0000-0000-0000000000fa', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'unconfirmed@example.test', null, '{"provider":"email"}', '{}'),
  ('00000000-0000-0000-0000-0000000000e1', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'member1@example.test', now(), '{"provider":"email","account_type":"member"}', '{"first_name":"Mo","last_name":"Member"}'),
  ('00000000-0000-0000-0000-0000000000e2', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'member2@example.test', now(), '{"provider":"email","account_type":"member"}', '{}'),
  ('00000000-0000-0000-0000-0000000000e3', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'member3@example.test', now(), '{"provider":"email","account_type":"member"}', '{}'),
  ('00000000-0000-0000-0000-0000000000e4', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'member4@example.test', now(), '{"provider":"email","account_type":"member"}', '{}'),
  ('00000000-0000-0000-0000-0000000000e5', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'member5@example.test', now(), '{"provider":"email","account_type":"member"}', '{}'),
  ('00000000-0000-0000-0000-0000000000e6', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'member6@example.test', now(), '{"provider":"email","account_type":"member"}', '{}'),
  ('00000000-0000-0000-0000-0000000000eb', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'memberplan@example.test', now(), '{"provider":"email","account_type":"member"}', '{}');

update public.profiles set wordpress_user_id = '9001' where id = '00000000-0000-0000-0000-0000000000e1';
update public.profiles set wordpress_user_id = '9002' where id = '00000000-0000-0000-0000-0000000000e2';
update public.profiles set wordpress_user_id = '9003' where id = '00000000-0000-0000-0000-0000000000e3';
update public.profiles set wordpress_user_id = '9004' where id = '00000000-0000-0000-0000-0000000000e4';
update public.profiles set wordpress_user_id = '9005' where id = '00000000-0000-0000-0000-0000000000e5';
update public.profiles set wordpress_user_id = '9006' where id = '00000000-0000-0000-0000-0000000000e6';
update public.profiles set wordpress_user_id = '9010' where id = '00000000-0000-0000-0000-0000000000eb';
update public.profiles set locked_at = now(), lock_source = 'keap' where id = '00000000-0000-0000-0000-0000000000f1';

insert into public.business_plans (id, user_id, year) values
  ('00000000-0000-0000-0000-00000000b0f1', '00000000-0000-0000-0000-0000000000f1', 2026),
  ('00000000-0000-0000-0000-00000000b0f2', '00000000-0000-0000-0000-0000000000f2', 2026),
  ('00000000-0000-0000-0000-00000000b0e1', '00000000-0000-0000-0000-0000000000e1', 2026),
  ('00000000-0000-0000-0000-00000000b0e4', '00000000-0000-0000-0000-0000000000e4', 2026),
  ('00000000-0000-0000-0000-00000000b0eb', '00000000-0000-0000-0000-0000000000eb', 2026);

insert into public.plan_sections (business_plan_id, section_key, data) values
  ('00000000-0000-0000-0000-00000000b0f1', 'reflection', '{"mantra":"Keep going"}'),
  ('00000000-0000-0000-0000-00000000b0f1', 'swot', '{"strengths":["Calls"]}'),
  ('00000000-0000-0000-0000-00000000b0f2', 'reflection', '{"mantra":"Mine"}'),
  ('00000000-0000-0000-0000-00000000b0eb', 'reflection', '{"mantra":"Already here"}');

-- Calls one of the claim functions several times in a row and lists the answers.
create function pg_temp.complete_times(p_member uuid, p_code text, p_times int)
returns text[] language plpgsql as $f$
declare v text[] := '{}'; r text;
begin
  for i in 1..p_times loop
    select status into r from public.complete_plan_claim(p_member, p_code);
    v := v || r;
  end loop;
  return v;
end $f$;

create function pg_temp.start_times(p_member uuid, p_email text, p_times int)
returns text[] language plpgsql as $f$
declare v text[] := '{}'; r text; c uuid;
begin
  for i in 1..p_times loop
    select status, claim_id into r, c from public.start_plan_claim(p_member, p_email, '123456');
    v := v || (r || ':' || case when c is null then 'none' else 'code' end);
  end loop;
  return v;
end $f$;

set local role service_role;

-- What the page shows

select is(public.plan_claim_status('00000000-0000-0000-0000-0000000000e1'), 'ok',
  'a fresh POWER AGENT account can bring a plan over');
select is(public.plan_claim_status('00000000-0000-0000-0000-0000000000eb'), 'has_plan',
  'a member account with plan data is told it already has a plan');
select is(public.plan_claim_status('00000000-0000-0000-0000-0000000000f1'), 'not_member',
  'a free account cannot start a claim');

-- Starting a claim

select is(
  (select row(status, claim_id, email)::text from public.start_plan_claim('00000000-0000-0000-0000-0000000000e1', 'nobody@example.test', '123456')),
  row('sent', null::uuid, null::text)::text,
  'an unknown email answers sent, with nothing to send'
);

select is(
  (select row(status, claim_id is null, email)::text from public.start_plan_claim('00000000-0000-0000-0000-0000000000e1', 'unconfirmed@example.test', '123456')),
  row('sent', true, null::text)::text,
  'an account whose email was never confirmed cannot be claimed'
);

select is(
  (select row(status, claim_id is null, email)::text from public.start_plan_claim('00000000-0000-0000-0000-0000000000e1', 'member2@example.test', '123456')),
  row('sent', true, null::text)::text,
  'a member account cannot be claimed'
);

select is(
  (select row(status, claim_id is null)::text from public.start_plan_claim('00000000-0000-0000-0000-0000000000eb', 'free2@example.test', '123456')),
  row('has_plan', true)::text,
  'a member with plan data cannot start a claim'
);

select is(
  (select row(status, claim_id is null)::text from public.start_plan_claim('00000000-0000-0000-0000-0000000000f2', 'free1@example.test', '123456')),
  row('not_member', true)::text,
  'a free account cannot start a claim'
);

select throws_ok(
  $$ select * from public.start_plan_claim('00000000-0000-0000-0000-0000000000e1', 'free1@example.test', '12ab56') $$,
  '22023', null, 'the code must be six digits'
);

select is(
  (select row(status, claim_id is not null, email)::text from public.start_plan_claim('00000000-0000-0000-0000-0000000000e1', ' FREE1@Example.TEST ', '111111')),
  row('sent', true, 'free1@example.test')::text,
  'a free account is found by email whatever the case and spaces, and its own email is returned'
);

select is(
  (select code_hash from public.plan_claims where member_user_id = '00000000-0000-0000-0000-0000000000e1' and code_hash is not null)
    ~ '^[0-9a-f]{64}$',
  true,
  'only a hash of the code is stored'
);

-- Completing it

select is(
  (select status from public.complete_plan_claim('00000000-0000-0000-0000-0000000000e1', '000000')),
  'wrong_code', 'a wrong code is refused'
);

select is(
  (select attempts from public.plan_claims where member_user_id = '00000000-0000-0000-0000-0000000000e1' and code_hash is not null),
  1, 'a wrong code is counted'
);

select is(
  (select status from public.start_plan_claim('00000000-0000-0000-0000-0000000000e1', 'free1@example.test', '222222')),
  'sent', 'a new code can be sent'
);

select is(
  (select status from public.complete_plan_claim('00000000-0000-0000-0000-0000000000e1', '111111')),
  'wrong_code', 'a new code replaces the old one'
);

select is(
  (select row(status, user_id)::text from public.complete_plan_claim('00000000-0000-0000-0000-0000000000e1', '222222')),
  row('claimed', '00000000-0000-0000-0000-0000000000f1'::uuid)::text,
  'the right code claims the free account'
);

select is(
  (select row(wordpress_user_id, account_type, locked_at, lock_source, first_name, last_name)::text
   from public.profiles where id = '00000000-0000-0000-0000-0000000000f1'),
  row('9001', 'member', null::timestamptz, null::text, 'Fran', 'Member')::text,
  'the free account now has the POWER AGENT login, is a member and is unlocked, keeping its own first name'
);

-- The service role cannot read auth.users directly, so check it as the owner.
reset role;

select is(
  (select raw_app_meta_data ->> 'account_type' from auth.users where id = '00000000-0000-0000-0000-0000000000f1'),
  'member', 'the auth record says member too'
);

select is(
  (select email from auth.users where id = '00000000-0000-0000-0000-0000000000f1'),
  'free1@example.test', 'the free account keeps its email and password login'
);

select is(
  (select count(*)::int from public.plan_sections where business_plan_id = '00000000-0000-0000-0000-00000000b0f1'),
  2, 'every section of the plan is still there'
);

select is(
  (select data from public.plan_sections where business_plan_id = '00000000-0000-0000-0000-00000000b0f1' and section_key = 'reflection'),
  '{"mantra":"Keep going"}'::jsonb, 'the plan data is unchanged'
);

select is(
  (select count(*)::int from auth.users where id = '00000000-0000-0000-0000-0000000000e1'),
  0, 'the empty POWER AGENT account is gone'
);

set local role service_role;

select is(
  (select count(*)::int from public.business_plans where id = '00000000-0000-0000-0000-00000000b0e1'),
  0, 'its empty plan went with it'
);

select is(
  (select count(*)::int from public.profiles where wordpress_user_id = '9001'),
  1, 'exactly one account has the POWER AGENT login'
);

select is(
  (select count(*)::int from public.plan_claims
   where member_user_id = '00000000-0000-0000-0000-0000000000e1' and claimed_at is not null),
  1, 'the claim is kept as a record'
);

select is(
  (select status from public.complete_plan_claim('00000000-0000-0000-0000-0000000000e1', '222222')),
  'expired', 'a used code cannot be used again'
);

-- A claimed account cannot be claimed twice

select is(
  (select row(status, claim_id is null)::text from public.start_plan_claim('00000000-0000-0000-0000-0000000000e2', 'free1@example.test', '333333')),
  row('sent', true)::text,
  'a claimed account cannot be claimed again'
);

-- Expiry

select is(
  (select status from public.start_plan_claim('00000000-0000-0000-0000-0000000000e3', 'free3@example.test', '444444')),
  'sent', 'member 3 gets a code'
);

update public.plan_claims set expires_at = now() - interval '1 second'
where member_user_id = '00000000-0000-0000-0000-0000000000e3';

select is(
  (select status from public.complete_plan_claim('00000000-0000-0000-0000-0000000000e3', '444444')),
  'expired', 'an expired code is refused'
);

-- Five wrong tries end the code

select is(
  (select status from public.start_plan_claim('00000000-0000-0000-0000-0000000000e5', 'free2@example.test', '555555')),
  'sent', 'member 5 gets a code'
);

select is(
  pg_temp.complete_times('00000000-0000-0000-0000-0000000000e5', '000000', 5),
  array['wrong_code', 'wrong_code', 'wrong_code', 'wrong_code', 'too_many_attempts'],
  'the fifth wrong code ends it'
);

select is(
  (select status from public.complete_plan_claim('00000000-0000-0000-0000-0000000000e5', '555555')),
  'too_many_attempts', 'the right code no longer works after five wrong ones'
);

-- Rate limits

select is(
  pg_temp.start_times('00000000-0000-0000-0000-0000000000e6', 'nobody@example.test', 6),
  array['sent:none', 'sent:none', 'sent:none', 'sent:none', 'sent:none', 'rate_limited:none'],
  'a member can ask for five codes an hour'
);

-- free3 has had one code (member 3). Two more are allowed, then none.
select is(
  pg_temp.start_times('00000000-0000-0000-0000-0000000000e2', 'free3@example.test', 3),
  array['sent:code', 'sent:code', 'sent:none'],
  'one free account gets at most three codes an hour, and the answer does not change'
);

-- A member who saves plan data after asking cannot then claim

select is(
  (select status from public.start_plan_claim('00000000-0000-0000-0000-0000000000e4', 'free2@example.test', '666666')),
  'sent', 'member 4 gets a code'
);

insert into public.plan_sections (business_plan_id, section_key, data)
values ('00000000-0000-0000-0000-00000000b0e4', 'swot', '{"strengths":["New"]}');

select is(
  (select status from public.complete_plan_claim('00000000-0000-0000-0000-0000000000e4', '666666')),
  'has_plan', 'a member account with plan data is never replaced'
);

select is(
  (select row(account_type, wordpress_user_id)::text from public.profiles where id = '00000000-0000-0000-0000-0000000000f2'),
  row('free', null::text)::text,
  'the free account is left as it was'
);

reset role;

select is(
  (select count(*)::int from auth.users where id = '00000000-0000-0000-0000-0000000000e4'),
  1, 'the member account and its data are left as they were'
);

select * from finish();

rollback;
