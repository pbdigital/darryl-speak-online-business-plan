"use client";

import { WorkbookTextarea } from "../ui";
import { DarrylTip } from "@/components/business-plan/ui/darryl-tip";

export function StepGoalsIntentions() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 mx-auto max-w-3xl px-4 duration-700">
      {/* Step Header - Left aligned with Part badge */}
      <div className="mb-8">
        <span className="mb-2 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
          Part 1E
        </span>
        <h2 className="mb-2 text-3xl font-extrabold text-slate-900">
          Goals & Obstacles
        </h2>
        <p className="text-slate-600">
          What do you want, and what&apos;s in the way? Defining your goals and
          anticipating obstacles helps you prepare for success.
        </p>
      </div>

      {/* DarrylTip */}
      <DarrylTip
        tip="A goal without a plan is just a wish. Write down what could go wrong before it does, and you'll be ready when challenges appear. Anticipation beats reaction every time."
        className="mb-8"
      />

      {/* Goals and Intentions Section */}
      <div className="mb-12 space-y-4">
        <WorkbookTextarea
          label="What are your top goals or intentions for the coming year? (Personal, professional, health, relationships?)"
          fieldName="topGoalsIntentions"
          placeholder="Close 30 transactions. Hire a buyer's agent. Run a half marathon. Have dinner with family 4 nights a week..."
          rows={4}
        />
        <WorkbookTextarea
          label="Why are these goals important to you?"
          fieldName="goalsImportance"
          placeholder="30 transactions will let me save for my kids' college. The buyer's agent will free me to focus on listings..."
          rows={3}
        />
        <WorkbookTextarea
          label="How do you plan to work towards achieving these goals?"
          fieldName="goalStrategies"
          placeholder="Daily prospecting from 8-10am. Weekly pipeline review. Monthly business planning sessions..."
          rows={3}
        />
        <WorkbookTextarea
          label="What are 1-3 steps you can take right away to work towards these goals?"
          fieldName="immediateSteps"
          placeholder="1. Set up my daily prospecting block in my calendar. 2. Reach out to 3 agents about joining my team..."
          rows={3}
        />
      </div>

      {/* Obstacles and Strategies Section */}
      <h3 className="mb-6 text-lg font-bold text-slate-900">Obstacles & Strategies</h3>
      <div className="space-y-4">
        <WorkbookTextarea
          label="What potential obstacles or challenges do you foresee in achieving your goals?"
          fieldName="potentialObstacles"
          placeholder="Market uncertainty. My tendency to avoid cold calling. Finding the right buyer's agent to hire..."
          rows={4}
        />
        <WorkbookTextarea
          label="What strategies or actions can you take to overcome these obstacles?"
          fieldName="obstacleStrategies"
          placeholder="Join an accountability group for prospecting. Work with a coach on scripts. Interview 10 candidates before hiring..."
          rows={4}
        />
      </div>

      {/* Up Next */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-500">
          Up Next: Self-care and growth →
        </p>
      </div>
    </div>
  );
}
