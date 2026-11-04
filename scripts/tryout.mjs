#!/usr/bin/env node
/**
 * Local try-out helper for the free Business Plan. Local stack only: it refuses
 * to run unless NEXT_PUBLIC_SUPABASE_URL points at 127.0.0.1 or localhost.
 *
 *   node scripts/tryout.mjs lock <email>          Keap's day-30 lock call
 *   node scripts/tryout.mjs unlock <email>        Keap's "became a POWER AGENT" call
 *   node scripts/tryout.mjs member-login <email>  Prints a POWER AGENT sign-in link
 *   node scripts/tryout.mjs status <email>        Shows account type and lock state
 */
import { readFileSync } from 'node:fs';
import { createHmac } from 'node:crypto';

const env = Object.fromEntries(
  readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
    .split('\n')
    .filter((line) => /^[A-Z0-9_]+=/.test(line))
    .map((line) => [line.slice(0, line.indexOf('=')), line.slice(line.indexOf('=') + 1).trim()])
);

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL ?? '';
if (!/^http:\/\/(127\.0\.0\.1|localhost)[:/]/.test(supabaseUrl)) {
  console.error('Refusing to run: .env.local does not point at a local Supabase.');
  process.exit(1);
}

const APP_URL = process.env.APP_URL ?? 'http://localhost:3000';
const [command, email] = process.argv.slice(2);

if (!command || !email) {
  console.error('Usage: node scripts/tryout.mjs <lock|unlock|member-login|status> <email>');
  process.exit(1);
}

function base64url(input) {
  return Buffer.from(input).toString('base64url');
}

function memberToken(address, wordpressUserId) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = base64url(
    JSON.stringify({
      sub: wordpressUserId ?? String(900000 + (Buffer.from(address).reduce((a, b) => a + b, 0) % 99999)),
      email: address,
      first_name: 'Test',
      last_name: 'Member',
      iat: now,
      exp: now + 300,
    })
  );
  const signature = createHmac('sha256', env.POWER_AGENT_JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64url');
  return `${header}.${payload}.${signature}`;
}

async function keap(action) {
  const body = new URLSearchParams({ secret: env.KEAP_WEBHOOK_SECRET, Email: email, Id: '12345' });
  const response = await fetch(`${APP_URL}/api/keap/${action}`, { method: 'POST', body });
  console.log(response.status, await response.text());
}

async function findProfile() {
  const headers = {
    apikey: env.SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
  };
  const idResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/get_auth_user_id_by_email`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ p_email: email }),
  });
  const userId = await idResponse.json();
  if (!userId) return null;
  const profile = await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${userId}&select=*`, { headers });
  const [row] = await profile.json();
  return row ?? null;
}

async function status() {
  const profile = await findProfile();
  console.log(profile ? JSON.stringify(profile, null, 2) : 'No user with that email.');
}

switch (command) {
  case 'lock':
  case 'unlock':
    await keap(command);
    break;
  case 'member-login':
    console.log(
      `${APP_URL}/api/auth/callback/power-agent?token=${memberToken(email, (await findProfile())?.wordpress_user_id ?? undefined)}`
    );
    console.log('Open it within 5 minutes.');
    break;
  case 'status':
    await status();
    break;
  default:
    console.error(`Unknown command: ${command}`);
    process.exit(1);
}
