'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star, Clock, Calculator, Smile, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// DESIGN TOKENS FROM FIGMA
// ============================================================================
// Primary dark: #0f172a
// Blue gradient: #1c4ca1
// Teal accent: #28afb0
// Light gray text: #e7e9e9
// Muted gray: #737373
// Dark card bg: #1e293b
// Muted blue: #91aec0
// Footer bg: #0b1c3b
// ============================================================================

// ============================================================================
// ICONS COMPONENTS
// ============================================================================

function ProgressIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 3C8.373 3 3 8.373 3 15C3 21.627 8.373 27 15 27C21.627 27 27 21.627 27 15C27 8.373 21.627 3 15 3ZM15 24C10.029 24 6 19.971 6 15C6 10.029 10.029 6 15 6C19.971 6 24 10.029 24 15C24 19.971 19.971 24 15 24Z" fill="#91AEC0"/>
      <path d="M15 6V15L20.5 18.5" stroke="#91AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CalculatorIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="3" width="20" height="24" rx="2" stroke="#91AEC0" strokeWidth="2"/>
      <rect x="8" y="6" width="14" height="5" fill="#91AEC0"/>
      <circle cx="10" cy="15" r="1.5" fill="#91AEC0"/>
      <circle cx="15" cy="15" r="1.5" fill="#91AEC0"/>
      <circle cx="20" cy="15" r="1.5" fill="#91AEC0"/>
      <circle cx="10" cy="20" r="1.5" fill="#91AEC0"/>
      <circle cx="15" cy="20" r="1.5" fill="#91AEC0"/>
      <circle cx="20" cy="20" r="1.5" fill="#91AEC0"/>
      <circle cx="10" cy="24" r="1.5" fill="#91AEC0"/>
      <rect x="14" y="22.5" width="7" height="3" rx="1" fill="#91AEC0"/>
    </svg>
  );
}

function CloudUploadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 20C3.79086 20 2 18.2091 2 16C2 13.7909 3.79086 12 6 12C6.10495 12 6.20919 12.0035 6.31256 12.0103C7.01839 8.6185 10.0656 6 13.7143 6C17.3629 6 20.4101 8.6185 21.116 12.0103C21.2193 12.0035 21.3236 12 21.4286 12C24.5257 12 27 14.4743 27 17.5714C27 20.6686 24.5257 23.1429 21.4286 23.1429H6C4.34315 23.1429 3 21.7997 3 20.1429" stroke="#91AEC0" strokeWidth="2" strokeLinecap="round"/>
      <path d="M15 13V21M15 13L12 16M15 13L18 16" stroke="#91AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function FolderIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 8C3 6.89543 3.89543 6 5 6H11L14 9H25C26.1046 9 27 9.89543 27 11V22C27 23.1046 26.1046 24 25 24H5C3.89543 24 3 23.1046 3 22V8Z" stroke="#91AEC0" strokeWidth="2"/>
      <path d="M15 14L20 17L15 20" stroke="#91AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function GridIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="10" height="10" rx="2" stroke="#91AEC0" strokeWidth="2"/>
      <rect x="17" y="3" width="10" height="10" rx="2" stroke="#91AEC0" strokeWidth="2"/>
      <rect x="3" y="17" width="10" height="10" rx="2" stroke="#91AEC0" strokeWidth="2"/>
      <rect x="17" y="17" width="10" height="10" rx="2" stroke="#91AEC0" strokeWidth="2"/>
    </svg>
  );
}

function ChecklistIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="24" height="24" rx="3" stroke="#91AEC0" strokeWidth="2"/>
      <path d="M8 10L11 13L15 8" stroke="#91AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18 10H22" stroke="#91AEC0" strokeWidth="2" strokeLinecap="round"/>
      <path d="M8 17L11 20L15 15" stroke="#91AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18 17H22" stroke="#91AEC0" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function MindIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="15" cy="12" r="9" stroke="#91AEC0" strokeWidth="2"/>
      <path d="M12 24C12 24 13 21 15 21C17 21 18 24 18 24" stroke="#91AEC0" strokeWidth="2" strokeLinecap="round"/>
      <path d="M10 27H20" stroke="#91AEC0" strokeWidth="2" strokeLinecap="round"/>
      <path d="M11 10C11 10 13 8 15 10C17 12 15 14 15 14" stroke="#91AEC0" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="15" cy="16" r="1" fill="#91AEC0"/>
    </svg>
  );
}

