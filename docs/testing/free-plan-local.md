# Trying the free plan locally

Everything runs against the local Supabase stack. `.env.local` must point at `http://127.0.0.1:55321` and `KEAP_MODE=fake`, so no Keap calls leave the machine.

## Start

```bash
supabase start
supabase functions serve
npm run dev
```

Open the app at `http://localhost:3000`, not `127.0.0.1`. Next dev redirects to `localhost`, and the email links use Supabase's `site_url` (`http://localhost:3000` in `supabase/config.toml`), so mixing the two loses the sign-in cookie.

Confirmation and password emails land in Mailpit at `http://127.0.0.1:55324`.

## Simulate Keap and POWER AGENT

```bash
node scripts/tryout.mjs status <email>        # account type and lock state
node scripts/tryout.mjs lock <email>          # Keap's day-30 lock call
node scripts/tryout.mjs unlock <email>        # Keap's "became a POWER AGENT" call
node scripts/tryout.mjs member-login <email>  # prints a POWER AGENT sign-in link (valid 5 minutes)
```

The lock call skips members. Opening the member sign-in link turns a free user into a member and unlocks their plan. Fake Keap tags show in the dev server log as `[keap:fake]` lines.

## Countdown pop-up and admins

The countdown pop-up shows once a day in the last 7 days of a free user's 30 days. To see it, move a local free account's sign-up date back, for example 25 days for "5 days left":

```bash
docker exec supabase_db_darryl-speak-online-business-plan psql -U postgres -c \
  "update profiles set created_at = now() - interval '25 days' where id = (select id from auth.users where email = '<email>');"
```

Then open `/plan`. It won't show again that day in the same browser, so use a private window to see it twice.

To add an admin, open Admin > Admin Team > Add Admin and type their full email. An email with no account gets a new member account (never free, so no Keap tags, countdown or lock) and a set-password email in Mailpit.

Unit checks for the countdown dates: `npm run test:unit`. Edge function checks: `cd supabase/functions && deno test --allow-all`.
