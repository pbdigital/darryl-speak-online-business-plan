import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { LogoutButton } from './logout-button';
import { PlanHero, SectionCard } from '@/components/business-plan';

const sections = [
  {
    sectionNumber: 1,
    title: "Annual Reflection",
    subtitle: "& Intention Setting",
    description:
      "Review your past year and set intentions for 2026. Reflect on achievements, challenges, and what you want to accomplish.",
    href: "/plan/section-1",
  },
  {
    sectionNumber: 2,
    title: "SWOT",
    subtitle: "Analysis",
    description:
      "Identify your strengths, weaknesses, opportunities, and threats. Build awareness to take focused, effective action.",
    href: "/plan/section-2",
  },
  {
    sectionNumber: 3,
    title: "Vision, Goals",
    subtitle: "& Income Planning",
    description:
      "Calculate your GCI goal and reverse engineer daily activity targets. Know your numbers to manage time wisely.",
    href: "/plan/section-3",
  },
  {
    sectionNumber: 4,
    title: "Mindset, Self-Care",
    subtitle: "& Motivation",
    description:
      "Define your affirmations, grounding rituals, boundaries, and support system. Build emotional resilience.",
    href: "/plan/section-4",
  },
  {
    sectionNumber: 5,
    title: "Accountability",
    subtitle: "& Progress Tracking",
    description:
      "Set up projects, prospecting mix, marketing strategy, and your commitment contract. Track what matters.",
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
    : user.email;

  // TODO: Fetch actual progress data from database
  // For now, using mock data to demonstrate the UI
  type SectionStatus = "not_started" | "in_progress" | "completed";

  const sectionProgress: Record<number, { status: SectionStatus; progress: number }> = {
    1: { status: "in_progress", progress: 60 },
    2: { status: "not_started", progress: 0 },
    3: { status: "not_started", progress: 0 },
    4: { status: "not_started", progress: 0 },
    5: { status: "not_started", progress: 0 },
  };

  const completedSections = Object.values(sectionProgress).filter(
    (s) => s.status === "completed"
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-primary text-primary-foreground backdrop-blur supports-[backdrop-filter]:bg-primary/95">
        <div className="container mx-auto flex items-center justify-between px-4 py-3 md:px-6 md:py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
              <svg
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight md:text-xl">
              MyPlanForSuccess
            </span>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <span className="hidden text-sm text-white/80 sm:inline">
              Welcome, {displayName}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 md:px-6 md:py-10">
        {/* Hero Section */}
        <PlanHero
          year={2026}
          completedSections={completedSections}
          totalSections={5}
          className="mb-8 md:mb-12"
        />

        {/* Sections Grid */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-xl font-semibold text-foreground md:text-2xl">
            Your Business Plan Sections
          </h2>
          <p className="mt-1 text-sm text-muted-foreground md:text-base">
            Complete each section to build your comprehensive 2026 roadmap
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
          {sections.map((section) => {
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
        </div>

        {/* Bottom CTA / Tip */}
        <div className="mt-10 rounded-xl border bg-card p-6 text-center md:mt-12 md:p-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary md:h-14 md:w-14">
            <svg
              className="h-6 w-6 md:h-7 md:w-7"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 16v-4M12 8h.01M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-semibold text-foreground md:text-xl">
            Pro Tip: Start with Section 1
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground md:text-base">
            We recommend completing the sections in order. Reflecting on last year
            helps you set more meaningful goals for 2026.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card py-6 md:py-8">
        <div className="container mx-auto px-4 text-center md:px-6">
          <p className="text-xs text-muted-foreground md:text-sm">
            &copy; {new Date().getFullYear()} Darryl Davis Seminars, Inc. All rights reserved.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            631-929-5555 &bull; DarrylSpeaks.com
          </p>
        </div>
      </footer>
    </div>
  );
}
