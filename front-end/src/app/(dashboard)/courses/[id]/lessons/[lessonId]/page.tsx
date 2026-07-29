"use client";

import { useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { useCourseStore } from "@/lib/stores/courseStore";
import { useVideoHeartbeat } from "@/hooks/useVideoHeartbeat";
import { HlsPlayer } from "@/components/video/HlsPlayer";
import { toast } from "sonner";
import Loading from "@/components/shared/Loading";

export default function LessonPage() {
  const { id, lessonId } = useParams<{ id: string; lessonId: string }>();
  const { playUrl, lessonProgress, fetchPlayUrl, fetchLessonProgress } = useCourseStore();
  const { updatePosition, reportSeek } = useVideoHeartbeat({ lessonId });

  useEffect(() => {
    fetchPlayUrl(lessonId);
    fetchLessonProgress(lessonId);
  }, [lessonId, fetchPlayUrl, fetchLessonProgress]);

  const handleTimeUpdate = useCallback(
    (currentTime: number, duration: number) => {
      updatePosition(currentTime, 1);
    },
    [updatePosition]
  );

  const handleRateChange = useCallback(
    (rate: number) => {
      if (rate > 2.0) {
        toast.warning("倍速超过 2x 将不计入学习进度");
      }
    },
    []
  );

  if (!playUrl) return <Loading text="加载视频..." className="mt-12" />;

  // 优先使用 HLS manifest URL，否则 fallback 到 MP4
  const streamSrc = playUrl.hlsManifestUrl ?? playUrl.videoUrl;

  return (
    <div className="space-y-6">
      <button onClick={() => window.history.back()} className="text-sm text-[#8B949E] hover:text-[#F0F6FC]">
        ← 返回课程
      </button>

      <Card className="border-[#30363D] bg-[#161B22] p-4">
        <HlsPlayer
          src={streamSrc}
          resumePosition={playUrl.lastPositionSec}
          onTimeUpdate={handleTimeUpdate}
          onRateChange={handleRateChange}
        />
      </Card>

      {/* Progress */}
      <Card className="border-[#30363D] bg-[#161B22] p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#8B949E]">观看进度</span>
          <span className="text-sm text-[#F0F6FC]">
            {lessonProgress ? `${Math.round(lessonProgress.watchRatio * 100)}%` : "0%"}
          </span>
        </div>
        <div className="mt-2 h-2 w-full rounded bg-[#30363D]">
          <div
            className="h-2 rounded bg-[#3B82F6] transition-all"
            style={{ width: `${(lessonProgress?.watchRatio ?? 0) * 100}%` }}
          />
        </div>
        {lessonProgress && (
          <p className="mt-2 text-xs text-[#8B949E]">
            有效观看 {lessonProgress.validWatchedSec} 秒 / {lessonProgress.totalDurationSec} 秒
          </p>
        )}
      </Card>
    </div>
  );
}
