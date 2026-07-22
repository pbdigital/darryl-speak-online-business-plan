# Supabase security testing and rollout

Use this workflow for database changes that affect API access, RLS, grants, Auth data or admin-only features.

The database tests also confirm authenticated users cannot update `profiles.is_admin`, while ordinary profile fields remain editable.

## Local verification

Start Docker, then reset the local database and run the database security tests:

```bash
supabase db reset
supabase test db
```

Run the Edge Function unit tests:

```bash
deno test --config supabase/functions/deno.json --allow-env \
  supabase/functions/admin-users/handler.test.ts
```

The admin functions disable Supabase gateway JWT verification in `config.toml`
because they verify the bearer token themselves and must return the shared JSON
envelope for missing or invalid tokens.

Run the application checks:

```bash
npm run lint
npm run build
```

## Zero-row API probes

Never fetch user rows while checking production access. Use `HEAD` or a zero-row query.

Before the DS-80 fix, this anonymous request returned HTTP 200:

```bash
curl -I "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/admin_users_view?select=id&limit=0" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY"
```

After the migration, repeat the request with no key, the anonymous key and a real non-admin access token. Each request must fail with 401, 403 or 404. Do not print tokens or response bodies.

Check the admin boundary separately:

```bash
curl -I "$NEXT_PUBLIC_SUPABASE_URL/functions/v1/admin-users" \
  -H "apikey: $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $NON_ADMIN_ACCESS_TOKEN"
```

The non-admin request must return 403. An authenticated admin should be able to load the user list, user detail, plan detail and admin team screens.

## Production order

Production changes require explicit approval. Confirm the linked project before any push:

```bash
cat supabase/.temp/project-ref
```

The expected project is `hhojpjwnngtneffzionl`.

Deploy in this order:

1. Deploy the updated `admin-users` and `admin-team` Edge Functions.
2. Deploy the application changes that use the Edge Function boundary.
3. Verify read-only admin screens.
4. Apply the database migration with `supabase db push`.
5. Repeat the zero-row probes.
6. Rerun Supabase Security Advisor and confirm `auth_users_exposed` is absent with a fresh scan time.

Do not test password resets, admin grants or admin revocations against production. If a problem appears after the view is removed, fix the trusted server path. Do not restore public or authenticated access to the view.
