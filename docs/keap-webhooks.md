# Keap lock and unlock addresses

DDS's Keap campaigns lock a free user's plan when their 30 days are up and unlock it when they become a POWER AGENT. Each campaign uses an **HTTP Post** step that calls one of these addresses:

| Purpose | URL |
| --- | --- |
| Lock (free trial ended) | `https://myplanforsuccess.com/api/keap/lock` |
| Unlock (became a POWER AGENT) | `https://myplanforsuccess.com/api/keap/unlock` |

## What to put in the HTTP Post step

1. **Post URL:** one of the URLs above.
2. **Name/value pair:** name `secret`, value the `KEAP_WEBHOOK_SECRET` from the app's environment.
3. Keap sends the contact's fields automatically. The app finds the user by the contact's **Email** and saves the Keap contact **Id** on their profile.

The secret can also be sent as `?key=...` on the URL or an `X-Webhook-Secret` header, but the name/value pair is the simplest in Keap.

## What happens

- **Lock:** a free user's plan becomes read-only. They can still view and print it, and they see an invitation to become a POWER AGENT. POWER AGENT members are never locked (the response says `skipped`, `member`).
- **Unlock:** clears the lock for anyone.
- Calling either one twice is safe.
- An email that doesn't match a user returns `not_found` with HTTP 200, so the campaign carries on. It is logged on the server.
- A missing or wrong secret returns HTTP 401.

Admins can also lock and unlock users from **Admin > Users** in the app.

## Setting the secret

Set `KEAP_WEBHOOK_SECRET` in the app's environment (Vercel project settings for production) to a long random value, for example the output of `openssl rand -hex 32`. Give the same value to whoever sets up the Keap campaigns. To change it, update the environment and every HTTP Post step together.
