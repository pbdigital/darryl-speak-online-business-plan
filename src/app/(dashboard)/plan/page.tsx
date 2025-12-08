import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { LogoutButton } from './logout-button';
import { PlanHero, SectionCard, SectionOneCardWrapper, SectionTwoCardWrapper } from '@/components/business-plan';
import { Users } from 'lucide-react';

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

  // TODO: Fetch actual progress data from database
  type SectionStatus = "not_started" | "in_progress" | "completed";

  const sectionProgress: Record<number, { status: SectionStatus; progress: number }> = {
    1: { status: "in_progress", progress: 35 },
    2: { status: "not_started", progress: 0 },
    3: { status: "not_started", progress: 0 },
    4: { status: "not_started", progress: 0 },
    5: { status: "not_started", progress: 0 },
  };

  const completedSections = Object.values(sectionProgress).filter(
    (s) => s.status === "completed"
  ).length;

  // Calculate total progress
  const totalProgress = Math.round(
    Object.values(sectionProgress).reduce((acc, s) => acc + s.progress, 0) / 5
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Section */}
      <PlanHero
        year={2026}
        userName={displayName}
        completedSections={completedSections}
        totalSections={5}
      />

      {/* Main Content - overlaps the hero */}
      <main className="relative z-20 mx-auto -mt-20 max-w-7xl px-6 pb-20 md:px-12">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => {
            // Section 1 uses client-side store for real-time progress
            if (section.sectionNumber === 1) {
              return (
                <SectionOneCardWrapper
                  key={section.sectionNumber}
                  {...section}
                />
              );
            }

            // Section 2 uses client-side store for real-time progress
            if (section.sectionNumber === 2) {
              return (
                <SectionTwoCardWrapper
                  key={section.sectionNumber}
                  {...section}
                />
              );
            }

            // Other sections use server-provided data (will be updated when DB integration is added)
            const progressData = sectionProgress[section.sectionNumber as keyof typeof sectionProgress];
            return (
              <SectionCard
                key={section.sectionNumber}
                {...section}
                status={progressData?.status}
                progress={progressData?.progress}
              />
            );
          })}

          {/* Digital Coach Card - matches the navy hero aesthetic */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-[#0F172A] p-8 text-white">
            {/* Corner decoration to match section cards */}
            <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-bl-[100px] bg-white/5" />

            <div className="relative z-10">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                <Users className="h-6 w-6 text-white/80" />
              </div>

              <h3 className="text-2xl font-bold">Digital Coach</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Stuck on your SWOT analysis? Need help calculating GCI? Ask your AI assistant.
              </p>
            </div>

            <div className="relative z-10 mt-6 w-full rounded-lg border border-slate-700 bg-slate-800/50 py-3 text-center text-sm font-medium text-slate-400">
              Coming Soon
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-8">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-4">
              <LogoutButton />
            </div>
            <div className="text-center sm:text-right">
              <p className="text-xs text-slate-500">
                &copy; {new Date().getFullYear()} Darryl Davis Seminars, Inc. All rights reserved.
              </p>
              <p className="mt-1 text-xs text-slate-400">
                631-929-5555 &bull; DarrylSpeaks.com
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
