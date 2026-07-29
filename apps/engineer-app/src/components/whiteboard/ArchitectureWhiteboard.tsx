"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types";

// Excalidraw 必须客户端渲染，避免 SSR 报错
const Excalidraw = dynamic(
  async () => {
    const mod = await import("@excalidraw/excalidraw");
    return mod.Excalidraw;
  },
  { ssr: false }
);

interface Props {
  topicId: string;
  initialData?: unknown;
}

export default function ArchitectureWhiteboard({ topicId, initialData }: Props) {
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null);
  const [saved, setSaved] = useState(false);
  const [exporting, setExporting] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const storageKey = `whiteboard-${topicId}`;

  // 加载本地保存的画布数据
  useEffect(() => {
    if (initialData) return;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        // 数据将在 Excalidraw 挂载后恢复
      }
    } catch {
      // ignore storage errors
    }
  }, [storageKey, initialData]);

  const onExcalidrawMount = useCallback((api: ExcalidrawImperativeAPI) => {
    setExcalidrawAPI(api);
    // 恢复保存的数据
    try {
      const savedData = localStorage.getItem(storageKey);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.elements && Array.isArray(parsed.elements)) {
          api.updateScene(parsed as Parameters<typeof api.updateScene>[0]);
        }
      }
    } catch {
      // ignore restore errors
    }
  }, [storageKey]);

  // 自动保存
  const autoSave = useCallback(() => {
    if (!excalidrawAPI) return;
    try {
      const elements = excalidrawAPI.getSceneElements();
      const appState = excalidrawAPI.getAppState();
      const files = excalidrawAPI.getFiles();
      const data = JSON.stringify({ elements, appState, files });
      localStorage.setItem(storageKey, data);
      setSaved(true);
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => setSaved(false), 2000);
    } catch {
      // ignore save errors
    }
  }, [excalidrawAPI, storageKey]);

  const handleExportPNG = useCallback(async () => {
    if (!excalidrawAPI) return;
    setExporting(true);
    try {
      const { exportToBlob } = await import("@excalidraw/excalidraw");
      const blob = await exportToBlob({
        elements: excalidrawAPI.getSceneElements() as Parameters<typeof exportToBlob>[0]["elements"],
        appState: { ...excalidrawAPI.getAppState(), exportWithDarkMode: false } as Parameters<typeof exportToBlob>[0]["appState"],
        files: excalidrawAPI.getFiles() as unknown as Parameters<typeof exportToBlob>[0]["files"],
        mimeType: "image/png",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `architecture-${topicId}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // ignore export errors
    } finally {
      setExporting(false);
    }
  }, [excalidrawAPI, topicId]);

  const handleSave = useCallback(() => {
    autoSave();
  }, [autoSave]);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      {/* 工具栏 */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            💾 保存
          </button>
          <button
            onClick={handleExportPNG}
            disabled={exporting}
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {exporting ? "导出中…" : "📥 导出 PNG"}
          </button>
        </div>
        <div className="text-xs text-gray-400">
          {saved ? (
            <span className="text-green-500">✓ 已保存</span>
          ) : (
            "绘制后自动保存到本地"
          )}
        </div>
      </div>

      {/* 画布区域 */}
      <div className="h-96 bg-white">
        <Excalidraw
          excalidrawAPI={(api: ExcalidrawImperativeAPI) => onExcalidrawMount(api)}
          onChange={() => {
            // 防抖自动保存
            if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
            saveTimerRef.current = setTimeout(() => autoSave(), 1500);
          }}
          langCode="zh-CN"
          viewModeEnabled={false}
          zenModeEnabled={false}
          gridModeEnabled={true}
        />
      </div>
    </div>
  );
}
