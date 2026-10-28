begin;

create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;

select plan(5);

insert into auth.users (id, instance_id, aud, role, email, raw_app_meta_data, raw_user_meta_data)
values
  ('00000000-0000-0000-0000-0000000000d1', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'locked-delete@example.test', '{"provider":"email"}', '{}');

insert into public.business_plans (id, user_id, year)
values ('00000000-0000-0000-0000-0000000000e1', '00000000-0000-0000-0000-0000000000d1', 2090);
insert into public.plan_sections (business_plan_id, section_key, data)
values ('00000000-0000-0000-0000-0000000000e1', 'swot', '{"strengths":[]}');

update public.profiles set locked_at = now(), lock_source = 'keap'
where id = '00000000-0000-0000-0000-0000000000d1';

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000d1","role":"authenticated"}', true);

delete from public.plan_sections where business_plan_id = '00000000-0000-0000-0000-0000000000e1';
delete from public.business_plans where id = '00000000-0000-0000-0000-0000000000e1';

select is((select count(*)::int from public.plan_sections where business_plan_id = '00000000-0000-0000-0000-0000000000e1'),
  1, 'a locked user cannot delete their sections');
select is((select count(*)::int from public.business_plans where id = '00000000-0000-0000-0000-0000000000e1'),
  1, 'a locked user cannot delete their plan');

reset role;
update public.profiles set locked_at = null, lock_source = null
where id = '00000000-0000-0000-0000-0000000000d1';

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000d1","role":"authenticated"}', true);

delete from public.plan_sections where business_plan_id = '00000000-0000-0000-0000-0000000000e1';
select is((select count(*)::int from public.plan_sections where business_plan_id = '00000000-0000-0000-0000-0000000000e1'),
  0, 'an unlocked user can delete their sections');
delete from public.business_plans where id = '00000000-0000-0000-0000-0000000000e1';
select is((select count(*)::int from public.business_plans where id = '00000000-0000-0000-0000-0000000000e1'),
  0, 'an unlocked user can delete their plan');

reset role;
select policies_are('public', 'plan_sections', array(
  select policyname::text from pg_policies where schemaname = 'public' and tablename = 'plan_sections'
), 'plan_sections policies load');

select * from finish();
rollback;
