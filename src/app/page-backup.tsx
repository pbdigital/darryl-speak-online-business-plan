'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Calculator,
  Target,
  Brain,
  Users,
  ArrowRight,
  ChevronRight,
  Quote,
  Award,
  GraduationCap,
  Star,
  Phone,
  ExternalLink,
  CheckCircle2,
  TrendingUp,
  Calendar,
  BarChart3,
  Sparkles,
  Shield,
  Clock,
  Grid3X3,
  Smile,
  MessageCircle,
  PhoneCall,
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
// - Dark Navy: #0F172A (used in dashboard)
//
// Typography: Using the project's font-sans (Geist) with serif (Libre Baskerville)
// for headlines to add warmth and coaching personality.
// ============================================================================

// ============================================================================
// MOCKUP COMPONENTS
// These represent the actual product UI for the landing page
// ============================================================================

// Dashboard Mockup - Shows what the main dashboard looks like
function DashboardMockup({ progress = 35, className }: { progress?: number; className?: string }) {
  return (
    <div
      className={cn(
        'relative w-full max-w-[520px] rounded-2xl bg-[#0F172A] p-6 shadow-2xl',
        className
      )}
    >
      {/* Edition badge */}
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1">
        <Sparkles className="h-3 w-3 text-blue-300" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300">
          2026 Edition
        </span>
      </div>

      {/* Main headline */}
      <h3 className="mb-2 text-xl font-extrabold leading-tight text-white md:text-2xl">
        The Ultimate
        <br />
        Real Estate Business Plan
      </h3>

      <p className="mb-4 text-xs text-slate-400">
        Your blueprint for breakthroughs and a life worth smiling about.
      </p>

      {/* Darryl Quote */}
      <div className="mb-4 flex items-center gap-3 rounded-lg bg-white/5 p-3">
        <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-white/20">
          <Image src="/darryl.png" alt="Darryl Davis" fill className="object-cover" />
        </div>
        <div>
          <p className="text-[11px] italic text-slate-300">
            &ldquo;The best business plan is the one you actually use.&rdquo;
          </p>
          <p className="mt-0.5 text-[10px] text-slate-500">— Darryl Davis</p>
        </div>
      </div>

      {/* Progress card */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              Your Progress
            </p>
            <p className="text-2xl font-bold text-white">{progress}%</p>
          </div>
          <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-700/50">
          <div
            className="h-full rounded-full bg-blue-400 transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-[10px] text-slate-500">2 of 5 sections completed</p>
      </div>
    </div>
  );
}

// Expense Table Mockup - Static version with sample data
function ExpenseTableMockup({ className }: { className?: string }) {
  const expenses = [
    { name: 'Mortgage/Rent', amount: 2500 },
    { name: 'Car Payment', amount: 450 },
    { name: 'Insurance', amount: 350 },
    { name: 'Utilities', amount: 200 },
    { name: 'Food', amount: 600 },
    { name: 'Other', amount: 400 },
  ];
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className={cn('overflow-hidden rounded-lg border border-slate-700', className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#0F172A] text-white">
            <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider">
              Expense
            </th>
            <th className="px-3 py-2 text-right text-[10px] font-bold uppercase tracking-wider">
              Monthly
            </th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense, index) => (
            <tr
              key={expense.name}
              className={cn(
                'border-b border-slate-700/50',
                index % 2 === 0 ? 'bg-slate-800/50' : 'bg-slate-800/30'
              )}
            >
              <td className="px-3 py-2 text-xs text-slate-300">{expense.name}</td>
              <td className="px-3 py-2 text-right text-xs font-medium text-white">
                ${expense.amount.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="bg-[#e8f4f8]">
            <td className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-[#0F172A]">
              Monthly Total
            </td>
            <td className="px-3 py-2 text-right text-sm font-bold text-[#0F172A]">
              ${total.toLocaleString()}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

// Daily Targets Mockup - Shows the calculated daily activities
function DailyTargetsMockup({ className }: { className?: string }) {
  const targets = [
    { icon: PhoneCall, label: 'Reach-Outs', value: '18.5', suffix: '/day', color: 'bg-amber-500' },
    {
      icon: MessageCircle,
      label: 'Conversations',
      value: '1.5',
      suffix: '/day',
      color: 'bg-emerald-500',
    },
    { icon: Calendar, label: 'Appointments', value: '0.3', suffix: '/day', color: 'bg-blue-500' },
  ];

  return (
    <div className={cn('space-y-3', className)}>
      {targets.map((target) => (
        <div
          key={target.label}
          className="flex items-center gap-3 rounded-lg bg-white/10 p-3 backdrop-blur-sm"
        >
          <div className={cn('rounded-lg p-2', target.color)}>
            <target.icon className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-wider text-slate-400">{target.label}</p>
            <p className="text-lg font-bold text-white">
              {target.value}
              <span className="text-sm font-normal text-slate-400">{target.suffix}</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Section Card Mockup - Represents a section in the dashboard grid
function SectionCardMockup({
  number,
  title,
  icon: Icon,
  status,
  progress = 0,
  className,
}: {
  number: number;
  title: string;
  icon: React.ElementType;
  status: 'complete' | 'in-progress' | 'locked';
  progress?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border p-4 transition-all',
        status === 'complete'
          ? 'border-emerald-500/30 bg-emerald-500/5'
          : status === 'in-progress'
            ? 'border-blue-500/30 bg-blue-500/5'
            : 'border-slate-200 bg-white',
        className
      )}
    >
      {/* Corner decoration */}
      <div
        className={cn(
          'absolute -right-4 -top-4 h-16 w-16 rounded-full opacity-20',
          status === 'complete'
            ? 'bg-emerald-500'
            : status === 'in-progress'
              ? 'bg-blue-500'
              : 'bg-slate-200'
        )}
      />

      <div className="relative">
        <div className="mb-2 flex items-center gap-2">
          <div
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-lg',
              status === 'complete'
                ? 'bg-emerald-500 text-white'
                : status === 'in-progress'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-100 text-slate-500'
            )}
          >
            {status === 'complete' ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <Icon className="h-4 w-4" />
            )}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Section {number}
          </span>
        </div>
        <h4 className="mb-2 text-sm font-bold text-slate-800">{title}</h4>

        {/* Progress bar */}
        {status !== 'locked' && (
          <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                status === 'complete' ? 'bg-emerald-500' : 'bg-blue-500'
              )}
              style={{ width: `${status === 'complete' ? 100 : progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Calculator Flow Mockup - Shows the transformation from expenses to targets
function CalculatorFlowMockup({
  className,
  variant = 'dark',
}: {
  className?: string;
  variant?: 'dark' | 'light';
}) {
  const steps = [
    { label: 'Annual Expenses', value: '$54,000', icon: Calculator },
    { label: 'Tax Adjusted', value: '$72,000', icon: TrendingUp },
    { label: 'GCI Needed', value: '$96,000', icon: Target },
    { label: 'Transactions', value: '32', icon: BarChart3 },
  ];

  const isDark = variant === 'dark';

  return (
    <div className={cn('', className)}>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {steps.map((step, index) => (
          <div key={step.label} className="flex items-center gap-2">
            <div
              className={cn(
                'rounded-xl p-3 text-center',
                isDark ? 'bg-white/10 backdrop-blur-sm' : 'bg-primary/5 border border-primary/10'
              )}
            >
              <step.icon
                className={cn('mx-auto mb-1 h-5 w-5', isDark ? 'text-amber-400' : 'text-amber-500')}
              />
              <p
                className={cn('text-lg font-bold', isDark ? 'text-white' : 'text-primary')}
              >
                {step.value}
              </p>
              <p
                className={cn(
                  'text-[9px] uppercase tracking-wider',
                  isDark ? 'text-slate-400' : 'text-muted-foreground'
                )}
              >
                {step.label}
              </p>
            </div>
            {index < steps.length - 1 && (
              <ChevronRight
                className={cn(
                  'h-5 w-5 flex-shrink-0',
                  isDark ? 'text-slate-500' : 'text-slate-300'
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Animated Counter Hook
function useCountUp(end: number, duration: number = 2000, start: number = 0) {
  const [count, setCount] = useState(start);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * (end - start) + start));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, end, start, duration]);

  return { count, ref };
}

// ============================================================================
// SECTION 1: HERO
// Asymmetric layout with floating dashboard mockup
// ============================================================================
function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden bg-gradient-to-br from-[#0F172A] via-primary to-accent">
      {/* Background Pattern - Geometric grid */}
      <div className="absolute inset-0 opacity-[0.05]">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Decorative gradient blobs */}
      <div className="absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-amber-500/10 blur-[120px]" />
      <div className="absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[100px]" />

      <div className="container relative z-10 mx-auto px-6 py-16 lg:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left side - Content */}
          <div className="max-w-xl">
            {/* Badge */}
            <div
              className={cn(
                'mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 transition-all duration-700',
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              )}
            >
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium text-amber-200">
                35+ Years of Real Estate Coaching Excellence
              </span>
            </div>

            {/* Main Headline */}
            <h1
              className={cn(
                'mb-6 font-serif text-4xl font-bold leading-[1.1] tracking-tight text-white transition-all delay-100 duration-700 sm:text-5xl lg:text-6xl xl:text-7xl',
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              )}
            >
              Your Blueprint for a{' '}
              <span className="relative inline-block">
                <span className="relative z-10">Breakthrough</span>
                <span className="absolute bottom-2 left-0 right-0 -z-0 h-4 -rotate-1 bg-amber-500/40" />
              </span>{' '}
              Year
            </h1>

            {/* Subheadline */}
            <p
              className={cn(
                'mb-6 text-lg leading-relaxed text-slate-300 transition-all delay-200 duration-700 sm:text-xl',
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              )}
            >
              The interactive business plan that calculates your GCI goal, breaks it down into daily
              activities, and keeps you accountable all year long.
            </p>

            {/* Supporting Text */}
            <p
              className={cn(
                'mb-8 text-base text-slate-400 transition-all delay-300 duration-700',
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              )}
            >
              Join thousands of agents using the proven Power Agent methodology.
            </p>

            {/* CTAs */}
            <div
              className={cn(
                'flex flex-col gap-4 transition-all delay-[400ms] duration-700 sm:flex-row',
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              )}
            >
              <Button
                asChild
                size="lg"
                className="group bg-amber-500 px-8 py-6 text-lg font-semibold text-slate-900 shadow-lg shadow-amber-500/20 hover:bg-amber-400"
              >
                <Link href="/register">
                  Start Your Plan
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="lg"
                className="border border-white/20 px-8 py-6 text-lg text-white hover:bg-white/10"
              >
                <Link href="/login">Log In</Link>
              </Button>
            </div>
          </div>

          {/* Right side - Dashboard Mockup */}
          <div
            className={cn(
              'relative transition-all delay-500 duration-1000',
              isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
            )}
          >
            <div className="animate-float relative">
              {/* Glow effect behind mockup */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-amber-500/20 to-blue-500/20 blur-2xl" />
              <DashboardMockup progress={35} className="relative" />
            </div>

            {/* Floating badge */}
            <div className="animate-float-subtle absolute -bottom-4 -left-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <span className="text-sm font-medium text-emerald-300">Auto-saves as you go</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SECTION 2: PRODUCT PREVIEW (Calculator Demo)
// Shows the "magic" - real-time calculations
// ============================================================================
function ProductPreviewSection() {
  return (
    <section className="relative overflow-hidden bg-[#0F172A] py-20 lg:py-28">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-amber-500 blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-blue-500 blur-[100px]" />
      </div>

      <div className="container relative z-10 mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1">
            <Calculator className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Smart Calculations
            </span>
          </div>
          <h2 className="mb-4 font-serif text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            From Expenses to Daily Actions
            <span className="text-amber-400"> in Seconds</span>
          </h2>
          <p className="text-lg text-slate-400">
            Enter your numbers. Watch the math work itself out. Know exactly what it takes to hit
            your goals.
          </p>
        </div>

        {/* Calculator Demo */}
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 lg:grid-cols-3 lg:gap-6">
            {/* Left - Expense Table */}
            <div className="lg:col-span-1">
              <p className="mb-3 text-center text-xs font-bold uppercase tracking-wider text-slate-400">
                1. Enter Your Expenses
              </p>
              <ExpenseTableMockup />
            </div>

            {/* Center - Flow Arrow */}
            <div className="flex items-center justify-center lg:col-span-1">
              <div className="flex flex-col items-center gap-4 lg:flex-col">
                <div className="hidden h-px w-full bg-gradient-to-r from-transparent via-amber-500/50 to-transparent lg:block lg:h-32 lg:w-px lg:bg-gradient-to-b" />
                <div className="animate-pulse-glow rounded-full border border-amber-500/30 bg-amber-500/20 p-4">
                  <Sparkles className="h-6 w-6 text-amber-400" />
                </div>
                <p className="text-center text-sm font-medium text-amber-400">Auto-Calculates</p>
                <div className="hidden h-px w-full bg-gradient-to-r from-transparent via-amber-500/50 to-transparent lg:block lg:h-32 lg:w-px lg:bg-gradient-to-b" />
              </div>
            </div>

            {/* Right - Daily Targets */}
            <div className="lg:col-span-1">
              <p className="mb-3 text-center text-xs font-bold uppercase tracking-wider text-slate-400">
                2. Get Your Daily Targets
              </p>
              <DailyTargetsMockup />
            </div>
          </div>

          {/* Bottom - Full Flow */}
          <div className="mt-12">
            <p className="mb-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
              Your Complete Numbers Journey
            </p>
            <CalculatorFlowMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SECTION 3: HOW IT WORKS
// Visual flow with mini UI previews
// ============================================================================
const steps = [
  {
    number: '01',
    title: 'Create Your Account',
    description: "Sign up in seconds. Power Agent members can log in with existing credentials.",
    icon: Users,
    preview: 'form',
  },
  {
    number: '02',
    title: 'Complete Your Plan',
    description: 'Work through five guided sections at your own pace. Auto-saves as you go.',
    icon: Target,
    preview: 'stepper',
  },
  {
    number: '03',
    title: 'Take Action Daily',
    description: 'Use your personalized numbers as your roadmap. Hit your goals.',
    icon: TrendingUp,
    preview: 'targets',
  },
];

function HowItWorksSection() {
  return (
    <section className="relative overflow-hidden bg-slate-50 py-20 lg:py-28">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="container relative z-10 mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 font-serif text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
            Three Steps to Your Best Year Yet
          </h2>
          <p className="text-lg text-muted-foreground">
            Getting started is simple. We guide you through every step.
          </p>
        </div>

        {/* Steps */}
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-1/2 top-20 hidden h-px w-full bg-gradient-to-r from-primary/30 to-transparent md:block" />
                )}

                <div className="relative rounded-2xl border border-border bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                  {/* Step number */}
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-slate-900">
                      {index + 1}
                    </span>
                    <h3 className="text-lg font-bold text-primary">{step.title}</h3>
                  </div>

                  <p className="mb-6 text-sm text-muted-foreground">{step.description}</p>

                  {/* Mini preview */}
                  <div className="rounded-lg bg-slate-50 p-4">
                    {step.preview === 'form' && (
                      <div className="space-y-2">
                        <div className="h-8 w-full rounded border border-slate-200 bg-white" />
                        <div className="h-8 w-full rounded border border-slate-200 bg-white" />
                        <div className="h-8 w-24 rounded bg-primary" />
                      </div>
                    )}
                    {step.preview === 'stepper' && (
                      <div className="flex items-center justify-between">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <div
                            key={n}
                            className={cn(
                              'h-6 w-6 rounded-full',
                              n <= 2 ? 'bg-emerald-500' : n === 3 ? 'bg-blue-500' : 'bg-slate-200'
                            )}
                          />
                        ))}
                      </div>
                    )}
                    {step.preview === 'targets' && (
                      <div className="space-y-2">
                        {['18.5/day', '1.5/day', '0.3/day'].map((t, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between rounded bg-white px-2 py-1"
                          >
                            <div className="h-3 w-16 rounded bg-slate-200" />
                            <span className="text-xs font-bold text-primary">{t}</span>
                          </div>
                        ))}
                      </div>
                    )}
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
// SECTION 4: SECTION PREVIEWS (Bento Grid)
// Shows what each section of the business plan covers
// ============================================================================
const sections = [
  {
    number: 1,
    title: 'Annual Reflection',
    subtitle: '& Intention Setting',
    description: "Review last year's wins, set meaningful intentions.",
    icon: Clock,
    color: 'from-amber-500 to-orange-500',
  },
  {
    number: 2,
    title: 'SWOT Analysis',
    subtitle: '',
    description: 'Know your strengths. Address weaknesses. Seize opportunities.',
    icon: Grid3X3,
    color: 'from-emerald-500 to-teal-500',
  },
  {
    number: 3,
    title: 'Vision, Goals',
    subtitle: '& Income Planning',
    description:
      'Calculate expenses, set income goals, reverse-engineer daily activities.',
    icon: Calculator,
    color: 'from-blue-500 to-indigo-500',
    featured: true,
  },
  {
    number: 4,
    title: 'Mindset & Self-Care',
    subtitle: '',
    description: 'Define affirmations, rituals, and support systems.',
    icon: Smile,
    color: 'from-violet-500 to-purple-500',
  },
  {
    number: 5,
    title: 'Accountability',
    subtitle: '& Progress Tracking',
    description: 'Build prospecting and marketing systems that last.',
    icon: Shield,
    color: 'from-rose-500 to-pink-500',
  },
];

function SectionPreviewsSection() {
  return (
    <section className="relative overflow-hidden bg-white py-20 lg:py-28">
      <div className="container relative z-10 mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 font-serif text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
            Five Sections. One Complete Plan.
          </h2>
          <p className="text-lg text-muted-foreground">
            Each section builds on the last, guiding you from reflection to action.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="mx-auto max-w-5xl">
          {/* Row 1: Sections 1 & 2 */}
          <div className="mb-4 grid gap-4 md:grid-cols-2">
            {/* Section 1 */}
            <div className="group rounded-2xl border border-border bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
              <div
                className={cn(
                  'mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br',
                  sections[0].color
                )}
              >
                <Clock className="h-6 w-6 text-white" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Section 1
              </p>
              <h3 className="mt-1 text-lg font-bold text-primary">{sections[0].title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{sections[0].description}</p>
            </div>

            {/* Section 2 */}
            <div className="group rounded-2xl border border-border bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
              <div
                className={cn(
                  'mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br',
                  sections[1].color
                )}
              >
                <Grid3X3 className="h-6 w-6 text-white" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Section 2
              </p>
              <h3 className="mt-1 text-lg font-bold text-primary">{sections[1].title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{sections[1].description}</p>
            </div>
          </div>

          {/* Row 2: Section 3 - Featured (full width) */}
          <div className="mb-4">
            <div className="group rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-blue-500/5 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md lg:p-8">
              <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center">
                <div className="flex-shrink-0">
                  <div
                    className={cn(
                      'inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br',
                      sections[2].color
                    )}
                  >
                    <Calculator className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    Section 3 - The Heart of Your Plan
                  </span>
                  <h3 className="mt-1 text-xl font-bold text-primary lg:text-2xl">
                    {sections[2].title} {sections[2].subtitle}
                  </h3>
                  <p className="mt-2 text-muted-foreground">{sections[2].description}</p>
                </div>
                <div className="w-full flex-shrink-0 lg:w-auto">
                  <CalculatorFlowMockup variant="light" />
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Sections 4 & 5 */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* Section 4 */}
            <div className="group rounded-2xl border border-border bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
              <div
                className={cn(
                  'mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br',
                  sections[3].color
                )}
              >
                <Smile className="h-6 w-6 text-white" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Section 4
              </p>
              <h3 className="mt-1 text-lg font-bold text-primary">{sections[3].title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{sections[3].description}</p>
            </div>

            {/* Section 5 */}
            <div className="group rounded-2xl border border-border bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
              <div
                className={cn(
                  'mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br',
                  sections[4].color
                )}
              >
                <Shield className="h-6 w-6 text-white" />
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Section 5
              </p>
              <h3 className="mt-1 text-lg font-bold text-primary">
                {sections[4].title} {sections[4].subtitle}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{sections[4].description}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SECTION 5: SOCIAL PROOF
// Animated stats + testimonials with placeholder photos
// ============================================================================
const testimonials = [
  {
    quote:
      "The business plan helped me go from scattered goals to a clear daily roadmap. I closed 30% more transactions this year.",
    author: 'Sarah M.',
    role: 'RE/MAX Agent, Chicago',
    initials: 'SM',
  },
  {
    quote:
      "Having everything calculate automatically and being able to update it on my phone between showings is a game-changer.",
    author: 'Michael R.',
    role: 'Keller Williams, Austin',
    initials: 'MR',
  },
  {
    quote:
      "The SWOT analysis and mindset sections were eye-opening. It's not just about numbers - it's about who you become.",
    author: 'Jennifer L.',
    role: 'Coldwell Banker, Denver',
    initials: 'JL',
  },
];

function SocialProofSection() {
  const yearsCount = useCountUp(35, 2000);
  const agentsCount = useCountUp(10000, 2500);
  const fieldsCount = useCountUp(100, 1500);

  return (
    <section className="relative overflow-hidden bg-slate-50 py-20 lg:py-28">
      <div className="container relative z-10 mx-auto px-6 lg:px-8">
        {/* Animated Stats */}
        <div className="mb-16 grid gap-8 md:grid-cols-3">
          <div ref={yearsCount.ref} className="text-center">
            <p className="text-5xl font-bold text-primary lg:text-6xl">
              {yearsCount.count}
              <span className="text-amber-500">+</span>
            </p>
            <p className="mt-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Years of Coaching
            </p>
          </div>
          <div ref={agentsCount.ref} className="text-center">
            <p className="text-5xl font-bold text-primary lg:text-6xl">
              {agentsCount.count.toLocaleString()}
              <span className="text-amber-500">+</span>
            </p>
            <p className="mt-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Agents Coached
            </p>
          </div>
          <div ref={fieldsCount.ref} className="text-center">
            <p className="text-5xl font-bold text-primary lg:text-6xl">
              {fieldsCount.count}
              <span className="text-amber-500">+</span>
            </p>
            <p className="mt-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Auto-Calculated Fields
            </p>
          </div>
        </div>

        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="mb-4 font-serif text-3xl font-bold text-primary sm:text-4xl">
            Agents Like You Are Getting Results
          </h2>
        </div>

        {/* Testimonials */}
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative rounded-2xl border border-border bg-white p-6 shadow-sm transition-all hover:shadow-md"
            >
              {/* Quote Icon */}
              <Quote className="mb-4 h-8 w-8 text-primary/10" />

              {/* Stars */}
              <div className="mb-4 flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="mb-6 text-sm leading-relaxed text-foreground">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3">
                {/* PLACEHOLDER: Replace with actual testimonial photo */}
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-sm font-bold text-primary">{testimonial.initials}</span>
                </div>
                <div>
                  <p className="font-semibold text-primary">{testimonial.author}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Brokerage Logos */}
        <div className="mt-16 text-center">
          <p className="mb-6 text-sm text-muted-foreground">
            Trusted by agents at top brokerages nationwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-40">
            {/* PLACEHOLDER: Replace with actual logo images */}
            <span className="text-xl font-bold text-primary">RE/MAX</span>
            <span className="text-xl font-bold text-primary">Keller Williams</span>
            <span className="text-xl font-bold text-primary">Coldwell Banker</span>
            <span className="text-xl font-bold text-primary">Century 21</span>
            <span className="text-xl font-bold text-primary">eXp Realty</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// SECTION 6: ABOUT / TRUST (Darryl Featured)
// ============================================================================
const trustPoints = [
  { icon: Award, label: '35+ Years of Real Estate Coaching' },
  { icon: Users, label: 'Thousands of Agents Coached' },
  { icon: GraduationCap, label: 'Goldman Sachs 10KSB Alumni' },
  { icon: Star, label: 'Certified Speaking Professional' },
];

function AboutSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-primary to-accent py-20 text-white lg:py-28">
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

      <div className="container relative z-10 mx-auto px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid items-center gap-12 lg:grid-cols-5 lg:gap-16">
            {/* Left - Darryl's Photo */}
            <div className="lg:col-span-2">
              <div className="relative mx-auto max-w-sm">
                {/* Glow effect */}
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-amber-500/30 to-blue-500/30 blur-2xl" />

                {/* Photo container */}
                <div className="relative overflow-hidden rounded-2xl border-4 border-white/20 shadow-2xl">
                  <Image
                    src="/darryl.png"
                    alt="Darryl Davis - Real Estate Coach"
                    width={400}
                    height={500}
                    className="h-auto w-full object-cover"
                  />

                  {/* Badge overlay */}
                  <div className="absolute bottom-4 left-4 rounded-lg border border-amber-500/30 bg-amber-500/90 px-4 py-2">
                    <p className="text-sm font-bold text-slate-900">35+ Years</p>
                    <p className="text-xs text-slate-700">Coaching Excellence</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Content */}
            <div className="lg:col-span-3">
              <h2 className="mb-6 font-serif text-3xl font-bold sm:text-4xl lg:text-5xl">
                Built on Decades of Real Estate Success
              </h2>

              <div className="mb-8 space-y-4 text-lg text-white/80">
                <p>
                  MyPlanForSuccess is powered by{' '}
                  <strong className="text-white">Darryl Davis Seminars</strong>, the company behind
                  the Power Agent Program that has helped thousands of real estate professionals
                  design careers and lives worth smiling about.
                </p>
                <p>
                  For over three decades, Darryl Davis has been coaching agents to prospect without
                  fear, list with confidence, and build businesses that last. This digital business
                  plan brings that proven methodology to your fingertips.
                </p>
              </div>

              {/* Trust Points */}
              <div className="grid gap-4 sm:grid-cols-2">
                {trustPoints.map((point) => (
                  <div
                    key={point.label}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                  >
                    <point.icon className="h-6 w-6 flex-shrink-0 text-amber-400" />
                    <span className="text-sm font-medium text-white/90">{point.label}</span>
                  </div>
                ))}
              </div>
            </div>
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
    <section className="relative overflow-hidden bg-white py-20 lg:py-28">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-secondary/50 opacity-50 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left - Mockup showing completion */}
            <div className="relative order-2 lg:order-1">
              <div className="relative mx-auto max-w-md">
                {/* Celebration elements */}
                <div className="animate-float-subtle absolute -right-4 -top-4 rounded-full bg-emerald-500 p-3">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>

                {/* Dashboard showing 100% */}
                <DashboardMockup progress={100} />

                {/* Completion badge */}
                <div className="animate-pulse-glow absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-xl border border-emerald-500/30 bg-emerald-500 px-6 py-2">
                  <p className="text-sm font-bold text-white">Plan Complete!</p>
                </div>
              </div>
            </div>

            {/* Right - CTA Content */}
            <div className="order-1 lg:order-2">
              <h2 className="mb-6 font-serif text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
                Ready to Make This Your Breakthrough Year?
              </h2>

              {/* Value props */}
              <ul className="mb-8 space-y-3">
                {[
                  'Calculate your exact GCI goal and daily activities',
                  'Track progress across all 5 sections',
                  'Access anytime, anywhere - auto-saves as you go',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="group bg-primary px-10 py-6 text-lg font-semibold shadow-lg shadow-primary/20 hover:bg-primary/90"
                >
                  <Link href="/register">
                    Start Your Plan
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>

              {/* Secondary Text */}
              <p className="mt-6 text-sm text-muted-foreground">
                Free for Power Agent members.{' '}
                <a
                  href="https://darrylspeaks.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  Learn about membership
                  <ExternalLink className="h-3 w-3" />
                </a>
              </p>
            </div>
          </div>
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
      <div className="container mx-auto px-6 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <h3 className="mb-2 text-xl font-bold">MyPlanForSuccess</h3>
            <p className="mb-4 text-sm italic text-white/70">
              Design a career and life worth smiling about.
            </p>
            <p className="text-sm text-white/60">
              Powered by Darryl Davis Seminars, Inc.
              <br />
              The company behind the Power Agent Program.
            </p>
          </div>

          {/* Links Column */}
          <div>
            <h4 className="mb-4 font-semibold text-white/90">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="text-sm text-white/60 transition hover:text-white">
                  Log In
                </Link>
              </li>
              <li>
                <Link
                  href="/register"
                  className="text-sm text-white/60 transition hover:text-white"
                >
                  Sign Up
                </Link>
              </li>
              <li>
                <a
                  href="https://darrylspeaks.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-white/60 transition hover:text-white"
                >
                  Power Agent Program
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="mb-4 font-semibold text-white/90">Contact</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-white/60">
                <Phone className="h-4 w-4" />
                631-929-5555
              </li>
              <li>
                <a
                  href="https://darrylspeaks.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-white/60 transition hover:text-white"
                >
                  DarrylSpeaks.com
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-6 py-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-white/50">
              &copy; {new Date().getFullYear()} Darryl Davis Seminars, Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-sm text-white/50 transition hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-white/50 transition hover:text-white">
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
      <ProductPreviewSection />
      <HowItWorksSection />
      <SectionPreviewsSection />
      <SocialProofSection />
      <AboutSection />
      <FinalCTASection />
      <Footer />
    </main>
  );
}
