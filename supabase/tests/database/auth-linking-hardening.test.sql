begin;

create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;

select plan(11);

-- wordpress_user_id is service-role only

select ok(
  not has_column_privilege('authenticated', 'public.profiles', 'wordpress_user_id', 'UPDATE'),
  'authenticated users have no update grant on wordpress_user_id'
);

select ok(
  not has_column_privilege('authenticated', 'public.profiles', 'wordpress_user_id', 'INSERT'),
  'authenticated users have no insert grant on wordpress_user_id'
);

insert into auth.users (id, instance_id, aud, role, email, raw_app_meta_data, raw_user_meta_data)
values
  ('00000000-0000-0000-0000-0000000000c1', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'Linker@Example.test', '{"provider":"email"}', '{}');

set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-0000000000c1","role":"authenticated"}', true);

select throws_ok(
  $$ update public.profiles set wordpress_user_id = '42' where id = auth.uid() $$,
  '42501',
  null,
  'a user cannot set their wordpress_user_id'
);

select throws_ok(
  $$ insert into public.profiles (id, wordpress_user_id) values (gen_random_uuid(), '42') $$,
  '42501',
  null,
  'a user cannot insert a profile with a wordpress_user_id'
);

select lives_ok(
  $$ update public.profiles set first_name = 'Lin', last_name = 'Ker' where id = auth.uid() $$,
  'a user can still update their name'
);

-- Email lookup is not callable by users

select throws_ok(
  $$ select public.get_auth_user_id_by_email('linker@example.test') $$,
  '42501',
  null,
  'an authenticated user cannot look up an email'
);

reset role;
set local role anon;

select throws_ok(
  $$ select public.get_auth_user_id_by_email('linker@example.test') $$,
  '42501',
  null,
  'an anonymous visitor cannot look up an email'
);

-- The service role can, case-insensitively

reset role;
set local role service_role;

select is(
  public.get_auth_user_id_by_email(' LINKER@example.TEST '),
  '00000000-0000-0000-0000-0000000000c1'::uuid,
  'the service role finds a user by email regardless of case and spaces'
);

select is(
  public.get_auth_user_id_by_email('nobody@example.test'),
  null::uuid,
  'an unknown email returns null'
);

select lives_ok(
  $$ update public.profiles set wordpress_user_id = '42'
     where id = '00000000-0000-0000-0000-0000000000c1' $$,
  'the service role can still set wordpress_user_id'
);

reset role;

select is(
  (select wordpress_user_id from public.profiles where id = '00000000-0000-0000-0000-0000000000c1'),
  '42',
  'the service role write landed'
);

select * from finish();
rollback;
