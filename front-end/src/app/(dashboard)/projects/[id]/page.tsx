"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useProjectStore } from "@/lib/stores/projectStore";
import { toast } from "sonner";
import TaskBoard from "@/components/project/TaskBoard";
import ArchitectureView from "@/components/project/ArchitectureView";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Loading from "@/components/shared/Loading";
import EmptyState from "@/components/shared/EmptyState";
import { PROJECT_TYPE_META } from "@/lib/utils/constants";
import { formatPercent, formatDateTime } from "@/lib/utils/format";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type TabType = "overview" | "tasks";

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { currentProject, loading, fetchProject, updateTask, updateProjectStatus } = useProjectStore();
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [updatingTaskIds, setUpdatingTaskIds] = useState<string[]>([]);

  useEffect(() => {
    if (projectId) {
      fetchProject(projectId);
    }
  }, [projectId, fetchProject]);

  const handleToggleTask = async (taskId: string, completed: boolean) => {
    setUpdatingTaskIds((prev) => [...prev, taskId]);
    try {
      await updateTask(projectId, taskId, !completed);
    } catch {
      toast.error("更新任务失败");
    } finally {
      setUpdatingTaskIds((prev) => prev.filter((id) => id !== taskId));
    }
  };

  const handleUpdateStatus = async (status: string) => {
    try {
      await updateProjectStatus(projectId, status as "COMPLETED" | "ARCHIVED");
      toast.success("项目状态已更新");
    } catch {
      toast.error("更新失败");
    }
  };

  if (loading && !currentProject) {
    return <Loading text="加载项目..." className="mt-12" />;
  }

  if (!currentProject) {
    return (
      <div className="mt-12">
        <EmptyState title="项目不存在" description="找不到该项目" />
      </div>
    );
  }

  const meta = PROJECT_TYPE_META[currentProject.type];

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div>
        <Link href="/projects" className="mb-3 inline-flex items-center gap-1 text-sm text-[#8B949E] hover:text-[#F0F6FC]">
          <ArrowLeft className="h-4 w-4" />
          返回项目列表
        </Link>
        <div className="flex items-center gap-3">
          <span className="rounded bg-[#3B82F6]/20 px-2 py-0.5 text-xs font-medium text-[#3B82F6]">
            {meta?.label || currentProject.type}
          </span>
          <span className={`rounded px-2 py-0.5 text-xs ${
            currentProject.status === "ACTIVE"
              ? "bg-green-500/10 text-green-400"
              : currentProject.status === "COMPLETED"
              ? "bg-blue-500/10 text-blue-400"
              : "bg-[#30363D] text-[#8B949E]"
          }`}>
            {currentProject.status}
          </span>
        </div>
        <h1 className="mt-2 text-2xl font-bold">{currentProject.projectName || "未命名项目"}</h1>
        {currentProject.description && (
          <p className="mt-1 text-sm text-[#8B949E]">{currentProject.description}</p>
        )}
      </div>

      {/* Progress */}
      <Card className="border-[#30363D] bg-[#161B22] p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#8B949E]">完成进度</span>
          <span className="text-sm font-medium">
            {currentProject.tasks.filter((t) => t.completed).length}/{currentProject.tasks.length} 任务 ({formatPercent(currentProject.completionRate)})
          </span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#1C2128]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] transition-all"
            style={{ width: `${currentProject.completionRate * 100}%` }}
          />
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#30363D]">
        {(["overview", "tasks"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "border-[#3B82F6] text-[#3B82F6]"
                : "border-transparent text-[#8B949E] hover:text-[#F0F6FC]"
            }`}
          >
            {tab === "overview" ? "概览" : "任务"}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          {currentProject.plan && (
            <Card className="border-[#30363D] bg-[#161B22] p-6">
              <h3 className="mb-3 font-semibold">项目计划</h3>
              <p className="text-sm text-[#8B949E]">{currentProject.plan.summary}</p>

              {currentProject.plan.milestones.length > 0 && (
                <div className="mt-4">
                  <h4 className="mb-2 text-sm font-medium text-[#F0F6FC]">里程碑</h4>
                  <div className="space-y-2">
                    {currentProject.plan.milestones.map((m, i) => (
                      <div key={i} className="rounded-md border border-[#30363D] bg-[#0D1117] p-3">
                        <p className="text-sm font-medium">{m.title}</p>
                        <p className="mt-1 text-xs text-[#8B949E]">{m.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentProject.plan.risks && currentProject.plan.risks.length > 0 && (
                <div className="mt-4">
                  <h4 className="mb-2 text-sm font-medium text-[#F0F6FC]">风险</h4>
                  <ul className="list-disc pl-5 text-sm text-[#8B949E]">
                    {currentProject.plan.risks.map((r, i) => (
                      <li key={i} className="mb-1">{r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          )}

          {currentProject.plan?.architectureMermaid && (
            <ArchitectureView mermaidCode={currentProject.plan.architectureMermaid} />
          )}

          {currentProject.techStack && (
            <Card className="border-[#30363D] bg-[#161B22] p-6">
              <h3 className="mb-3 font-semibold">技术栈</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {(["backend", "frontend", "database", "ai"] as const).map((category) => {
                  const items = currentProject.techStack?.[category];
                  if (!items || items.length === 0) return null;
                  return (
                    <div key={category}>
                      <p className="mb-1 text-xs font-medium uppercase text-[#8B949E]">{category}</p>
                      <div className="flex flex-wrap gap-1">
                        {items.map((item) => (
                          <span key={item} className="rounded bg-[#30363D] px-2 py-0.5 text-xs text-[#F0F6FC]">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          <Card className="border-[#30363D] bg-[#161B22] p-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-[#8B949E]">创建时间</span>
                <p className="mt-1">{formatDateTime(currentProject.createdAt)}</p>
              </div>
              <div>
                <span className="text-[#8B949E]">更新时间</span>
                <p className="mt-1">{formatDateTime(currentProject.updatedAt)}</p>
              </div>
            </div>
          </Card>

          {currentProject.status === "ACTIVE" && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleUpdateStatus("COMPLETED")}
                className="border-[#30363D] text-[#F0F6FC]"
              >
                标记为完成
              </Button>
              <Button
                variant="outline"
                onClick={() => handleUpdateStatus("ARCHIVED")}
                className="border-[#30363D] text-[#8B949E]"
              >
                归档
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Tasks Tab */}
      {activeTab === "tasks" && (
        <TaskBoard
          tasks={currentProject.tasks}
          updatingTaskIds={updatingTaskIds}
          onToggleTask={handleToggleTask}
        />
      )}
    </div>
  );
}
