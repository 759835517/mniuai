"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { useCourseStore } from "@/lib/stores/courseStore";
import { useHeartbeat } from "@/hooks/useHeartbeat";
import { toast } from "sonner";
import Loading from "@/components/shared/Loading";

export default function LessonPage() {
  const { id, lessonId } = useParams<{ id: string; lessonId: string }>();
  const { playUrl, lessonProgress, fetchPlayUrl, fetchLessonProgress } = useCourseStore();
  const { updatePosition, reportSeek } = useHeartbeat(lessonId, playUrl?.durationSec ?? 0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const seekingRef = useRef<number | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetchPlayUrl(lessonId);
    fetchLessonProgress(lessonId);
  }, [lessonId, fetchPlayUrl, fetchLessonProgress]);

  // 断点续播
  useEffect(() => {
    if (videoRef.current && playUrl && playUrl.lastPositionSec > 0 && !ready) {
      videoRef.current.currentTime = playUrl.lastPositionSec;
      setReady(true);
    }
  }, [playUrl, ready]);

  const handleSeeking = useCallback(() => {
    seekingRef.current = videoRef.current?.currentTime ?? 0;
  }, []);

  const handleSeeked = useCallback(() => {
    const from = seekingRef.current;
    const to = videoRef.current?.currentTime ?? 0;
    if (from !== null && Math.abs(to - from) > 30) {
      reportSeek(to, videoRef.current?.playbackRate ?? 1);
    }
    seekingRef.current = null;
  }, [reportSeek]);

  const handleRateChange = useCallback(() => {
    const rate = videoRef.current?.playbackRate ?? 1;
    if (rate > 2.0) {
      toast.warning("倍速超过 2x 将不计入学习进度");
    }
    updatePosition(videoRef.current?.currentTime ?? 0, rate);
  }, [updatePosition]);

  const handleTimeUpdate = useCallback(() => {
    updatePosition(videoRef.current?.currentTime ?? 0, videoRef.current?.playbackRate ?? 1);
  }, [updatePosition]);

  if (!playUrl) return <Loading text="加载视频..." className="mt-12" />;

  return (
    <div className="space-y-6">
      <button onClick={() => window.history.back()} className="text-sm text-[#8B949E] hover:text-[#F0F6FC]">
        ← 返回课程
      </button>

      <Card className="border-[#30363D] bg-[#161B22] p-4">
        <video
          ref={videoRef}
          src={playUrl.videoUrl}
          controls
          className="w-full rounded bg-black"
          onSeeking={handleSeeking}
          onSeeked={handleSeeked}
          onRateChange={handleRateChange}
          onTimeUpdate={handleTimeUpdate}
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
