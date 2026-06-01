import { tokenStorage } from "@/lib/utils/tokenStorage";
import { isMockEnabled } from "@/lib/mocks/handler";

export interface SsePostOptions {
  url: string;
  body: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  onToken: (delta: string) => void;
  onDone: (payload: unknown) => void;
  onError: (error: Error) => void;
}

export async function postSse(options: SsePostOptions): Promise<void> {
  if (isMockEnabled()) {
    await mockSseFlow(options);
    return;
  }

  const token = tokenStorage.getAccessToken();

  const response = await fetch(options.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    body: JSON.stringify(options.body),
    signal: options.signal,
  });

  if (!response.ok || !response.body) {
    throw new Error(`SSE 请求失败：${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    buffer = buffer.replace(/\r\n/g, "\n");
    const chunks = buffer.split("\n\n");
    buffer = chunks.pop() ?? "";

    for (const chunk of chunks) {
      const event = parseSseChunk(chunk);
      if (event.type === "token") {
        options.onToken(String(event.data?.delta ?? ""));
      } else if (event.type === "done") {
        options.onDone(event.data);
      } else if (event.type === "error") {
        options.onError(new Error(String(event.data?.message) || "AI 响应失败"));
      }
    }
  }
}

function parseSseChunk(chunk: string): { type: string; data: Record<string, unknown> | null } {
  let type = "";
  const dataLines: string[] = [];
  for (const line of chunk.split("\n")) {
    if (line.startsWith("event:")) {
      type = line.slice(6).trim();
    } else if (line.startsWith("data:")) {
      dataLines.push(line.slice(5).trimStart());
    }
  }
  const dataStr = dataLines.join("\n");
  let data: Record<string, unknown> | null = null;
  if (dataStr) {
    try {
      data = JSON.parse(dataStr) as Record<string, unknown>;
    } catch {
      data = { raw: dataStr };
    }
  }
  return { type, data };
}

async function mockSseFlow(options: SsePostOptions): Promise<void> {
  if (options.signal?.aborted) return;

  const mockReply = "这是一条模拟的 AI 回复。在 mock 模式下，所有数据均来自本地 mock 数据，无需连接后端服务。\n\n你可以在此测试 SSE 流式渲染效果。";
  const tokens = mockReply.split("");

  for (const token of tokens) {
    if (options.signal?.aborted) break;
    options.onToken(token);
    await new Promise((r) => setTimeout(r, 30));
  }

  if (!options.signal?.aborted) {
    options.onDone({ messageId: `mock-msg-${Date.now()}` });
  }
}
