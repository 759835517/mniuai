"use client";

import { useEffect, useState } from "react";
import { useRoadmapStore } from "@/lib/stores/roadmapStore";
import { toast } from "sonner";
import RoadmapForm from "@/components/roadmap/RoadmapForm";
import RoadmapTimeline from "@/components/roadmap/RoadmapTimeline";
import Loading from "@/components/shared/Loading";
import EmptyState from "@/components/shared/EmptyState";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import { Map } from "lucide-react";

export default function RoadmapPage() {
  const { activeRoadmap, progress, loading, generating, generate, fetchActive, updateProgress } = useRoadmapStore();
  const [showForm, setShowForm] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    fetchActive();
  }, [fetchActive]);

  const handleGenerate = async (payload: Parameters<typeof generate>[0]) => {
    try {
      await generate(payload);
      setShowForm(false);
      toast.success("路线图生成成功！");
    } catch (e) {
      toast.error("生成失败: " + (e as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">学习路线图</h1>
          <p className="mt-1 text-sm text-[#8B949E]">AI 为你定制的学习路径</p>
        </div>
        <button
          onClick={() => {
            if (activeRoadmap) {
              setConfirmOpen(true);
            } else {
              setShowForm(true);
            }
          }}
          className="rounded-md bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          {activeRoadmap ? "重新生成" : "生成路线图"}
        </button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="重新生成路线图？"
        description="重新生成后，新的路线图将成为当前激活版本。"
        confirmLabel="确认重新生成"
        onConfirm={() => {
          setConfirmOpen(false);
          setShowForm(true);
        }}
      />

      {showForm && <RoadmapForm generating={generating} onSubmit={handleGenerate} />}

      {loading && <Loading text="加载路线图..." />}

      {!loading && activeRoadmap && (
        <RoadmapTimeline
          roadmap={activeRoadmap}
          progress={progress}
          onUpdateTaskStatus={(weekNumber, taskIndex, status) =>
            updateProgress(activeRoadmap.id, weekNumber, taskIndex, status)
          }
        />
      )}

      {!loading && !activeRoadmap && !showForm && (
        <EmptyState
          icon={Map}
          title="还没有学习路线图"
          description="生成一份由 AI 定制的个性化学习路线图"
          actionLabel="生成路线图"
          onAction={() => setShowForm(true)}
        />
      )}
    </div>
  );
}
