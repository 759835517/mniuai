import type { ISODateTime, ID } from "./api";

export type ChatRole = "USER" | "ASSISTANT" | "SYSTEM";
export type ChatContextType = "GENERAL" | "PROJECT" | "ROADMAP";

export interface ChatSession {
  id: ID;
  title: string | null;
  contextType: ChatContextType;
  contextId: ID | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface ChatMessage {
  id: ID;
  sessionId: ID;
  role: ChatRole;
  content: string;
  tokenCount: number;
  createdAt: ISODateTime;
  streaming?: boolean;
  failed?: boolean;
}

export interface CreateSessionRequest {
  title?: string;
  contextType?: ChatContextType;
  contextId?: ID | null;
}

export interface SendMessageRequest {
  content: string;
}

export interface SseTokenEvent {
  delta: string;
}

export interface SseDoneEvent {
  messageId: ID;
  tokenCount: number;
}

export interface SseErrorEvent {
  code: string;
  message: string;
}
