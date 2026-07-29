"use client";

import { useCallback, useEffect, useRef } from "react";
import { useCourseStore } from "@/lib/stores/courseStore";
import type { ID } from "@/lib/types/api";

/**
 * 心跳上报 hook。
 * - 每 10 秒上报一次
 * - 页面隐藏时发送最后一次心跳
 * - 跳转时立即上报
 */
export function useHeartbeat(lessonId: ID, durationSec: number) {
  const { sendHeartbeat } = useCourseStore();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const positionRef = useRef(0);
  const speedRef = useRef(1);
  const lastSentRef = useRef(0);

  const flush = useCallback(() => {
    const now = Date.now();
    if (now - lastSentRef.current < 5000) return; // 节流：5 秒内不重复
    lastSentRef.current = now;
    sendHeartbeat(lessonId, Math.floor(positionRef.current), speedRef.current);
  }, [lessonId, sendHeartbeat]);

  // 定时上报（10 秒）
  useEffect(() => {
    timerRef.current = setInterval(flush, 10000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [flush]);

  // 页面隐藏时发送最后一次心跳
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        flush();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [flush]);

  const updatePosition = useCallback((position: number, speed: number) => {
    positionRef.current = position;
    speedRef.current = speed;
  }, []);

  const reportSeek = useCallback((position: number, speed: number) => {
    positionRef.current = position;
    speedRef.current = speed;
    flush();
  }, [flush]);

  return { updatePosition, reportSeek, flush };
}
