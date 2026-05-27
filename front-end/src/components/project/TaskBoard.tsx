"use client";

import { CheckCircle2, Circle } from "lucide-react";
import type { ProjectTask } from "@/lib/types/project";

interface TaskBoardProps {
  tasks: ProjectTask[];
  updatingTaskIds: string[];
  onToggleTask: (taskId: string, completed: boolean) => Promise<void>;
}

export default function TaskBoard({ tasks, updatingTaskIds, onToggleTask }: TaskBoardProps) {
  const sorted = [...tasks].sort((a, b) => a.sortOrder - b.sortOrder);
  const todoTasks = sorted.filter((t) => !t.completed);
  const doneTasks = sorted.filter((t) => t.completed);

  if (tasks.length === 0) {
    return (
      <div className="rounded-lg border border-[#30363D] bg-[#161B22] p-8 text-center text-sm text-[#8B949E]">
        暂无任务
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Todo */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <Circle className="h-4 w-4 text-[#484F58]" />
          <span className="text-sm font-medium">待完成 ({todoTasks.length})</span>
        </div>
        <div className="space-y-2">
          {todoTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              loading={updatingTaskIds.includes(task.id)}
              onToggle={onToggleTask}
            />
          ))}
        </div>
      </div>

      {/* Done */}
      <div>
        <div className="mb-3 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-400" />
          <span className="text-sm font-medium">已完成 ({doneTasks.length})</span>
        </div>
        <div className="space-y-2">
          {doneTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              loading={updatingTaskIds.includes(task.id)}
              onToggle={onToggleTask}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function TaskCard({
  task,
  loading,
  onToggle,
}: {
  task: ProjectTask;
  loading: boolean;
  onToggle: (taskId: string, completed: boolean) => Promise<void>;
}) {
  return (
    <div className="flex items-start gap-3 rounded-md border border-[#30363D] bg-[#161B22] p-4">
      <button
        onClick={() => onToggle(task.id, task.completed)}
        disabled={loading}
        className="mt-0.5 shrink-0"
      >
        {task.completed ? (
          <CheckCircle2 className="h-5 w-5 text-green-400" />
        ) : (
          <Circle className="h-5 w-5 text-[#484F58]" />
        )}
      </button>
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-medium ${task.completed ? "text-[#8B949E] line-through" : ""}`}>
          {task.title}
        </p>
        {task.description && (
          <p className="mt-1 line-clamp-3 text-xs text-[#8B949E]">{task.description}</p>
        )}
      </div>
      {task.estimatedHours && (
        <span className="shrink-0 text-xs text-[#484F58]">{task.estimatedHours}h</span>
      )}
    </div>
  );
}
