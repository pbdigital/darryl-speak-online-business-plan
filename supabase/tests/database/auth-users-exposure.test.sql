begin;

create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;

select plan(5);

select hasnt_view(
  'public',
  'admin_users_view',
  'the exposed admin users view has been removed'
);

select is(
  (
    select count(*)::bigint
    from pg_class exposed_view
    join pg_namespace exposed_schema
      on exposed_schema.oid = exposed_view.relnamespace
    join pg_rewrite view_rule
      on view_rule.ev_class = exposed_view.oid
    join pg_depend dependency
      on dependency.objid = view_rule.oid
    join pg_class source_table
      on source_table.oid = dependency.refobjid
    join pg_namespace source_schema
      on source_schema.oid = source_table.relnamespace
    where exposed_view.relkind = 'v'
      and exposed_schema.nspname in ('public', 'graphql_public')
      and source_schema.nspname = 'auth'
      and source_table.relname = 'users'
  ),
  0::bigint,
  'no exposed view depends on auth.users'
);

select is(
  (
    select count(*)::bigint
    from information_schema.role_table_grants grants
    where grants.table_schema in ('public', 'graphql_public')
      and grants.grantee in ('anon', 'authenticated')
      and grants.table_name = 'admin_users_view'
  ),
  0::bigint,
  'anon and authenticated have no grants on the removed view'
);

select ok(
  not has_column_privilege(
    'authenticated',
    'public.profiles',
    'is_admin',
    'UPDATE'
  ),
  'authenticated users cannot promote themselves to admin'
);

select ok(
  has_column_privilege(
    'authenticated',
    'public.profiles',
    'first_name',
    'UPDATE'
  ),
  'authenticated users can still update ordinary profile details'
);

select * from finish();
rollback;
