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
