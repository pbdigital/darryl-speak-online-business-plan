import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { freeAccessStart } from '@/lib/free-access-server';
import { getPlanClaimStatus } from '@/lib/plan-claim-server';
import { CURRENT_PLAN_YEAR } from '@/lib/constants';
import { PlanHero, SectionCardsGrid } from '@/components/business-plan';
import { PlanFooter } from './plan-footer';
import {
  BringPlanOverBanner,
  BroughtForwardBanner,
  FreeAccessLine,
  JoinedBanner,
} from '@/components/plan-lock/plan-notices';

const sections = [
  {
    sectionNumber: 1,
    title: "Annual Reflection",
    subtitle: "& Intention Setting",
    description:
      "Reflect on the past year and set intentional goals. Understand where you've been to plan where you're going.",
    href: "/plan/section-1",
  },
  {
    sectionNumber: 2,
    title: "SWOT",
    subtitle: "Analysis",
    description:
      "Evaluate your Strengths, Weaknesses, Opportunities, and Threats to build a resilient business strategy.",
    href: "/plan/section-2",
  },
  {
    sectionNumber: 3,
    title: "Vision, Goals",
    subtitle: "& Income Planning",
    description:
      "Calculate your GCI, transaction targets, and the daily activities required to fund your ideal life.",
    href: "/plan/section-3",
  },
  {
    sectionNumber: 4,
    title: "Mindset, Self-Care",
    subtitle: "& Motivation",
    description:
      "Build your personal stability system with affirmations, grounding rituals, and boundary setting.",
    href: "/plan/section-4",
  },
  {
    sectionNumber: 5,
    title: "Accountability",
    subtitle: "& Progress Tracking",
    description:
      "Manage projects, define your prospecting mix, and sign your commitment contract.",
    href: "/plan/section-5",
  },
];

interface PlanPageProps {
  searchParams: Promise<{ welcome?: string | string[] }>;
}

export default async function PlanPage({ searchParams }: PlanPageProps) {
  const { welcome } = await searchParams;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get profile data
  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name, account_type, created_at')
    .eq('id', user.id)
    .single();

  const isFree = profile?.account_type === 'free';
  let broughtForward = false;
  const claimStatus = profile?.account_type === 'member' ? await getPlanClaimStatus(user.id) : 'not_member';

  if (profile?.account_type === 'member') {
    const { data: plans } = await supabase
      .from('business_plans')
      .select('year')
      .eq('user_id', user.id)
      .in('year', [CURRENT_PLAN_YEAR - 1, CURRENT_PLAN_YEAR]);
    broughtForward = (plans ?? []).length === 2;
  }

  const freeStart =
    isFree && profile?.created_at
      ? await freeAccessStart(supabase, user.id, profile.created_at)
      : null;

  const displayName = profile?.first_name
    ? `${profile.first_name} ${profile.last_name || ''}`.trim()
    : user.email?.split('@')[0] || 'there';

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {freeStart && (
        <FreeAccessLine
          signedUpAt={freeStart}
          email={user.email || ''}
          firstName={profile?.first_name}
          lastName={profile?.last_name}
        />
      )}

      {/* Hero Section */}
      <PlanHero
        year={CURRENT_PLAN_YEAR}
        userName={displayName}
      />

      {/* Main Content - overlaps the hero */}
      <main className="relative z-20 mx-auto -mt-20 max-w-7xl px-6 pb-20 md:px-12">
        {welcome === 'power-agent' && <JoinedBanner />}
        {claimStatus === 'ok' && welcome !== 'power-agent' && (
          <BringPlanOverBanner userId={user.id} />
        )}
        {broughtForward && welcome !== 'power-agent' && (
          <BroughtForwardBanner userId={user.id} />
        )}
        <SectionCardsGrid sections={sections} />
      </main>

      {/* Footer */}
      <PlanFooter
        userName={displayName}
        userEmail={user.email || ''}
        showBringOver={claimStatus !== 'not_member'}
      />
    </div>
  );
}
