"use client";

interface ProgressTrackerProps {
  completedTasks: number;
  totalTasks: number;
  completionRate: number;
}

export default function ProgressTracker({ completedTasks, totalTasks, completionRate }: ProgressTrackerProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm text-[#8B949E]">总体进度</span>
        <span className="text-sm font-medium">{isNaN(completionRate) ? 0 : Math.round(completionRate * 100)}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-[#1C2128]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] transition-all"
          style={{ width: `${completionRate * 100}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-[#8B949E]">
        {completedTasks} / {totalTasks} 任务已完成
      </p>
    </div>
  );
}
