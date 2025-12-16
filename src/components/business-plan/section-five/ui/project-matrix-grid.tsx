"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectMatrixGridProps {
  projectNames: string[];
  tasks: string[][];
  onProjectNameChange: (index: number, value: string) => void;
  onTaskChange: (projectIndex: number, taskIndex: number, value: string) => void;
  onClearProject?: (index: number) => void;
  className?: string;
}

export function ProjectMatrixGrid({
  projectNames,
  tasks,
  onProjectNameChange,
  onTaskChange,
  onClearProject,
  className,
}: ProjectMatrixGridProps) {
  const [focusedCell, setFocusedCell] = useState<string | null>(null);
  const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);

  const hasContent = (index: number) => {
    const hasName = projectNames[index]?.trim();
    const hasTasks = tasks[index]?.some((t) => t.trim());
    return hasName || hasTasks;
  };

  return (
    <div className={cn("w-full", className)}>
      {/* Desktop view - horizontal scroll for table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[700px] border-collapse">
          {/* Project Names Header Row */}
          <thead>
            <tr className="bg-slate-50">
              <th className="w-12 border-b border-r border-slate-200 p-3 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                Task
              </th>
              {projectNames.map((name, index) => (
                <th
                  key={`header-${index}`}
                  className="relative border-b border-r border-slate-200 p-0 last:border-r-0"
                  onMouseEnter={() => setHoveredColumn(index)}
                  onMouseLeave={() => setHoveredColumn(null)}
                >
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => onProjectNameChange(index, e.target.value)}
                      onFocus={() => setFocusedCell(`header-${index}`)}
                      onBlur={() => setFocusedCell(null)}
                      placeholder={`Project ${index + 1}`}
                      className={cn(
                        "w-full bg-transparent p-3 pr-8 text-center text-sm font-bold text-slate-900 outline-none transition-all placeholder:font-normal placeholder:text-slate-300",
                        focusedCell === `header-${index}` && "bg-blue-50",
                        name.trim() && "text-emerald-700"
                      )}
                    />
                    {onClearProject && hasContent(index) && (
                      <button
                        type="button"
                        onClick={() => onClearProject(index)}
                        className={cn(
                          "absolute right-1 top-1/2 -translate-y-1/2 rounded p-1 transition-colors hover:bg-red-50 hover:text-red-500",
                          // Always visible on touch devices, hover-only on pointer devices
                          hoveredColumn === index
                            ? "text-slate-400"
                            : "text-slate-300 opacity-0 [@media(hover:none)]:opacity-100"
                        )}
                        title="Clear project"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Task Rows */}
          <tbody>
            {Array.from({ length: 6 }, (_, taskIndex) => (
              <tr
                key={`row-${taskIndex}`}
                className={taskIndex % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
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
                          focusedCell === cellId && "bg-blue-50",
                          taskValue.trim() && "border-l-2 border-l-emerald-400"
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
