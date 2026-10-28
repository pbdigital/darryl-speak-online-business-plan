-- Copy each user's plan for one year into the next year (MYP-83).
--
-- For every user with a from_year plan and no to_year plan, this creates the
-- to_year plan and copies every plan_sections row (section_key and data).
-- An existing to_year plan and its sections are never touched, so a second
-- run changes nothing. It runs as one statement inside the caller's
-- transaction, so it either copies everything or nothing.
--
-- Every row it creates gets created_at / updated_at = now(), which is the
-- transaction start time. That value comes back as run_at, and rollback
-- deletes exactly the to_year plans whose created_at equals run_at (their
-- sections go with them through the foreign key cascade). See
-- docs/runbooks/copy-plans-forward.md.

create or replace function public.copy_plans_forward(from_year integer, to_year integer)
returns table (
  plans_created integer,
  sections_copied integer,
  users_skipped integer,
  run_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_source_users integer;
begin
  if from_year is null or to_year is null or to_year <= from_year then
    raise exception 'copy_plans_forward needs to_year later than from_year (got % to %)', from_year, to_year
      using errcode = '22023';
  end if;

  run_at := now();

  select count(*) into v_source_users
  from public.business_plans
  where year = from_year;

  with created as (
    insert into public.business_plans (user_id, year, created_at, updated_at)
    select src.user_id, to_year, run_at, run_at
    from public.business_plans src
    where src.year = from_year
      and not exists (
        select 1 from public.business_plans dst
        where dst.user_id = src.user_id and dst.year = to_year
      )
    on conflict (user_id, year) do nothing
    returning id, user_id
  ),
  copied as (
    insert into public.plan_sections (business_plan_id, section_key, data, updated_at)
    select created.id, s.section_key, s.data, run_at
    from created
    join public.business_plans src
      on src.user_id = created.user_id and src.year = from_year
    join public.plan_sections s on s.business_plan_id = src.id
    returning 1
  )
  select (select count(*) from created), (select count(*) from copied)
  into plans_created, sections_copied;

  -- Every source user either got a new plan or already had one for to_year.
  users_skipped := v_source_users - plans_created;

  return next;
end;
$$;

revoke all on function public.copy_plans_forward(integer, integer) from public, anon, authenticated;
grant execute on function public.copy_plans_forward(integer, integer) to service_role;

comment on function public.copy_plans_forward(integer, integer) is
  'One-time year rollover: copies from_year plans and sections to to_year for users without a to_year plan. Service role only. Rows it creates have created_at = the returned run_at.';
