"use client";

import { WorkbookTextarea } from "../ui";

export function StepWellness() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-3xl px-4 duration-700">
      <div className="mb-10 text-center">
        <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-blue-600">
          Step 6 of 8
        </span>
        <h2 className="mb-2 text-3xl font-extrabold text-slate-900">
          Self-Care & Growth
        </h2>
        <p className="text-slate-500">
          You are the most valuable asset in your business.
        </p>
      </div>

      <div className="space-y-4">
        <WorkbookTextarea
          label="What self-care practices will you prioritize in 2026?"
          placeholder="Meditation, exercise, time off, hobbies, sleep, nutrition..."
          rows={3}
        />
        <WorkbookTextarea
          label="What skills do you want to acquire or improve?"
          placeholder="Negotiation, social media marketing, video content, leadership, delegation..."
          rows={3}
        />
        <WorkbookTextarea
          label="What books, courses, or mentors will help you grow?"
          placeholder="Reading list, training programs, coaches, mastermind groups..."
          rows={3}
        />
      </div>

      {/* Giving Back Section */}
      <div className="mt-12 rounded-2xl border border-emerald-200 bg-emerald-50 p-8">
        <h3 className="mb-6 border-b border-emerald-200 pb-4 text-sm font-bold uppercase tracking-wider text-emerald-900">
          Giving Back & Contribution
        </h3>
        <div className="space-y-4">
          <WorkbookTextarea
            label="How do you want to give back to your community or industry?"
            placeholder="Volunteering, mentoring, charity work, community involvement..."
            rows={3}
          />
          <WorkbookTextarea
            label="What impact do you want to have on others?"
            placeholder="How do you want to be remembered? What legacy do you want to build?"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}
