-- Auth user data must only be read inside an admin-checked server boundary.
do $$
begin
  if to_regclass('public.admin_users_view') is not null then
    execute 'revoke all privileges on table public.admin_users_view from public, anon, authenticated, service_role';
  end if;
end
$$;

drop view if exists public.admin_users_view;

-- Authenticated users may edit profile details, but never admin audit fields.
revoke insert, update on table public.profiles from anon, authenticated;

grant insert (id, first_name, last_name, wordpress_user_id)
  on table public.profiles
  to authenticated;

grant update (first_name, last_name, wordpress_user_id)
  on table public.profiles
  to authenticated;
