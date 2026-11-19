/**
 * What the free plan says and links to when inviting someone to become a
 * POWER AGENT. Placeholder content until DDS signs off the wording, links
 * and testimonials. Links come from env so DDS can change them without a
 * code change.
 */

export { FREE_ACCESS_DAYS } from '@/lib/free-access';

/** Every join link carries this source so DDS can see sign-ups from the free plan. */
export const JOIN_SOURCE = 'free-business-plan';

/** The signed-in person, so the order form can be filled in with the same email. */
export interface JoinPerson {
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
}

/**
 * Link to the join page. It carries no email or name: the Keep My Plan page
 * and the order form load ad and analytics tags that would receive the whole
 * address. A member who upgrades with a different email brings their free
 * plan over with /plan/bring-over instead.
 */
export function joinUrl(params: { placement: string; person?: JoinPerson }): string {
  const base =
    process.env.NEXT_PUBLIC_POWER_AGENT_JOIN_URL || 'https://darrylspeaks.com/';
  const url = new URL(base);
  url.searchParams.set('utm_source', JOIN_SOURCE);
  url.searchParams.set('utm_medium', 'app');
  url.searchParams.set('utm_campaign', params.placement);
  return url.toString();
}

export const COACHING_CALL_URL =
  process.env.NEXT_PUBLIC_COACHING_CALL_URL || '';

export const MEMBER_BENEFITS: { title: string; detail: string }[] = [
  {
    title: 'Coaching with Darryl every week',
    detail: 'Bring your plan to a live call and get help hitting your numbers.',
  },
  {
    title: 'Your plan, all year',
    detail: 'Keep your plan online and come back to it whenever you need it.',
  },
  {
    title: 'The POWER AGENT toolkit',
    detail: 'Marketing materials, scripts and training that turn the plan into listings.',
  },
];

export const TESTIMONIALS: { quote: string; name: string; detail: string }[] = [];