// ============================================================================
// HEADER COMPONENT
// ============================================================================

function Header() {
  return (
    <header className="flex items-center justify-between w-full max-w-[1180px] mx-auto">
      <div className="relative h-[25px] w-[200px]">
        <Image
          src="/logo-white.svg"
          alt="Darryl Davis Seminars"
          fill
          className="object-contain object-left"
          priority
        />
      </div>
      <Link
        href="/register"
        className="h-[44px] px-5 py-2.5 rounded-[6px] bg-[#28afb0] flex items-center justify-center gap-2.5 hover:bg-[#28afb0]/90 transition-colors"
      >
        <span className="font-[var(--font-open-sans)] font-semibold text-sm text-white capitalize leading-5">
          Get Started
        </span>
      </Link>
    </header>
  );
}

// ============================================================================
// HERO SECTION
// ============================================================================

function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] to-[#1c4ca1]" />

      {/* Blur effect */}
      <div className="absolute right-[91px] top-[184px] w-[452px] h-[452px] bg-[#1c4ca1] blur-[50px] rounded-full" />

      {/* Decorative wave */}
      <div className="absolute right-[-20px] top-[210px] w-[461px] h-[749px] opacity-20">
        <svg viewBox="0 0 461 749" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M461 0C461 0 400 100 350 200C300 300 250 400 200 500C150 600 100 700 0 749" stroke="white" strokeWidth="2" strokeOpacity="0.3"/>
        </svg>
      </div>

      <div className="relative z-10 px-6 md:px-16 lg:px-[130px] pt-[60px] pb-[80px]">
        <Header />

        <div className="mt-[80px] flex flex-col lg:flex-row gap-10 lg:gap-[131px] items-center">
          {/* Left content */}
          <div className="w-full lg:w-[678px] flex flex-col gap-[40px]">
            <div className="flex flex-col gap-[24px]">
              {/* Badge */}
              <div
                className={cn(
                  'inline-flex self-start items-center gap-[8px] px-[16px] py-[6px] rounded-[20px] bg-[rgba(40,175,176,0.2)] border border-[rgba(40,175,176,0.4)] transition-all duration-700',
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                )}
              >
                <Star className="w-[20px] h-[20px] text-[#28afb0] fill-[#28afb0]" />
                <span className="font-[var(--font-poppins)] text-[14px] text-[#28afb0] leading-[28px] tracking-[0.56px]">
                  35+ Years of Real Estate Coaching Excellence
                </span>
              </div>

              {/* Headline */}
              <h1
                className={cn(
                  'font-[var(--font-poppins)] font-bold text-[36px] md:text-[48px] lg:text-[60px] leading-[1.2] text-white transition-all duration-700 delay-100',
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                )}
              >
                Your Blueprint for a<br />Breakthrough Year
              </h1>

              {/* Description paragraphs */}
              <p
                className={cn(
                  'font-[var(--font-poppins)] text-[16px] leading-[28px] text-[#e7e9e9] transition-all duration-700 delay-200',
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                )}
              >
                The interactive business plan that calculates your GCI goal, breaks it down into daily activities, and keeps you accountable all year long.
              </p>
              <p
                className={cn(
                  'font-[var(--font-poppins)] text-[16px] leading-[28px] text-[#e7e9e9] transition-all duration-700 delay-300',
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                )}
              >
                Join thousands of agents using the proven Power Agent methodology to design careers and lives worth smiling about.
              </p>
            </div>

            {/* CTA Buttons */}
            <div
              className={cn(
                'flex flex-col sm:flex-row gap-[16px] transition-all duration-700 delay-[400ms]',
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              )}
            >
              <Link
                href="/register"
                className="h-[44px] px-[20px] py-[10px] rounded-[6px] bg-[#28afb0] flex items-center justify-center gap-[10px] hover:bg-[#28afb0]/90 transition-colors group"
              >
                <span className="font-[var(--font-open-sans)] font-semibold text-[14px] text-white capitalize leading-[20px]">
                  Start Your Plan
                </span>
                <ArrowRight className="w-[24px] h-[24px] text-white group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="h-[44px] px-[20px] py-[10px] rounded-[6px] border border-white flex items-center justify-center gap-[10px] hover:bg-white/10 transition-colors"
              >
                <span className="font-[var(--font-open-sans)] font-semibold text-[14px] text-white capitalize leading-[20px]">
                  Log In
                </span>
              </Link>
            </div>
          </div>

          {/* Right side - App Preview */}
          <div
            className={cn(
              'hidden lg:block relative transition-all duration-1000 delay-500',
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            )}
          >
            {/* Decorative stars */}
            <div className="absolute -top-[60px] -right-[40px] w-[120px] h-[120px]">
              <Image
                src="/bg-stars.svg"
                alt=""
                fill
                className="object-contain"
              />
            </div>

            {/* App Screenshot */}
            <div className="w-[371px] h-[429px] rounded-[8px] shadow-[20px_20px_44px_0px_rgba(26,69,147,0.4)] overflow-hidden">
              <Image
                src="/App-Screenshot.png"
                alt="MyPlanForSuccess App Preview"
                width={371}
                height={429}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// BENEFITS SECTION
// ============================================================================

const benefits = [
  {
    icon: CalculatorIcon,
    label: 'Benefit 1: Know Your Numbers',
    title: 'Calculate Your Path to Success',
    description: 'Enter your expenses and goals. Watch as the plan calculates your GCI target, required transactions, and daily activities automatically. No spreadsheets. No guesswork.',
  },
  {
    icon: FolderIcon,
    label: 'Benefit 2: Organize Your Strategy',
    title: 'A Complete Roadmap',
    description: 'From SWOT analysis to prospecting mix, from mindset rituals to accountability contracts—every piece of your business strategy lives in one place.',
  },
  {
    icon: ProgressIcon,
    label: 'Benefit 3: Track Your Progress',
    title: "See How Far You've Come",
    description: 'Track completion across all five sections. Celebrate your wins, identify gaps, and stay motivated with clear progress indicators.',
  },
  {
    icon: CloudUploadIcon,
    label: 'Benefit 4: Access Anywhere',
    title: 'Plan on Your Schedule',
    description: "Whether you're at your desk, on your phone, or between showings, your business plan is always within reach. No printing, no paper, no excuses.",
  },
];

function BenefitsSection() {
  return (
    <section className="bg-[#f8fafc] px-6 md:px-16 lg:px-[130px] py-12 md:py-20">
      <div className="max-w-[1180px] mx-auto">
        <div className="flex flex-col gap-10 md:gap-[60px] items-center">
          {/* Header */}
          <div className="text-center max-w-[800px]">
            <h2 className="font-[var(--font-poppins)] font-bold text-[24px] md:text-[32px] leading-[1.2] text-[#0f172a] mb-4 md:mb-6">
              Everything You Need to Succeed
            </h2>
            <p className="font-[var(--font-poppins)] text-sm md:text-base leading-6 md:leading-7 text-[#737373]">
              The business plan that does the heavy lifting for you. Calculate your numbers, track your progress, and stay accountable—all in one place.
            </p>
          </div>

          {/* Benefits grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-[rgba(145,174,192,0.1)] border border-[rgba(145,174,192,0.2)] rounded-[20px] p-5 md:p-6 flex flex-col sm:flex-row gap-4"
              >
                <div className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] bg-[#0f172a] rounded-[9px] flex items-center justify-center shrink-0">
                  <benefit.icon className="w-[24px] h-[24px] md:w-[30px] md:h-[30px]" />
                </div>
                <div className="flex flex-col gap-2 flex-1">
                  <p className="font-[var(--font-poppins)] font-medium text-xs md:text-sm text-[#28afb0] uppercase leading-5">
                    {benefit.label}
                  </p>
                  <h3 className="font-[var(--font-poppins)] font-semibold text-lg md:text-xl text-[#0f172a] leading-6 md:leading-7">
                    {benefit.title}
                  </h3>
                  <p className="font-[var(--font-poppins)] font-light text-sm md:text-base text-[#737373] leading-6 md:leading-7">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Link
            href="/register"
            className="h-[44px] px-5 py-2.5 rounded-[6px] bg-[#28afb0] flex items-center justify-center gap-2.5 hover:bg-[#28afb0]/90 transition-colors group"
          >
            <span className="font-[var(--font-open-sans)] font-semibold text-sm text-white capitalize leading-5">
              Get started Free
            </span>
            <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// THREE STEPS SECTION
// ============================================================================

const steps = [
  {
    step: 1,
    title: 'Create Your Account',
    description: "Sign up in seconds. If you're a Power Agent member, log in with your existing credentials.",
  },
  {
    step: 2,
    title: 'Complete Your Plan',
    description: "Work through five guided sections at your own pace. From reflection to income planning to accountability, we've got you covered.",
  },
  {
    step: 3,
    title: 'Take Action Daily',
    description: 'Use your personalized numbers as your roadmap. Make your reach-outs. Have your conversations. Hit your goals.',
  },
];

function ThreeStepsSection() {
  return (
    <section className="bg-white px-6 md:px-16 lg:px-[130px] py-12 md:py-20">
      <div className="max-w-[1180px] mx-auto">
        <div className="flex flex-col gap-10 md:gap-[60px] items-center">
          {/* Header */}
          <div className="text-center max-w-[800px]">
            <h2 className="font-[var(--font-poppins)] font-bold text-[24px] md:text-[32px] leading-[1.2] text-[#0f172a] mb-4 md:mb-6">
              Three Steps to Your Best Year Yet
            </h2>
            <p className="font-[var(--font-poppins)] text-sm md:text-base leading-6 md:leading-7 text-[#737373]">
              Your best year doesn&apos;t happen by accident—it happens by design. Follow these three steps to build clarity, create momentum, and turn your vision into measurable results.
            </p>
          </div>

          {/* Steps */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-5 w-full">
            {steps.map((step) => (
              <div
                key={step.step}
                className="flex-1 bg-white border border-[#e7e9e9] rounded-[20px] p-5 md:p-[30px] overflow-hidden relative"
              >
                {/* Decorative corner elements */}
                <div className="absolute right-[-10px] top-[-10px] w-[58px] h-[58px] rounded-full bg-[#28afb0]/10" />
                <div className="absolute right-[30px] top-[30px] w-[52px] h-[52px] rounded-full bg-[#28afb0]/5" />

                <p className="font-[var(--font-poppins)] font-semibold text-xs md:text-sm text-[rgba(145,174,192,0.6)] uppercase tracking-[1.96px] leading-7 mb-3 md:mb-4">
                  Step {step.step}
                </p>
                <div className="flex flex-col gap-2">
                  <h3 className="font-[var(--font-poppins)] font-semibold text-lg md:text-[22px] text-[#0b1c3b] leading-6 md:leading-7">
                    {step.title}
                  </h3>
                  <p className="font-[var(--font-poppins)] text-sm md:text-base text-[#737373] leading-6 md:leading-7">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Link
            href="/register"
            className="h-[44px] px-5 py-2.5 rounded-[6px] bg-[#28afb0] flex items-center justify-center gap-2.5 hover:bg-[#28afb0]/90 transition-colors group"
          >
            <span className="font-[var(--font-open-sans)] font-semibold text-sm text-white capitalize leading-5">
              Get started Free
            </span>
            <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FIVE SECTIONS OVERVIEW
// ============================================================================

const sections = [
  {
    number: 1,
    title: 'Annual Reflection',
    subtitle: '& Intention Setting',
    description: "Look back to move forward. Review last year's wins and lessons, then set meaningful intentions for the year ahead. This is where clarity begins.",
    icon: Clock,
  },
  {
    number: 2,
    title: 'SWOT',
    subtitle: 'Analysis',
    description: 'Know your strengths. Address your weaknesses. Seize opportunities. Prepare for threats. A clear-eyed assessment of where you stand today.',
    icon: GridIcon,
  },
  {
    number: 3,
    title: 'Vision, Goals',
    subtitle: '& Income Planning',
    description: 'The heart of your business plan. Calculate your expenses, set your income goals, and reverse-engineer the exact daily activities needed to get there.',
    icon: Calculator,
  },
  {
    number: 4,
    title: 'Mindset, Self-Care',
    subtitle: '& Motivation',
    description: 'Your mindset is your engine. Define your affirmations, rituals, boundaries, and support systems that keep you grounded and moving forward.',
    icon: Smile,
    wide: true,
  },
  {
    number: 5,
    title: 'Accountability',
    subtitle: '& Progress Tracking',
    description: 'Turn plans into projects. Define your ideal clients, build your prospecting and marketing mix, and create the systems that keep you on track all year.',
    icon: Shield,
    wide: true,
  },
];

function FiveSectionsOverview() {
  return (
    <section className="relative px-6 md:px-16 lg:px-[130px] py-12 md:py-20 overflow-hidden">
      {/* Dark background */}
      <div className="absolute inset-0 bg-[#0f172a]" />

      {/* Gradient blobs - hidden on mobile */}
      <div className="hidden md:block absolute left-[80px] top-[239px] w-[335px] h-[335px]">
        <div className="absolute inset-[-29.85%] bg-[#1c4ca1] rounded-full blur-[100px] opacity-40" />
      </div>
      <div className="hidden md:block absolute right-[130px] top-[189px] w-[370px] h-[370px]">
        <div className="absolute inset-[-27.03%] bg-[#28afb0] rounded-full blur-[100px] opacity-20" />
      </div>
      <div className="hidden lg:block absolute bottom-[80px] left-[916px] w-[344px] h-[344px]">
        <div className="absolute inset-[-29.07%] bg-[#1c4ca1] rounded-full blur-[100px] opacity-30" />
      </div>

      <div className="relative z-10 max-w-[1180px] mx-auto">
        <div className="flex flex-col gap-10 md:gap-[60px] items-center">
          {/* Header */}
          <div className="text-center max-w-[800px]">
            <h2 className="font-[var(--font-poppins)] font-bold text-[24px] md:text-[32px] leading-[1.2] text-white mb-4 md:mb-6">
              Five Sections. One Complete Business Plan.
            </h2>
            <p className="font-[var(--font-poppins)] text-sm md:text-base leading-6 md:leading-7 text-[#e7e9e9]">
              Build a business plan that works from every angle. These five sections guide you through reflection, strategy, goal-setting, mindset, and accountability—giving you a complete, actionable roadmap for the year ahead.
            </p>
          </div>

          {/* Section cards */}
          <div className="w-full flex flex-col gap-4 md:gap-5">
            {/* Top row - 3 cards (stacked on mobile) */}
            <div className="flex flex-col lg:flex-row gap-4 md:gap-5">
              {sections.slice(0, 3).map((section) => (
                <div
                  key={section.number}
                  className="flex-1 bg-[#1e293b] border border-[rgba(145,174,192,0.2)] rounded-[20px] p-5 md:p-[30px] overflow-hidden relative min-h-[200px] md:min-h-[315px]"
                >
                  {/* Corner decoration */}
                  <div className="absolute right-[-71px] top-[-71px] w-[158px] h-[158px] rounded-full bg-[#28afb0]/10" />

                  {/* Icon */}
                  <div className="absolute right-[15px] md:right-[19px] top-[15px] md:top-[19px] w-[24px] h-[24px] md:w-[30px] md:h-[30px]">
                    <section.icon className="w-full h-full text-[#91aec0]" />
                  </div>

                  <p className="font-[var(--font-poppins)] font-semibold text-xs md:text-sm text-[rgba(145,174,192,0.6)] tracking-[1.96px] leading-7 mb-3 md:mb-4">
                    SECTION {section.number}
                  </p>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-[var(--font-poppins)] text-lg md:text-[22px] leading-6 md:leading-7">
                      <span className="font-semibold text-white">{section.title}</span>{' '}
                      <span className="font-normal text-[#91aec0]">{section.subtitle}</span>
                    </h3>
                    <p className="font-[var(--font-poppins)] text-sm md:text-base text-[#e7e9e9] leading-6 md:leading-7">
                      {section.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom row - 2 wider cards */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-5">
              {sections.slice(3, 5).map((section) => (
                <div
                  key={section.number}
                  className="flex-1 bg-[#1e293b] border border-[rgba(145,174,192,0.2)] rounded-[20px] p-5 md:p-[30px] overflow-hidden relative min-h-[180px] md:min-h-[250px]"
                >
                  {/* Corner decoration */}
                  <div className="absolute right-[-71px] top-[-71px] w-[158px] h-[158px] rounded-full bg-[#28afb0]/10" />

                  {/* Icon */}
                  <div className="absolute right-[15px] md:right-[19px] top-[15px] md:top-[19px] w-[24px] h-[24px] md:w-[30px] md:h-[30px]">
                    <section.icon className="w-full h-full text-[#91aec0]" />
                  </div>

                  <p className="font-[var(--font-poppins)] font-semibold text-xs md:text-sm text-[rgba(145,174,192,0.6)] tracking-[1.96px] leading-7 mb-3 md:mb-4">
                    SECTION {section.number}
                  </p>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-[var(--font-poppins)] text-lg md:text-[22px] leading-6 md:leading-7">
                      <span className="font-semibold text-white">{section.title}</span>{' '}
                      <span className="font-normal text-[#91aec0]">{section.subtitle}</span>
                    </h3>
                    <p className="font-[var(--font-poppins)] text-sm md:text-base text-[#e7e9e9] leading-6 md:leading-7">
                      {section.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <Link
            href="/register"
            className="h-[44px] px-5 py-2.5 rounded-[6px] bg-[#28afb0] flex items-center justify-center gap-2.5 hover:bg-[#28afb0]/90 transition-colors group"
          >
            <span className="font-[var(--font-open-sans)] font-semibold text-sm text-white capitalize leading-5">
              Get started Free
            </span>
            <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// TESTIMONIALS SECTION
// ============================================================================

const testimonials = [
  {
    quote: "The business plan helped me go from scattered goals to a clear daily roadmap. I closed 30% more transactions this year.",
    author: 'Sarah M.',
    role: 'RE/MAX Agent, Chicago',
    initials: 'SM',
  },
  {
    quote: "Having everything calculate automatically and being able to update it on my phone between showings is a game-changer.",
    author: 'Michael R.',
    role: 'Keller Williams, Austin',
    initials: 'MR',
  },
  {
    quote: "The SWOT analysis and mindset sections were eye-opening. It's not just about numbers - it's about who you become.",
    author: 'Jennifer L.',
    role: 'Coldwell Banker, Denver',
    initials: 'JL',
  },
];

function TestimonialsSection() {
  return (
    <section className="bg-white px-6 md:px-16 lg:px-[130px] py-12 md:py-20">
      <div className="max-w-[1180px] mx-auto">
        <div className="flex flex-col gap-8 md:gap-[60px]">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <h2 className="font-[var(--font-poppins)] font-bold text-[24px] md:text-[32px] leading-[1.2] text-[#0f172a]">
              Agents Like You Are Getting Results
            </h2>
            <div className="hidden md:flex gap-5">
              <button className="w-10 h-10 rounded-full border border-[#e7e9e9] flex items-center justify-center hover:bg-[#f8fafc] transition-colors">
                <ArrowRight className="w-5 h-5 text-[#0f172a] rotate-180" />
              </button>
              <button className="w-10 h-10 rounded-full border border-[#e7e9e9] flex items-center justify-center hover:bg-[#f8fafc] transition-colors">
                <ArrowRight className="w-5 h-5 text-[#0f172a]" />
              </button>
            </div>
          </div>

          {/* Testimonial cards */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-5">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="flex-1 bg-white border border-[#e7e9e9] rounded-[20px] p-5 md:p-6 flex flex-col gap-4"
              >
                {/* Stars */}
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 md:w-5 md:h-5 fill-[#fbbf24] text-[#fbbf24]" />
                  ))}
                </div>

                {/* Quote */}
                <p className="font-[var(--font-poppins)] text-sm md:text-base text-[#0f172a] leading-6 md:leading-7 flex-1">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-[#e7e9e9]">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#0f172a]/10 flex items-center justify-center">
                    <span className="font-[var(--font-poppins)] font-semibold text-xs md:text-sm text-[#0f172a]">
                      {testimonial.initials}
                    </span>
                  </div>
                  <div>
                    <p className="font-[var(--font-poppins)] font-semibold text-sm text-[#0f172a]">
                      {testimonial.author}
                    </p>
                    <p className="font-[var(--font-poppins)] text-xs md:text-sm text-[#737373]">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// ABOUT SECTION (with Darryl)
// ============================================================================

function AboutSection() {
  return (
    <section className="bg-[#f8fafc] px-6 md:px-16 lg:px-[130px] py-12 md:py-20">
      <div className="max-w-[1180px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 items-center">
          {/* Left - Darryl's photo */}
          <div className="relative w-full max-w-[300px] md:max-w-[400px] shrink-0">
            <div className="relative rounded-[20px] overflow-hidden">
              <Image
                src="/darryl.png"
                alt="Darryl Davis"
                width={400}
                height={500}
                className="w-full h-auto"
              />
            </div>
            {/* Badge */}
            <div className="absolute bottom-4 left-4 bg-[#28afb0] rounded-lg px-3 md:px-4 py-2">
              <p className="font-[var(--font-poppins)] font-bold text-xs md:text-sm text-white">35+ Years</p>
              <p className="font-[var(--font-poppins)] text-xs text-white/80">Coaching Excellence</p>
            </div>
          </div>

          {/* Right - Content */}
          <div className="flex flex-col gap-4 md:gap-6">
            <h2 className="font-[var(--font-poppins)] font-bold text-[24px] md:text-[32px] leading-[1.2] text-[#0f172a] text-center lg:text-left">
              Built on Decades of Real Estate Success
            </h2>
            <div className="space-y-3 md:space-y-4">
              <p className="font-[var(--font-poppins)] text-sm md:text-base leading-6 md:leading-7 text-[#737373] text-center lg:text-left">
                MyPlanForSuccess is powered by <strong className="text-[#0f172a]">Darryl Davis Seminars</strong>, the company behind the Power Agent Program that has helped thousands of real estate professionals design careers and lives worth smiling about.
              </p>
              <p className="font-[var(--font-poppins)] text-sm md:text-base leading-6 md:leading-7 text-[#737373] text-center lg:text-left">
                For over three decades, Darryl Davis has been coaching agents to prospect without fear, list with confidence, and build businesses that last. This digital business plan brings that proven methodology to your fingertips.
              </p>
            </div>

            {/* Trust points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mt-2 md:mt-4">
              {[
                '35+ Years of Real Estate Coaching',
                'Thousands of Agents Coached',
                'Goldman Sachs 10KSB Alumni',
                'Certified Speaking Professional',
              ].map((point, index) => (
                <div key={index} className="flex items-center gap-3 p-3 md:p-4 bg-white rounded-xl border border-[#e7e9e9]">
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#28afb0] flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 md:w-4 md:h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="font-[var(--font-poppins)] text-xs md:text-sm text-[#0f172a]">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FINAL CTA SECTION
// ============================================================================

function FinalCTASection() {
  return (
    <section className="bg-white px-6 md:px-16 lg:px-[130px] py-12 md:py-20">
      <div className="max-w-[1180px] mx-auto">
        <div className="bg-gradient-to-r from-[#0f172a] to-[#1c4ca1] rounded-[20px] md:rounded-[30px] px-6 md:px-12 lg:px-20 py-10 md:py-16 text-center">
          <h2 className="font-[var(--font-poppins)] font-bold text-[24px] md:text-[32px] lg:text-[40px] leading-[1.2] text-white mb-4 md:mb-6">
            Ready to Make This Your Breakthrough Year?
          </h2>
          <p className="font-[var(--font-poppins)] text-sm md:text-lg leading-6 md:leading-7 text-[#e7e9e9] mb-6 md:mb-8 max-w-[600px] mx-auto">
            Join thousands of agents using the proven Power Agent methodology. Start building your business plan today.
          </p>
          <Link
            href="/register"
            className="inline-flex h-[44px] md:h-[52px] px-6 md:px-8 py-2.5 md:py-3 rounded-[6px] bg-[#28afb0] items-center justify-center gap-2.5 hover:bg-[#28afb0]/90 transition-colors group"
          >
            <span className="font-[var(--font-open-sans)] font-semibold text-sm md:text-base text-white capitalize">
              Start Your Plan Free
            </span>
            <ArrowRight className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FOOTER
// ============================================================================

function Footer() {
  return (
    <footer className="bg-[#0b1c3b] min-h-[60px] py-4 md:py-0 md:h-[60px] flex items-center justify-center px-6">
      <p className="font-[var(--font-poppins)] text-xs md:text-sm text-white text-center">
        Darryl Davis | Copyright 2025 | Terms &amp; Conditions | Privacy Policy
      </p>
    </footer>
  );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <BenefitsSection />
      <ThreeStepsSection />
      <FiveSectionsOverview />
      <TestimonialsSection />
      <AboutSection />
      <FinalCTASection />
      <Footer />
    </main>
  );
}
