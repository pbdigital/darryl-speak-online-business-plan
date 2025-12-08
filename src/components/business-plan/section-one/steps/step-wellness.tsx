"use client";

import { WorkbookTextarea } from "../ui";

export function StepWellness() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-3xl px-4 duration-700">
      <div className="mb-10 text-center">
        <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-blue-600">
          Step 6 of 9
        </span>
        <h2 className="mb-2 text-3xl font-extrabold text-slate-900">
          Self-Care & Growth
        </h2>
        <p className="text-slate-500">
          You are the most valuable asset in your business.
        </p>
      </div>

      {/* Self-Care and Well-Being Section */}
      <div className="mb-12">
        <h3 className="mb-6 text-lg font-bold text-slate-900">Self-Care and Well-Being</h3>
        <div className="space-y-4">
          <WorkbookTextarea
            label="What self-care practices or habits do you want to prioritize in the coming year?"
            placeholder="Meditation, exercise, time off, hobbies, sleep, nutrition..."
            rows={3}
          />
          <WorkbookTextarea
            label="How will you nurture your mental, emotional, and physical well-being?"
            placeholder="Therapy, journaling, boundaries, rest, movement, connection..."
            rows={3}
          />
          <WorkbookTextarea
            label="What are some methods that contribute to your self-care that you enjoy?"
            placeholder="Activities that recharge you and bring you joy..."
            rows={3}
          />
        </div>
      </div>

      {/* Personal Growth and Learning Section */}
      <div className="mb-12">
        <h3 className="mb-6 text-lg font-bold text-slate-900">Personal Growth and Learning</h3>
        <div className="space-y-4">
          <WorkbookTextarea
            label="What skills or knowledge do you want to acquire or improve upon in the next year?"
            placeholder="Negotiation, social media marketing, video content, leadership, delegation..."
            rows={3}
          />
          <WorkbookTextarea
            label="How will you commit to continuous learning and personal growth?"
            placeholder="Reading list, training programs, coaches, mastermind groups, certifications..."
            rows={3}
          />
        </div>
      </div>

      {/* Giving Back Section */}
      <div>
        <h3 className="mb-6 text-lg font-bold text-slate-900">Giving Back & Contribution</h3>
        <div className="space-y-4">
          <WorkbookTextarea
            label="In what ways do you want to give back or contribute to your community or causes you care about in the next year?"
            placeholder="Volunteering, mentoring, charity work, community involvement..."
            rows={3}
          />
          <WorkbookTextarea
            label="How can you make a positive impact on others?"
            placeholder="How do you want to be remembered? What legacy do you want to build?"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}
