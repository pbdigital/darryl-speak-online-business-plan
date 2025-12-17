"use client";

import { LayoutGrid } from "lucide-react";
import { useSectionFiveStore } from "@/stores/section-five-store";
import {
  StepContainer,
  StepHeader,
  UpNextFooter,
  DarrylTip,
} from "@/components/business-plan/ui";
import { ProjectMatrixGrid } from "../ui/project-matrix-grid";

export function StepProjectMatrix() {
  const projectMatrix = useSectionFiveStore((state) => state.data.projectMatrix);
  const updateProjectName = useSectionFiveStore((state) => state.updateProjectName);
  const updateProjectTask = useSectionFiveStore((state) => state.updateProjectTask);

  return (
    <StepContainer className="max-w-4xl">
      <StepHeader
        part="Part 5A"
        title="Project Matrix"
        highlightWord="Matrix"
        subtitle="A visual planning tool that helps you manage multiple business projects simultaneously by breaking down goals into specific tasks."
        icon={LayoutGrid}
      />

      <DarrylTip
        tip="The magic of the Project Matrix is working horizontally—complete the first task from each project before moving down. This keeps all your priorities moving forward, not just the easy ones."
        className="mb-8"
      />

      {/* How to Use It */}
      <div className="mb-8 rounded-2xl border-2 border-slate-100 bg-[#e8f4f8]/30 p-6">
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-900">
          How to Use Your Project Matrix
        </h3>
        <ol className="space-y-2 text-sm text-slate-600">
          <li className="flex gap-2">
            <span className="font-bold text-[#1a2744]">1.</span>
            <span><strong>List 3-5 major projects</strong> across the column headers (things like &quot;List 24 Properties&quot; or &quot;Build CRM&quot;)</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-[#1a2744]">2.</span>
            <span><strong>Break each project into tasks</strong> — list them vertically from first to last</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-[#1a2744]">3.</span>
            <span><strong>Work the top row daily</strong> — complete one task from each active project before moving down</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-[#1a2744]">4.</span>
            <span><strong>Track your progress</strong> — mark off completed tasks and celebrate small wins</span>
          </li>
        </ol>
      </div>

      {/* Example Projects */}
      <div className="mb-8 rounded-2xl border-2 border-slate-100 bg-white p-6">
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-900">
          Example Project Ideas
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            "List 24 Properties",
            "Hire an Assistant",
            "Build/Update CRM",
            "Work a Farm Area",
            "Write 1 Contract/Month",
            "Launch YouTube Channel",
            "Host Monthly Open Houses",
            "Build Referral Network",
          ].map((project) => (
            <span
              key={project}
              className="rounded-full bg-[#e8f4f8] px-3 py-1 text-xs text-slate-600"
            >
              {project}
            </span>
          ))}
        </div>
      </div>

      {/* Project Matrix Grid */}
      <div className="mb-8">
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-900">
          My 2026 Project Matrix
        </h3>
        <ProjectMatrixGrid
          projectNames={projectMatrix.projectNames}
          tasks={projectMatrix.tasks}
          onProjectNameChange={updateProjectName}
          onTaskChange={updateProjectTask}
        />
      </div>

      <UpNextFooter text="Explore your current and needed resources" />
    </StepContainer>
  );
}
