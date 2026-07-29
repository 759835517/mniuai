"use client";

import Hls from "hls.js";
import { useEffect, useRef, useCallback } from "react";

interface HlsPlayerProps {
  /** HLS manifest URL (.m3u8) */
  src: string;
  /** 封面图 */
  poster?: string;
  /** 断点续播位置（秒） */
  resumePosition?: number;
  /** 播放进度回调（当前时间，总时长） */
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  /** 播放结束回调 */
  onEnded?: () => void;
  /** 播放倍速变化回调 */
  onRateChange?: (rate: number) => void;
}

/**
 * HLS 流播放器组件。
 * - 优先使用 hls.js 播放 .m3u8 流
 * - Safari 原生 HLS 自动 fallback
 * - 支持断点续播、错误自动恢复
 */
export function HlsPlayer({
  src,
  poster,
  resumePosition = 0,
  onTimeUpdate,
  onEnded,
  onRateChange,
}: HlsPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  // 用 ref 保存回调，避免 effect 依赖变化导致重建 hls 实例
  const onTimeUpdateRef = useRef(onTimeUpdate);
  const onEndedRef = useRef(onEnded);
  const onRateChangeRef = useRef(onRateChange);
  onTimeUpdateRef.current = onTimeUpdate;
  onEndedRef.current = onEnded;
  onRateChangeRef.current = onRateChange;

  // 销毁 hls 实例
  const destroyHls = useCallback(() => {
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
  }, []);

  // 初始化 hls.js（仅当 src 变化时重建）
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;

    destroyHls();

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
      });
      hlsRef.current = hls;
      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (resumePosition > 0) {
          video.currentTime = resumePosition;
        }
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              destroyHls();
              break;
          }
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Safari 原生 HLS
      video.src = src;
      if (resumePosition > 0) {
        video.addEventListener(
          "loadedmetadata",
          () => {
            video.currentTime = resumePosition;
          },
          { once: true }
        );
      }
    }

    return destroyHls;
  }, [src, resumePosition, destroyHls]);

  // 10 秒间隔上报进度
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const interval = setInterval(() => {
      if (!video.paused && video.duration > 0) {
        onTimeUpdateRef.current?.(video.currentTime, video.duration);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // 播放结束
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleEnded = () => onEndedRef.current?.();
    video.addEventListener("ended", handleEnded);
    return () => video.removeEventListener("ended", handleEnded);
  }, []);

  // 倍速变化
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const handleRateChange = () => onRateChangeRef.current?.(video.playbackRate);
    video.addEventListener("ratechange", handleRateChange);
    return () => video.removeEventListener("ratechange", handleRateChange);
  }, []);

  return (
    <video
      ref={videoRef}
      className="w-full rounded bg-black"
      controls
      playsInline
      poster={poster}
    />
  );
}
