/**
 * Bringing a free plan into a POWER AGENT account (see
 * supabase/migrations/20261120000001_claim_free_plan.sql). This file holds
 * the parts with no server dependencies, so the unit tests can load it.
 */
import { randomInt } from 'node:crypto';

/** Answers from start_plan_claim and complete_plan_claim. */
export type PlanClaimStatus =
  | 'sent'
  | 'claimed'
  | 'not_member'
  | 'has_plan'
  | 'rate_limited'
  | 'wrong_code'
  | 'expired'
  | 'too_many_attempts'
  | 'not_claimable';

export const CLAIM_CODE_MINUTES = 10;

/** A 6-digit code, leading zeros allowed. */
export function generateClaimCode(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, '0');
}

/** Digits only, so "123 456" or "123-456" pasted from the email still works. */
export function cleanClaimCode(input: string): string {
  return input.replace(/\D/g, '');
}

export const HAS_PLAN_MESSAGE =
  "Your POWER AGENT account already has a plan, so we can't bring another one in without losing something. Tap Report an Issue at the bottom of your plan page, tell us the other email, and we'll move it for you.";

export const NOT_MEMBER_MESSAGE =
  'This is for POWER AGENT members. Sign in with POWER AGENT, then come back here.';

const MESSAGES: Record<Exclude<PlanClaimStatus, 'sent' | 'claimed'>, string> = {
  not_member: NOT_MEMBER_MESSAGE,
  has_plan: HAS_PLAN_MESSAGE,
  rate_limited: "You've asked for a lot of codes. Please wait an hour and try again.",
  wrong_code: "That code didn't match. Please check it and try again.",
  expired: 'That code has expired. Send a new one and try again.',
  too_many_attempts: 'Too many tries with that code. Send a new one and try again.',
  not_claimable:
    "We couldn't bring that plan over. It may already be linked to a POWER AGENT account. Tap Report an Issue at the bottom of your plan page and we'll help.",
};

export const GENERIC_CLAIM_ERROR = 'Something went wrong. Please try again.';

/** What to tell the person for a status that didn't succeed. */
export function claimMessage(status: string): string {
  return MESSAGES[status as keyof typeof MESSAGES] ?? GENERIC_CLAIM_ERROR;
}

/** The email with the code. The code is the only variable part. */
export function claimCodeEmail(code: string): { subject: string; text: string; html: string } {
  if (!/^\d{6}$/.test(code)) throw new Error('claimCodeEmail needs a 6-digit code');

  const subject = 'Your code to bring over your plan';
  const lines = [
    `Your code is ${code}.`,
    `Enter it on My Plan For Success to bring your free plan into your POWER AGENT account. It works for ${CLAIM_CODE_MINUTES} minutes.`,
    "If you didn't ask for this, you can ignore this email. Your plan stays where it is.",
  ];

  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #0f172a;">
      <p style="font-size: 16px;">Your code is</p>
      <p style="font-size: 32px; font-weight: bold; letter-spacing: 6px; margin: 8px 0 24px;">${code}</p>
      <p style="font-size: 16px; line-height: 1.5;">${lines[1]}</p>
      <p style="font-size: 14px; line-height: 1.5; color: #64748b;">${lines[2]}</p>
    </div>
  `;

  return { subject, text: lines.join('\n\n'), html };
}
