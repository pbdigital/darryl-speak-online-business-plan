import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { CURRENT_PLAN_YEAR } from '@/lib/constants';
import { PlanHero, SectionCardsGrid } from '@/components/business-plan';
import { PlanFooter } from './plan-footer';

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

export default async function PlanPage() {
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
    .select('first_name, last_name')
    .eq('id', user.id)
    .single();

  const displayName = profile?.first_name
    ? `${profile.first_name} ${profile.last_name || ''}`.trim()
    : user.email?.split('@')[0] || 'there';

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Section */}
      <PlanHero
        year={CURRENT_PLAN_YEAR}
        userName={displayName}
      />

      {/* Main Content - overlaps the hero */}
      <main className="relative z-20 mx-auto -mt-20 max-w-7xl px-6 pb-20 md:px-12">
        <SectionCardsGrid sections={sections} />
      </main>

      {/* Footer */}
      <PlanFooter userName={displayName} userEmail={user.email || ''} />
    </div>
  );
}
