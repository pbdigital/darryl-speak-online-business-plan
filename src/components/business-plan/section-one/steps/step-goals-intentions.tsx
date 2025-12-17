"use client";

import { Target, Shield } from "lucide-react";
import { WorkbookTextarea, StepContainer, StepHeader, UpNextFooter } from "../ui";
import { DarrylTip } from "@/components/business-plan/ui/darryl-tip";

export function StepGoalsIntentions() {
  return (
    <StepContainer>
      <StepHeader
        part="Part 1E"
        title="Goals & Obstacles"
        highlightWord="Goals"
        subtitle="What do you want, and what's in the way? Define your goals and anticipate obstacles to prepare for success."
        icon={Target}
      />

      <DarrylTip
        tip="A goal without a plan is just a wish. Write down what could go wrong before it does, and you'll be ready when challenges appear. Anticipation beats reaction every time."
        className="mb-10"
      />

      {/* Goals and Intentions Section */}
      <section className="mb-12">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f4f8]">
            <Target className="h-5 w-5 text-[#1a2744]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Goals and Intentions</h2>
            <p className="text-sm text-slate-500">Define what you want to achieve</p>
          </div>
        </div>

        <div className="space-y-6">
          <WorkbookTextarea
            number={1}
            label="What are your top goals or intentions for the coming year? (Personal, professional, health, relationships?)"
            fieldName="topGoalsIntentions"
            placeholder="Close 30 transactions. Hire a buyer's agent. Run a half marathon. Have dinner with family 4 nights a week..."
          />
          <WorkbookTextarea
            number={2}
            label="Why are these goals important to you?"
            fieldName="goalsImportance"
            placeholder="30 transactions will let me save for my kids' college. The buyer's agent will free me to focus on listings..."
          />
          <WorkbookTextarea
            number={3}
            label="How do you plan to work towards achieving these goals?"
            fieldName="goalStrategies"
            placeholder="Daily prospecting from 8-10am. Weekly pipeline review. Monthly business planning sessions..."
          />
          <WorkbookTextarea
            number={4}
            label="What are 1-3 steps you can take right away to work towards these goals?"
            fieldName="immediateSteps"
            placeholder="1. Set up my daily prospecting block in my calendar. 2. Reach out to 3 agents about joining my team..."
          />
        </div>
      </section>

      {/* Obstacles and Strategies Section */}
      <section>
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f4f8]">
            <Shield className="h-5 w-5 text-[#1a2744]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Obstacles & Strategies</h2>
            <p className="text-sm text-slate-500">Prepare for challenges ahead</p>
          </div>
        </div>

        <div className="space-y-6">
          <WorkbookTextarea
            number={5}
            label="What potential obstacles or challenges do you foresee in achieving your goals?"
            fieldName="potentialObstacles"
            placeholder="Market uncertainty. My tendency to avoid cold calling. Finding the right buyer's agent to hire..."
          />
          <WorkbookTextarea
            number={6}
            label="What strategies or actions can you take to overcome these obstacles?"
            fieldName="obstacleStrategies"
            placeholder="Join an accountability group for prospecting. Work with a coach on scripts. Interview 10 candidates before hiring..."
          />
        </div>
      </section>

      <UpNextFooter text="Self-care and growth" />
    </StepContainer>
  );
}
