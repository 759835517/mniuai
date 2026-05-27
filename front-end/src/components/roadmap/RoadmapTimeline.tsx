"use client";

import { Card } from "@/components/ui/card";
import ProgressTracker from "./ProgressTracker";
import type { LearningRoadmap, RoadmapProgress, RoadmapTaskStatus } from "@/lib/types/roadmap";
import { CheckCircle2, Circle, Clock } from "lucide-react";

interface RoadmapTimelineProps {
  roadmap: LearningRoadmap;
  progress: RoadmapProgress | null;
  onUpdateTaskStatus: (weekNumber: number, taskIndex: number, status: RoadmapTaskStatus) => Promise<void>;
}

export default function RoadmapTimeline({ roadmap, progress, onUpdateTaskStatus }: RoadmapTimelineProps) {
  const getTaskStatus = (weekNumber: number, taskIndex: number): RoadmapTaskStatus => {
    const item = progress?.items.find((i) => i.weekNumber === weekNumber && i.taskIndex === taskIndex);
    return item?.status || "NOT_STARTED";
  };

  return (
    <div className="space-y-4">
      {/* Progress Summary */}
      {progress && (
        <Card className="border-[#30363D] bg-[#161B22] p-6">
          <p className="mb-4 text-sm text-[#8B949E]">{roadmap.roadmap.summary}</p>
          <ProgressTracker
            completedTasks={progress.completedTasks}
            totalTasks={progress.totalTasks}
            completionRate={progress.completionRate}
          />
        </Card>
      )}

      {/* Weeks */}
      {roadmap.roadmap.weeks.map((week) => (
        <Card key={week.week} className="border-[#30363D] bg-[#161B22] p-6">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#3B82F6]/20 text-sm font-bold text-[#3B82F6]">
              {week.week}
            </div>
            <div>
              <h3 className="font-semibold">{week.theme}</h3>
              <div className="mt-1 flex flex-wrap gap-1">
                {week.objectives.map((obj, i) => (
                  <span key={i} className="rounded bg-[#30363D] px-2 py-0.5 text-xs text-[#8B949E]">
                    {obj}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {week.tasks.map((task, taskIdx) => {
              const status = getTaskStatus(week.week, taskIdx);
              return (
                <div key={taskIdx} className="flex items-start gap-3 rounded-md border border-[#30363D] bg-[#0D1117] p-3">
                  <button
                    onClick={() => {
                      const next: RoadmapTaskStatus =
                        status === "COMPLETED" ? "NOT_STARTED"
                        : status === "NOT_STARTED" ? "IN_PROGRESS"
                        : "COMPLETED";
                      onUpdateTaskStatus(week.week, taskIdx, next);
                    }}
                    className="mt-0.5 shrink-0"
                  >
                    {status === "COMPLETED" ? (
                      <CheckCircle2 className="h-5 w-5 text-green-400" />
                    ) : status === "IN_PROGRESS" ? (
                      <Clock className="h-5 w-5 text-amber-400" />
                    ) : (
                      <Circle className="h-5 w-5 text-[#484F58]" />
                    )}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium ${status === "COMPLETED" ? "text-[#8B949E] line-through" : ""}`}>
                      {task.title}
                    </p>
                    <p className="mt-1 text-xs text-[#8B949E]">{task.description}</p>
                    {task.deliverable && (
                      <p className="mt-1 text-xs text-[#3B82F6]">交付物: {task.deliverable}</p>
                    )}
                  </div>
                  <span className="shrink-0 text-xs text-[#484F58]">{task.estimatedHours}h</span>
                </div>
              );
            })}
          </div>
        </Card>
      ))}
    </div>
  );
}
