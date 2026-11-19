-- Bring a free plan into a POWER AGENT account.
--
-- When a member signs in with POWER AGENT using a different email from their
-- free plan, the SSO callback makes a new, empty member account. These
-- functions let that member prove they own the free account (with a 6-digit
-- code sent to its email) and then re-point the free account to their
-- POWER AGENT login:
--   * the free account takes the member's wordpress_user_id and becomes a
--     member, unlocked;
--   * the empty member account is deleted.
-- Plan rows are never moved or rewritten, so every plan stays exactly as it
-- was. Everything happens in one transaction.
--
-- All of this is service role only. The app's server routes call it after
-- checking the signed-in user.

create table public.plan_claims (
  id uuid default gen_random_uuid() primary key,
  -- The member account that asked. Not a foreign key, because a successful
  -- claim deletes that account and this row is kept as the record.
  member_user_id uuid not null,
  wordpress_user_id text not null,
  -- The free account the code was sent to. Null when the email entered had
  -- no claimable account (the row still counts towards the rate limit).
  target_user_id uuid references auth.users on delete cascade,
  code_hash text,
  attempts integer default 0 not null,
  expires_at timestamptz not null,
  created_at timestamptz default now() not null,
  claimed_at timestamptz
);

comment on table public.plan_claims is
  'Codes sent to bring a free plan into a POWER AGENT account, and the record of each claim. Service role only.';

create index plan_claims_member_idx on public.plan_claims (member_user_id, created_at desc);
create index plan_claims_target_idx on public.plan_claims (target_user_id, created_at desc);

alter table public.plan_claims enable row level security;
revoke all on table public.plan_claims from public, anon, authenticated;

-- True when the user has saved anything in any plan. Sections are only
-- written when the user changes something, so an empty plan has none.
create or replace function public.account_has_plan_data(p_user uuid)
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1
    from public.plan_sections s
    join public.business_plans p on p.id = s.business_plan_id
    where p.user_id = p_user
  )
$$;

-- What the bring-over page should show for this user:
--   ok        a POWER AGENT member whose account has no plan data yet
--   has_plan  a POWER AGENT member whose account already has plan data
--   not_member anyone else
create or replace function public.plan_claim_status(p_member uuid)
returns text
language sql
security definer
stable
set search_path = ''
as $$
  select case
    when not exists (
      select 1 from public.profiles
      where id = p_member and account_type = 'member' and wordpress_user_id is not null
    ) then 'not_member'
    when public.account_has_plan_data(p_member) then 'has_plan'
    else 'ok'
  end
$$;

-- Starts a claim. p_code is the 6-digit code the app will email; only its
-- hash is stored. Returns:
--   status 'sent' with claim_id and email when the email belongs to a
--     claimable free account (send the code to that email);
--   status 'sent' with no claim_id when it does not, or that account has had
--     too many codes this hour (send nothing, so the answer never reveals
--     who has an account);
--   'not_member', 'has_plan' or 'rate_limited' otherwise.
create or replace function public.start_plan_claim(p_member uuid, p_email text, p_code text)
returns table (status text, claim_id uuid, email text)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_wordpress_user_id text;
  v_target uuid;
  v_target_email text;
begin
  if p_code !~ '^[0-9]{6}$' then
    raise exception 'start_plan_claim needs a 6-digit code' using errcode = '22023';
  end if;

  status := public.plan_claim_status(p_member);
  if status <> 'ok' then
    return next;
    return;
  end if;

  select wordpress_user_id into v_wordpress_user_id
  from public.profiles where id = p_member;

  if (
    select count(*) from public.plan_claims
    where member_user_id = p_member and created_at > now() - interval '1 hour'
  ) >= 5 then
    status := 'rate_limited';
    return next;
    return;
  end if;

  select u.id, u.email into v_target, v_target_email
  from auth.users u
  join public.profiles pr on pr.id = u.id
  where lower(u.email) = lower(trim(p_email))
    and u.id <> p_member
    and u.email_confirmed_at is not null
    and pr.account_type = 'free'
    and pr.wordpress_user_id is null
    and not coalesce(pr.is_admin, false)
  order by u.created_at
  limit 1;

  if v_target is not null and (
    select count(*) from public.plan_claims
    where target_user_id = v_target
      and code_hash is not null
      and created_at > now() - interval '1 hour'
  ) >= 3 then
    v_target := null;
  end if;

  if v_target is null then
    insert into public.plan_claims (member_user_id, wordpress_user_id, expires_at)
    values (p_member, v_wordpress_user_id, now());
    status := 'sent';
    return next;
    return;
  end if;

  -- A new code replaces any earlier one for this member.
  update public.plan_claims
  set expires_at = least(expires_at, now())
  where member_user_id = p_member and claimed_at is null;

  claim_id := gen_random_uuid();
  insert into public.plan_claims (id, member_user_id, wordpress_user_id, target_user_id, code_hash, expires_at)
  values (
    claim_id,
    p_member,
    v_wordpress_user_id,
    v_target,
    encode(sha256(convert_to(claim_id::text || ':' || p_code, 'UTF8')), 'hex'),
    now() + interval '10 minutes'
  );

  status := 'sent';
  email := v_target_email;
  return next;
