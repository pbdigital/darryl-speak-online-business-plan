# Runbook: move members to 2027 (copy 2026 plans forward)

One-time production run for MYP-83. It gives every user who has a 2026 plan a
2027 plan with the same sections and answers, using
`public.copy_plans_forward(from_year, to_year)` from migration
`20261029000050_copy_plans_forward.sql`.

The function never touches 2026 data and never touches an existing 2027 plan.
Running it twice is safe: the second run creates nothing.

## Order of work

1. Apply the migration to production (creates the function only, no data change).
2. Run the copy (steps below).
3. Deploy the app build that has `CURRENT_PLAN_YEAR = 2027`.

The copy must come before the app. The app calls get-or-create for the current
year, so if the 2027 app goes live first, a member who opens it gets an empty
2027 plan, and the copy then skips them because they already have one.

**What a user sees in the gap between steps 2 and 3:** nothing changes. The
live app still reads and saves their 2026 plan. Anything they save in that gap
lands in 2026 only and does not reach their 2027 copy. Keep the gap short
(minutes), and run the gap check in step 5 after the app deploy. Browser tabs
left open from before the deploy keep saving to 2026 until they reload.

## Where to run it

Use a `psql` session against production as the `postgres` user (the Supabase
dashboard's connection string), so you can check the results before
committing. The function is not callable by signed-in users or `anon`; only
`postgres` and `service_role` can execute it.

All queries below assume `set search_path = public;`.

## 1. Before counts

```sql
select
  (select count(*) from business_plans where year = 2026) as plans_2026,
  (select count(*) from business_plans where year = 2027) as plans_2027,
  (select count(*) from business_plans p
     where p.year = 2026
       and exists (select 1 from business_plans q where q.user_id = p.user_id and q.year = 2027)
  ) as users_already_2027,
  (select count(*) from plan_sections s join business_plans p on p.id = s.business_plan_id
     where p.year = 2026
       and not exists (select 1 from business_plans q where q.user_id = p.user_id and q.year = 2027)
  ) as sections_to_copy,
  (select count(*) from plan_sections s join business_plans p on p.id = s.business_plan_id
     where p.year = 2026) as sections_2026,
  (select count(*) from plan_sections s join business_plans p on p.id = s.business_plan_id
     where p.year = 2027) as sections_2027;
```

Save the output. Expected results of the run:

- `plans_created` = `plans_2026 - users_already_2027`
- `sections_copied` = `sections_to_copy`
- `users_skipped` = `users_already_2027`

## 2. The call

```sql
begin;
select * from public.copy_plans_forward(2026, 2027);
```

Save the returned row, especially `run_at`. Every plan and section the run
created has that exact timestamp, and rollback depends on it.

## 3. After checks (still inside the transaction)

```sql
select
  (select count(*) from business_plans where year = 2026) as plans_2026,
  (select count(*) from business_plans where year = 2027) as plans_2027,
  (select count(*) from business_plans where year = 2027 and created_at = '<run_at>') as created_by_run,
  (select count(*) from plan_sections s join business_plans p on p.id = s.business_plan_id
     where p.year = 2026) as sections_2026,
  (select count(*) from plan_sections s join business_plans p on p.id = s.business_plan_id
     where p.year = 2027) as sections_2027;

-- Copied plans whose sections differ from the 2026 source. Must return 0.
select count(*) as mismatched_plans
from business_plans new
join business_plans old on old.user_id = new.user_id and old.year = 2026
where new.year = 2027 and new.created_at = '<run_at>'
  and (
    exists (
      select s.section_key, s.data from plan_sections s where s.business_plan_id = old.id
      except
      select s.section_key, s.data from plan_sections s where s.business_plan_id = new.id
    )
    or exists (
      select s.section_key, s.data from plan_sections s where s.business_plan_id = new.id
      except
      select s.section_key, s.data from plan_sections s where s.business_plan_id = old.id
    )
  );
```

All of these must hold, otherwise `rollback;`:

- `plans_2026` and `sections_2026` equal their before values.
- `plans_2027` = before `plans_2027` + `plans_created`.
- `created_by_run` = `plans_created`.
- `sections_2027` = before `sections_2027` + `sections_copied`.
- `plans_created`, `sections_copied` and `users_skipped` match the expected values from step 1.
- `mismatched_plans` = 0.

Then:

```sql
commit;
```

## 4. Rollback (after commit)

Rollback deletes only the 2027 plans this run created. Their sections go with
them through the foreign key cascade. Plans that existed before the run, or
that the app created afterwards, have a different `created_at` and are left
alone.

First see whether anyone has edited their copied plan since the run, because
rollback would discard those edits:

```sql
select p.user_id, count(*) as edited_sections
from plan_sections s
join business_plans p on p.id = s.business_plan_id
where p.year = 2027 and p.created_at = '<run_at>' and s.updated_at > '<run_at>'
group by p.user_id;
```

If that returns rows, decide what to do about those users before going on.
Then:

```sql
begin;
delete from business_plans where year = 2027 and created_at = '<run_at>';
-- The delete count must equal plans_created. If it doesn't, rollback;
commit;
```

After a rollback, the function can be run again later.

## 5. Gap check (after the 2027 app is live)

Sections saved to 2026 after the copy did not reach 2027. List them:

```sql
select p.user_id, s.section_key, s.updated_at
from plan_sections s
join business_plans p on p.id = s.business_plan_id
where p.year = 2026 and s.updated_at > '<run_at>'
order by s.updated_at;
```

If this returns rows, those users' 2027 copy is missing their last changes.
Where the matching 2027 section is still untouched (`updated_at = run_at`), it
can be refreshed from 2026. This is a production write, so get approval first:

```sql
update plan_sections new_s
set data = old_s.data
from business_plans new_p, business_plans old_p, plan_sections old_s
where new_s.business_plan_id = new_p.id
  and new_p.year = 2027 and new_p.created_at = '<run_at>'
  and new_s.updated_at = '<run_at>'
  and old_p.user_id = new_p.user_id and old_p.year = 2026
  and old_s.business_plan_id = old_p.id
  and old_s.section_key = new_s.section_key
  and old_s.updated_at > '<run_at>';
```

Note this sets the refreshed sections' `updated_at` to now (the update
trigger), so a later rollback check will count them as edited. It does not
cover a section a user started for the first time in the gap (no 2027 row
exists to refresh); the gap list shows those too, and they are few enough to
handle one by one.
