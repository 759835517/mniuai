"use client";

import { useEffect, useRef, useCallback } from "react";

interface HeartbeatConfig {
  /** 课时 ID */
  lessonId: string;
  /** 上报间隔（毫秒），默认 10000 */
  intervalMs?: number;
}

/**
 * 视频心跳上报 hook。
 * - 每 intervalMs 毫秒上报一次播放位置
 * - 页面隐藏（visibilitychange）时立即上报
 * - 页面卸载（beforeunload）前上报
 * - 节流：5 秒内不重复发送
 */
export function useVideoHeartbeat({ lessonId, intervalMs = 10000 }: HeartbeatConfig) {
  const positionRef = useRef(0);
  const speedRef = useRef(1);
  const lastSentRef = useRef(0);
  const lessonIdRef = useRef(lessonId);
  lessonIdRef.current = lessonId;

  const send = useCallback(async () => {
    const now = Date.now();
    if (now - lastSentRef.current < 5000) return;
    if (positionRef.current <= 0) return;

    lastSentRef.current = now;
    const positionSec = Math.floor(positionRef.current);

    try {
      await fetch(`/api/v1/lessons/${lessonIdRef.current}/heartbeat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ positionSec, speed: speedRef.current }),
        keepalive: true,
      });
    } catch {
      // 心跳上报失败不影响播放，静默忽略
    }
  }, []);

  // 定时上报
  useEffect(() => {
    const timer = setInterval(send, intervalMs);
    return () => clearInterval(timer);
  }, [send, intervalMs]);

  // 页面隐藏时立即上报
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        send();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [send]);

  // 页面卸载前上报
  useEffect(() => {
    const handleBeforeUnload = () => send();
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [send]);

  /** 更新当前位置和倍速（由播放器回调驱动） */
  const updatePosition = useCallback((position: number, speed: number) => {
    positionRef.current = position;
    speedRef.current = speed;
  }, []);

  /** 跳跃seek后立即上报 */
  const reportSeek = useCallback(
    (position: number, speed: number) => {
      positionRef.current = position;
      speedRef.current = speed;
      send();
    },
    [send]
  );

  return { updatePosition, reportSeek, sendHeartbeat: send };
}