end;
$$;

-- Checks the code and, if it matches, does the move. Returns:
--   'claimed' with user_id = the free account, now the member's account;
--   'wrong_code', 'expired', 'too_many_attempts', 'has_plan' or
--   'not_claimable' otherwise.
-- A wrong code is counted; five wrong tries end the code.
create or replace function public.complete_plan_claim(p_member uuid, p_code text)
returns table (status text, user_id uuid)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_claim public.plan_claims;
  v_member public.profiles;
  v_target public.profiles;
begin
  select * into v_claim
  from public.plan_claims c
  where c.member_user_id = p_member
    and c.code_hash is not null
    and c.claimed_at is null
  order by c.created_at desc, c.expires_at desc
  limit 1
  for update;

  if v_claim.id is null or v_claim.expires_at <= now() then
    status := 'expired';
    return next;
    return;
  end if;

  if v_claim.attempts >= 5 then
    status := 'too_many_attempts';
    return next;
    return;
  end if;

  if coalesce(p_code, '') !~ '^[0-9]{6}$'
    or encode(sha256(convert_to(v_claim.id::text || ':' || p_code, 'UTF8')), 'hex') <> v_claim.code_hash
  then
    update public.plan_claims set attempts = attempts + 1 where id = v_claim.id;
    status := case when v_claim.attempts + 1 >= 5 then 'too_many_attempts' else 'wrong_code' end;
    return next;
    return;
  end if;

  -- The code is right, so it is used up whatever happens next.
  update public.plan_claims set expires_at = now() where id = v_claim.id;

  -- Lock both profiles in a fixed order, then check everything again.
  perform 1 from public.profiles
  where id in (p_member, v_claim.target_user_id)
  order by id
  for update;

  select * into v_member from public.profiles where id = p_member;
  select * into v_target from public.profiles where id = v_claim.target_user_id;

  if v_member.id is null
    or v_member.account_type <> 'member'
    or v_member.wordpress_user_id is distinct from v_claim.wordpress_user_id
  then
    status := 'not_claimable';
    return next;
    return;
  end if;

  if v_target.id is null
    or v_target.account_type <> 'free'
    or v_target.wordpress_user_id is not null
    or coalesce(v_target.is_admin, false)
  then
    status := 'not_claimable';
    return next;
    return;
  end if;

  -- Hold the member's plans so nothing can be saved into them while we
  -- check they are empty (a new section needs a key-share lock on its plan).
  perform 1 from public.business_plans where business_plans.user_id = p_member for update;

  if public.account_has_plan_data(p_member) or coalesce(v_member.is_admin, false) then
    status := 'has_plan';
    return next;
    return;
  end if;

  update public.plan_claims set claimed_at = now() where id = v_claim.id;

  -- Retire the empty member account. Its empty plan rows, events and
  -- sessions go with it.
  update public.profiles set wordpress_user_id = null where id = p_member;
  delete from auth.users where id = p_member;

  update public.profiles
  set wordpress_user_id = v_claim.wordpress_user_id,
      account_type = 'member',
      locked_at = null,
      lock_source = null,
      first_name = coalesce(nullif(first_name, ''), v_member.first_name),
      last_name = coalesce(nullif(last_name, ''), v_member.last_name)
  where id = v_target.id;

  update auth.users
  set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"account_type":"member"}'::jsonb
  where id = v_target.id;

  status := 'claimed';
  user_id := v_target.id;
  return next;
end;
$$;

revoke all on function public.account_has_plan_data(uuid) from public, anon, authenticated;
revoke all on function public.plan_claim_status(uuid) from public, anon, authenticated;
revoke all on function public.start_plan_claim(uuid, text, text) from public, anon, authenticated;
revoke all on function public.complete_plan_claim(uuid, text) from public, anon, authenticated;
grant execute on function public.account_has_plan_data(uuid) to service_role;
grant execute on function public.plan_claim_status(uuid) to service_role;
grant execute on function public.start_plan_claim(uuid, text, text) to service_role;
grant execute on function public.complete_plan_claim(uuid, text) to service_role;
