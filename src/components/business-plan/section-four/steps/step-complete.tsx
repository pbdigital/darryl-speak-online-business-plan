"use client";

import { Smile, CheckCircle2 } from "lucide-react";
import { useSectionFourStore } from "@/stores/section-four-store";

export function StepComplete() {
  const {
    getFilledAffirmations,
    getFilledBoundaries,
    getFilledSelfCare,
    getFilledSupport,
    getFilledFieldCount,
  } = useSectionFourStore();

  const filledAffirmations = getFilledAffirmations();
  const filledBoundaries = getFilledBoundaries();
  const filledSelfCare = getFilledSelfCare();
  const filledSupport = getFilledSupport();
  const totalFilled = getFilledFieldCount();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-3xl px-4 duration-700">
      {/* Success Hero */}
      <div className="mb-8 rounded-3xl bg-[#0F172A] p-8 text-center text-white shadow-xl md:p-12">
        <div className="mb-4 inline-flex rounded-full bg-white/10 p-4">
          <Smile className="h-12 w-12" />
        </div>
        <h2 className="mb-2 text-3xl font-extrabold md:text-4xl">
          Section 4 Complete!
        </h2>
        <p className="text-lg text-slate-300">
          You&apos;ve built your personal mindset system. This foundation will keep you
          grounded, focused, and motivated throughout 2026.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
            Affirmations
          </p>
          <p className="text-2xl font-extrabold text-[#0F172A]">
            {filledAffirmations.length}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
            Boundaries
          </p>
          <p className="text-2xl font-extrabold text-[#0F172A]">
            {filledBoundaries.length}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
            Self-Care
          </p>
          <p className="text-2xl font-extrabold text-[#0F172A]">
            {filledSelfCare.length}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">
            Support
          </p>
          <p className="text-2xl font-extrabold text-[#0F172A]">
            {filledSupport.length}
          </p>
        </div>
      </div>

      {/* Section Summary */}
      <div className="mb-8 rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-700">
          Your Mindset System Summary
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
            <div>
              <p className="font-medium text-slate-900">Motivating Affirmations</p>
              <p className="text-sm text-slate-500">
                {filledAffirmations.length} affirmation{filledAffirmations.length !== 1 ? "s" : ""} to reinforce your identity
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
            <div>
              <p className="font-medium text-slate-900">Grounding Rituals</p>
              <p className="text-sm text-slate-500">
                Morning and evening routines defined
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
            <div>
              <p className="font-medium text-slate-900">Boundaries & Self-Care</p>
              <p className="text-sm text-slate-500">
                {filledBoundaries.length} boundaries and {filledSelfCare.length} self-care commitments
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
            <div>
              <p className="font-medium text-slate-900">Support Network</p>
              <p className="text-sm text-slate-500">
                {filledSupport.length} support resource{filledSupport.length !== 1 ? "s" : ""} identified
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reminder Box */}
      <div className="mb-8 rounded-xl border border-[#0F172A] bg-[#0F172A]/5 p-6">
        <p className="text-sm leading-relaxed text-slate-700">
          <strong className="text-[#0F172A]">Remember:</strong> By clarifying what strengthens
          your mindset, protects your energy, and keeps you motivated, you&apos;ve created a
          foundation that supports consistent action. When the market shifts, when deals fall
          through, or when burnout creeps in, this system brings you back to center.
        </p>
      </div>

      {/* Next Steps */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-700">
          What&apos;s Next?
        </h3>
        <ul className="space-y-3 text-sm text-slate-600">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0F172A] text-xs font-bold text-white">
              1
            </span>
            <span>
              Complete <strong className="text-[#0F172A]">Section 5: Accountability & Progress Tracking</strong> to
              create your action plan and tracking systems
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0F172A] text-xs font-bold text-white">
              2
            </span>
            <span>
              Print or save your affirmations somewhere visible—read them every morning
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0F172A] text-xs font-bold text-white">
              3
            </span>
            <span>
              Share your boundaries with someone who will hold you accountable
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
