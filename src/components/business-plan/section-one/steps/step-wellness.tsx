"use client";

import { Sparkles, Brain, HandHeart } from "lucide-react";
import { WorkbookTextarea, StepContainer, StepHeader, UpNextFooter } from "../ui";
import { DarrylTip } from "@/components/business-plan/ui/darryl-tip";

export function StepWellness() {
  return (
    <StepContainer>
      <StepHeader
        part="Part 1F"
        title="Self-Care & Growth"
        highlightWord="Growth"
        subtitle="You are the most valuable asset in your business. Investing in yourself is investing in your success."
        icon={Sparkles}
      />

      <DarrylTip
        tip="You are your business's most valuable asset. When you invest in your health, education, and well-being, you're investing in your clients' experience too."
        className="mb-10"
      />

      {/* Self-Care and Well-Being Section */}
      <section className="mb-12">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f4f8]">
            <Sparkles className="h-5 w-5 text-[#1a2744]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Self-Care and Well-Being</h2>
            <p className="text-sm text-slate-500">Prioritize your wellness</p>
          </div>
        </div>

        <div className="space-y-6">
          <WorkbookTextarea
            number={1}
            label="What self-care practices or habits do you want to prioritize in the coming year?"
            fieldName="selfCarePriorities"
            placeholder="Morning walks before calls. No work emails after 7pm. One day off per week - no exceptions..."
          />
          <WorkbookTextarea
            number={2}
            label="How will you nurture your mental, emotional, and physical well-being?"
            fieldName="nurturingWellbeing"
            placeholder="Weekly therapy sessions. Gym 3x per week. Monthly dinner with friends outside of real estate..."
          />
          <WorkbookTextarea
            number={3}
            label="What are some methods that contribute to your self-care that you enjoy?"
            fieldName="selfCareMethods"
            placeholder="Playing golf on Sundays. Reading fiction before bed. Cooking dinner with my spouse..."
          />
        </div>
      </section>

      {/* Personal Growth and Learning Section */}
      <section className="mb-12">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f4f8]">
            <Brain className="h-5 w-5 text-[#1a2744]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Personal Growth and Learning</h2>
            <p className="text-sm text-slate-500">Invest in your development</p>
          </div>
        </div>

        <div className="space-y-6">
          <WorkbookTextarea
            number={4}
            label="What skills or knowledge do you want to acquire or improve upon in the next year?"
            fieldName="skillsToImprove"
            placeholder="Master video marketing for listings. Improve my listing presentation close rate. Learn to delegate better..."
          />
          <WorkbookTextarea
            number={5}
            label="How will you commit to continuous learning and personal growth?"
            fieldName="learningCommitment"
            placeholder="Read one business book per month. Attend the POWER AGENT® Summit. Join a mastermind group..."
          />
        </div>
      </section>

      {/* Giving Back Section */}
      <section>
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f4f8]">
            <HandHeart className="h-5 w-5 text-[#1a2744]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Giving Back & Contribution</h2>
            <p className="text-sm text-slate-500">Make a positive impact</p>
          </div>
        </div>

        <div className="space-y-6">
          <WorkbookTextarea
            number={6}
            label="In what ways do you want to give back or contribute to your community or causes you care about in the next year?"
            fieldName="giveBackCommunity"
            placeholder="Mentor 2 new agents. Volunteer at Habitat for Humanity builds. Sponsor a Little League team..."
          />
          <WorkbookTextarea
            number={7}
            label="How can you make a positive impact on others?"
            fieldName="positiveImpact"
            placeholder="Be known as the agent who truly cares about clients, not just commissions. Help first-time buyers feel confident..."
          />
        </div>
      </section>

      <UpNextFooter text="Your mantra and accountability" />
    </StepContainer>
  );
}
