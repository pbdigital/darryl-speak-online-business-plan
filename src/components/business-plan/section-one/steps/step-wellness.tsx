"use client";

import { WorkbookTextarea } from "../ui";
import { DarrylTip } from "@/components/business-plan/ui/darryl-tip";

export function StepWellness() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-3xl px-4 duration-700">
      {/* Step Header - Left aligned with Part badge */}
      <div className="mb-8">
        <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
          Part 1F
        </span>
        <h2 className="mb-2 text-3xl font-extrabold text-slate-900">
          Self-Care & Growth
        </h2>
        <p className="text-slate-600">
          You are the most valuable asset in your business. Investing in yourself
          is investing in your success.
        </p>
      </div>

      {/* DarrylTip */}
      <DarrylTip
        tip="You are your business's most valuable asset. When you invest in your health, education, and well-being, you're investing in your clients' experience too."
        className="mb-8"
      />

      {/* Self-Care and Well-Being Section */}
      <div className="mb-12">
        <h3 className="mb-6 text-lg font-bold text-slate-900">Self-Care and Well-Being</h3>
        <div className="space-y-4">
          <WorkbookTextarea
            label="What self-care practices or habits do you want to prioritize in the coming year?"
            fieldName="selfCarePriorities"
            placeholder="Morning walks before calls. No work emails after 7pm. One day off per week - no exceptions..."
            rows={3}
          />
          <WorkbookTextarea
            label="How will you nurture your mental, emotional, and physical well-being?"
            fieldName="nurturingWellbeing"
            placeholder="Weekly therapy sessions. Gym 3x per week. Monthly dinner with friends outside of real estate..."
            rows={3}
          />
          <WorkbookTextarea
            label="What are some methods that contribute to your self-care that you enjoy?"
            fieldName="selfCareMethods"
            placeholder="Playing golf on Sundays. Reading fiction before bed. Cooking dinner with my spouse..."
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
            fieldName="skillsToImprove"
            placeholder="Master video marketing for listings. Improve my listing presentation close rate. Learn to delegate better..."
            rows={3}
          />
          <WorkbookTextarea
            label="How will you commit to continuous learning and personal growth?"
            fieldName="learningCommitment"
            placeholder="Read one business book per month. Attend the Power Agent Summit. Join a mastermind group..."
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
            fieldName="giveBackCommunity"
            placeholder="Mentor 2 new agents. Volunteer at Habitat for Humanity builds. Sponsor a Little League team..."
            rows={3}
          />
          <WorkbookTextarea
            label="How can you make a positive impact on others?"
            fieldName="positiveImpact"
            placeholder="Be known as the agent who truly cares about clients, not just commissions. Help first-time buyers feel confident..."
            rows={3}
          />
        </div>
      </div>

      {/* Up Next */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500">
          Up Next: Your mantra and accountability →
        </p>
      </div>
    </div>
  );
}
