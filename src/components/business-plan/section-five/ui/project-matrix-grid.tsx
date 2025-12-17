"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProjectMatrixGridProps {
  projectNames: string[];
  tasks: string[][];
  onProjectNameChange: (index: number, value: string) => void;
  onTaskChange: (projectIndex: number, taskIndex: number, value: string) => void;
  className?: string;
}

export function ProjectMatrixGrid({
  projectNames,
  tasks,
  onProjectNameChange,
  onTaskChange,
  className,
}: ProjectMatrixGridProps) {
  const [focusedCell, setFocusedCell] = useState<string | null>(null);

  return (
    <div className={cn("w-full", className)}>
      {/* Desktop view - horizontal scroll for table */}
      <div className="overflow-x-auto rounded-2xl border-2 border-slate-100 bg-white">
        <table className="w-full min-w-[700px] border-collapse">
          {/* Project Names Header Row */}
          <thead>
            <tr className="bg-[#1a2744]">
              <th className="w-12 border-b border-r border-slate-600 p-3 text-center text-xs font-bold uppercase tracking-wider text-white">
                Task
              </th>
              {projectNames.map((name, index) => (
                <th
                  key={`header-${index}`}
                  className="border-b border-r border-slate-600 p-0 last:border-r-0"
                >
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => onProjectNameChange(index, e.target.value)}
                    onFocus={() => setFocusedCell(`header-${index}`)}
                    onBlur={() => setFocusedCell(null)}
                    placeholder={`Project ${index + 1}`}
                    className={cn(
                      "w-full bg-transparent p-3 text-center text-sm font-bold text-white outline-none transition-all placeholder:font-normal placeholder:text-slate-400",
                      focusedCell === `header-${index}` && "bg-white/10",
                      name.trim() && "text-white"
                    )}
                  />
                </th>
              ))}
            </tr>
          </thead>

          {/* Task Rows */}
          <tbody>
            {Array.from({ length: 6 }, (_, taskIndex) => (
              <tr
                key={`row-${taskIndex}`}
                className={taskIndex % 2 === 0 ? "bg-white" : "bg-[#e8f4f8]/30"}
              >
                <td className="border-b border-r border-slate-200 p-3 text-center text-xs font-medium text-slate-400">
                  {taskIndex + 1}
                </td>
                {projectNames.map((_, projectIndex) => {
                  const cellId = `cell-${projectIndex}-${taskIndex}`;
                  const taskValue = tasks[projectIndex]?.[taskIndex] || "";
                  return (
                    <td
                      key={cellId}
                      className="border-b border-r border-slate-200 p-0 last:border-r-0"
                    >
                      <input
                        type="text"
                        value={taskValue}
                        onChange={(e) =>
                          onTaskChange(projectIndex, taskIndex, e.target.value)
                        }
                        onFocus={() => setFocusedCell(cellId)}
                        onBlur={() => setFocusedCell(null)}
                        placeholder="Enter task..."
                        className={cn(
                          "w-full bg-transparent p-3 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-300",
                          focusedCell === cellId && "bg-[#e8f4f8]/50",
                          taskValue.trim() && "border-l-2 border-l-slate-400"
                        )}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Helper text */}
      <p className="mt-3 text-center text-xs text-slate-400">
        Tip: Work across the top row first, completing one task from each project daily.
      </p>
    </div>
  );
}
