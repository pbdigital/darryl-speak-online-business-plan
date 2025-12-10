'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calculator,
  Cloud,
  BarChart3,
  Smartphone,
  UserPlus,
  ClipboardList,
  Zap,
  Target,
  Brain,
  Users,
  ArrowRight,
  ChevronDown,
  Quote,
  Award,
  GraduationCap,
  Star,
  Phone,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// ============================================================================
// DESIGN TOKENS
// ============================================================================
// Using the project's existing design system from globals.css:
// - Primary: Navy Dark (#1a2744) - oklch(0.22 0.04 250)
// - Secondary: Light Blue (#e8f4f8) - oklch(0.95 0.02 210)
// - Accent: Navy Light (#2d3e5f) - oklch(0.32 0.04 250)
//
// Typography: Using the project's font-sans (Geist) with serif (Libre Baskerville)
// for headlines to add warmth and coaching personality.
// ============================================================================

// ============================================================================
// SECTION 1: HERO
// ============================================================================
function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-primary via-primary to-accent">
      {/* Background Pattern - Geometric grid suggesting structure/planning */}
      <div className="absolute inset-0 opacity-[0.07]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8 transition-all duration-700',
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}
          >
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-sm text-white/90 font-medium">
              Powered by 35+ Years of Real Estate Coaching Excellence
            </span>
          </div>

          {/* Main Headline */}
          <h1
            className={cn(
              'text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6 transition-all duration-700 delay-100 font-serif',
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}
          >
            Your Blueprint for a{' '}
            <span className="relative inline-block">
              <span className="relative z-10">Breakthrough</span>
              <span className="absolute bottom-2 left-0 right-0 h-3 bg-amber-400/30 -rotate-1" />
            </span>{' '}
            Year
          </h1>

          {/* Subheadline */}
          <p
            className={cn(
              'text-lg sm:text-xl text-white/80 max-w-2xl mx-auto mb-8 leading-relaxed transition-all duration-700 delay-200',
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}
          >
            The interactive business plan that calculates your GCI goal, breaks it down into daily
            activities, and keeps you accountable all year long.
          </p>

          {/* Supporting Text */}
          <p
            className={cn(
              'text-base text-white/60 max-w-xl mx-auto mb-10 transition-all duration-700 delay-300',
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}
          >
            Join thousands of agents using the proven Power Agent methodology to design careers and
            lives worth smiling about.
          </p>

          {/* CTAs */}
          <div
            className={cn(
              'flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-700 delay-400',
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            )}
          >
            <Button
              asChild
              size="lg"
              className="bg-white text-primary hover:bg-white/90 px-8 py-6 text-lg font-semibold shadow-lg shadow-black/20 group"
            >
              <Link href="/register">
                Start Your Plan
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="text-white hover:bg-white/10 px-8 py-6 text-lg"
            >
              <Link href="/login">
                Already have an account? <span className="underline ml-1">Log In</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50">
        <span className="text-xs uppercase tracking-widest">Explore</span>
        <ChevronDown className="w-5 h-5 animate-bounce" />
      </div>
    </section>
  );
}

// ============================================================================
// SECTION 2: VALUE PROPOSITION / BENEFITS
// ============================================================================
const benefits = [
  {
    icon: Calculator,
    title: 'Calculate Your Path to Success',
    description:
      "Input your expenses and goals, and watch the math do itself. From GCI targets to daily reach-outs, you'll know exactly what it takes to build the income you want.",
    accent: 'bg-amber-500',
  },
  {
    icon: Cloud,
    title: 'Your Plan Grows With You',
    description:
      'Save your progress and come back anytime. Update your numbers as the year unfolds. Your business plan is a living document, not a one-time exercise.',
    accent: 'bg-emerald-500',
  },
  {
    icon: BarChart3,
    title: "See How Far You've Come",
    description:
      'Track completion across all five sections. Celebrate your wins, identify gaps, and stay motivated with clear progress indicators.',
    accent: 'bg-sky-500',
  },
  {
    icon: Smartphone,
    title: 'Plan on Your Schedule',
    description:
      "Whether you're at your desk, on your phone, or between showings, your business plan is always within reach. No printing, no paper, no excuses.",
    accent: 'bg-violet-500',
  },
];

function BenefitsSection() {
  return (
    <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-4 font-serif">
            Everything You Need to Hit Your Numbers
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From calculations to accountability, we've built the complete toolkit for your best year
            yet.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="group relative bg-secondary/30 rounded-2xl p-8 hover:bg-secondary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              {/* Icon */}
              <div
                className={cn(
                  'w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110',
                  benefit.accent
                )}
              >
                <benefit.icon className="w-7 h-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-primary mb-3">{benefit.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>

              {/* Decorative corner accent */}
              <div
                className={cn(
                  'absolute top-0 right-0 w-20 h-20 opacity-10 rounded-bl-[100px]',
                  benefit.accent
                )}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SECTION 3: HOW IT WORKS
// ============================================================================
const steps = [
  {
    number: '01',
    title: 'Create Your Account',
    description:
      "Sign up in seconds. If you're a Power Agent member, log in with your existing credentials.",
    icon: UserPlus,
  },
  {
    number: '02',
    title: 'Complete Your Plan',
    description:
      "Work through five guided sections at your own pace. From reflection to income planning to accountability, we've got you covered.",
    icon: ClipboardList,
  },
  {
    number: '03',
    title: 'Take Action Daily',
    description:
      'Use your personalized numbers as your roadmap. Make your reach-outs. Have your conversations. Hit your goals.',
    icon: Zap,
  },
];

function HowItWorksSection() {
  return (
    <section className="py-24 lg:py-32 bg-primary relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-secondary rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 font-serif">
            Three Steps to Your Best Year Yet
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Getting started is simple. We'll guide you through every step of the process.
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-white/30 to-transparent z-0" />
                )}

                <div className="relative z-10 text-center">
                  {/* Step number with icon */}
                  <div className="relative inline-flex items-center justify-center mb-6">
                    <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                      <step.icon className="w-10 h-10 text-white" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-400 text-primary text-sm font-bold flex items-center justify-center">
                      {step.number.replace('0', '')}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-white/70 leading-relaxed">{step.description}</p>
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
// SECTION 4: SECTION PREVIEWS
// ============================================================================
const sections = [
  {
    number: '1',
    title: 'Annual Reflection & Intention Setting',
    description:
      "Look back to move forward. Review last year's wins and lessons, then set meaningful intentions for the year ahead. This is where clarity begins.",
    icon: Target,
    color: 'from-amber-500 to-orange-500',
  },
  {
    number: '2',
    title: 'SWOT Analysis',
    description:
      "Know your strengths. Address your weaknesses. Seize opportunities. Prepare for threats. A clear-eyed assessment of where you stand today.",
    icon: BarChart3,
    color: 'from-emerald-500 to-teal-500',
  },
  {
    number: '3',
    title: 'Vision, Goals & Income Planning',
    description:
      'The heart of your business plan. Calculate your expenses, set your income goals, and reverse-engineer the exact daily activities needed to get there.',
    icon: Calculator,
    color: 'from-sky-500 to-blue-500',
  },
  {
    number: '4',
    title: 'Mindset, Self-Care & Motivation',
    description:
      'Your mindset is your engine. Define your affirmations, rituals, boundaries, and support systems that keep you grounded and moving forward.',
    icon: Brain,
    color: 'from-violet-500 to-purple-500',
  },
  {
    number: '5',
    title: 'Accountability & Progress Tracking',
    description:
      'Turn plans into projects. Define your ideal clients, build your prospecting and marketing mix, and create the systems that keep you on track all year.',
    icon: Users,
    color: 'from-rose-500 to-pink-500',
  },
];

function SectionPreviewsSection() {
  return (
    <section className="py-24 lg:py-32 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-4 font-serif">
            Five Sections. One Complete Business Plan.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Each section builds on the last, guiding you from reflection to action with clear,
            purposeful steps.
          </p>
        </div>

        {/* Sections List */}
        <div className="max-w-4xl mx-auto space-y-4">
          {sections.map((section) => (
            <div
              key={section.number}
              className="group bg-white rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-border/50"
            >
              <div className="flex items-start gap-6">
                {/* Number Badge */}
                <div
                  className={cn(
                    'flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg',
                    section.color
                  )}
                >
                  <section.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      Section {section.number}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-2 group-hover:text-accent transition-colors">
                    {section.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{section.description}</p>
                </div>

                {/* Arrow */}
                <ArrowRight className="flex-shrink-0 w-5 h-5 text-muted-foreground/50 group-hover:text-accent group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SECTION 5: SOCIAL PROOF / TESTIMONIALS
// ============================================================================
const testimonials = [
  {
    quote:
      "The business plan helped me go from scattered goals to a clear daily roadmap. I closed 30% more transactions this year because I finally knew my numbers.",
    author: 'Sarah M.',
    role: 'RE/MAX Agent, Chicago',
  },
  {
    quote:
      "I've tried paper planners for years. Having everything calculate automatically and being able to update it on my phone between showings is a game-changer.",
    author: 'Michael R.',
    role: 'Keller Williams, Austin',
  },
  {
    quote:
      "The SWOT analysis and mindset sections were eye-opening. It's not just about numbers—it's about who you need to become to hit them.",
    author: 'Jennifer L.',
    role: 'Coldwell Banker, Denver',
  },
];

const trustIndicators = [
  { value: '35+', label: 'Years of Coaching' },
  { value: '10K+', label: 'Agents Coached' },
  { value: '5', label: 'Complete Sections' },
];

function SocialProofSection() {
  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-4 font-serif">
            Agents Like You Are Getting Results
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join the community of agents who are taking control of their numbers, their activities,
            and their results.
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center gap-8 lg:gap-16 mb-16">
          {trustIndicators.map((indicator) => (
            <div key={indicator.label} className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-primary mb-1">
                {indicator.value}
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">
                {indicator.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative bg-secondary/30 rounded-2xl p-8 hover:bg-secondary/50 transition-colors"
            >
              {/* Quote Icon */}
              <Quote className="w-10 h-10 text-primary/20 mb-4" />

              {/* Quote */}
              <blockquote className="text-foreground leading-relaxed mb-6">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">
                    {testimonial.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-primary">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Brokerage Logos Placeholder */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground mb-6">
            Trusted by agents at top brokerages nationwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-40">
            <span className="text-lg font-semibold text-primary">RE/MAX</span>
            <span className="text-lg font-semibold text-primary">Keller Williams</span>
            <span className="text-lg font-semibold text-primary">Coldwell Banker</span>
            <span className="text-lg font-semibold text-primary">Century 21</span>
            <span className="text-lg font-semibold text-primary">eXp Realty</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SECTION 6: ABOUT / TRUST SECTION
// ============================================================================
const trustPoints = [
  { icon: Award, label: '35+ Years of Real Estate Coaching' },
  { icon: Users, label: 'Thousands of Agents Coached' },
  { icon: GraduationCap, label: 'Goldman Sachs 10KSB Alumni' },
  { icon: Star, label: 'Certified Speaking Professional' },
];

function AboutSection() {
  return (
    <section className="py-24 lg:py-32 bg-gradient-to-br from-slate-900 via-primary to-accent text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 font-serif">
              Built on Proven Success
            </h2>
          </div>

          {/* Body Copy */}
          <div className="text-center mb-12">
            <p className="text-lg text-white/80 leading-relaxed mb-6">
              MyPlanForSuccess is powered by{' '}
              <strong className="text-white">Darryl Davis Seminars</strong>, the company behind the
              Power Agent Program that has helped thousands of real estate professionals design
              careers and lives worth smiling about.
            </p>
            <p className="text-lg text-white/80 leading-relaxed">
              For over three decades, Darryl Davis has been coaching agents to prospect without
              fear, list with confidence, and build businesses that last. This digital business plan
              brings that same proven methodology to your fingertips, making it easier than ever to
              plan your success and track your progress.
            </p>
          </div>

          {/* Trust Points */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustPoints.map((point) => (
              <div
                key={point.label}
                className="flex flex-col items-center text-center p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10"
              >
                <point.icon className="w-8 h-8 text-amber-400 mb-3" />
                <span className="text-sm font-medium text-white/90">{point.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SECTION 7: FINAL CTA
// ============================================================================
function FinalCTASection() {
  return (
    <section className="py-24 lg:py-32 bg-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-secondary/50 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative">
        <div className="max-w-3xl mx-auto text-center">
          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-6 font-serif">
            Ready to Make This Your Breakthrough Year?
          </h2>

          {/* Supporting Text */}
          <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join the agents who are taking control of their numbers, their activities, and their
            results. Your 2026 business plan is waiting.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Button
              asChild
              size="lg"
              className="bg-primary text-white hover:bg-primary/90 px-10 py-6 text-lg font-semibold shadow-lg shadow-primary/20 group"
            >
              <Link href="/register">
                Start Your Plan
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          {/* Secondary Text */}
          <p className="text-sm text-muted-foreground">
            Free for Power Agent members.{' '}
            <a
              href="https://darrylspeaks.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              Learn about membership
              <ExternalLink className="w-3 h-3" />
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SECTION 8: FOOTER
// ============================================================================
function Footer() {
  return (
    <footer className="bg-primary text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold mb-2">MyPlanForSuccess</h3>
            <p className="text-white/70 mb-4 text-sm italic">
              Design a career and life worth smiling about.
            </p>
            <p className="text-white/60 text-sm">
              Powered by Darryl Davis Seminars, Inc.
              <br />
              The company behind the Power Agent Program.
            </p>
          </div>

          {/* Links Column */}
          <div>
            <h4 className="font-semibold mb-4 text-white/90">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="text-white/60 hover:text-white text-sm transition">
                  Log In
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-white/60 hover:text-white text-sm transition"
                >
                  Sign Up
                </Link>
              </li>
              <li>
                <a
                  href="https://darrylspeaks.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white text-sm transition inline-flex items-center gap-1"
                >
                  Power Agent Program
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-semibold mb-4 text-white/90">Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <Phone className="w-4 h-4" />
                631-929-5555
              </li>
              <li>
                <a
                  href="https://darrylspeaks.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/60 hover:text-white text-sm transition inline-flex items-center gap-1"
                >
                  DarrylSpeaks.com
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/50 text-sm">
              &copy; {new Date().getFullYear()} Darryl Davis Seminars, Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-white/50 hover:text-white text-sm transition">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-white/50 hover:text-white text-sm transition">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
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
      <HowItWorksSection />
      <SectionPreviewsSection />
      <SocialProofSection />
      <AboutSection />
      <FinalCTASection />
      <Footer />
    </main>
  );
}
