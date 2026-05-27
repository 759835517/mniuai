import type { ISODateTime, ID } from "./api";

export type ReviewSourceType = "REPO" | "SNIPPET";
export type IssueSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type IssueCategory = "security" | "correctness" | "performance" | "maintainability" | "testability";

export interface ReviewIssue {
  severity: IssueSeverity;
  category: IssueCategory;
  file: string | null;
  line: number | null;
  message: string;
  suggestion: string;
  originalCode?: string;
  suggestedCode?: string;
}

export interface ReviewContent {
  summary: string;
  issues: ReviewIssue[];
  strengths?: string[];
  nextSteps?: string[];
}

export interface ReviewScore {
  overall: number;
  security: number;
  maintainability: number;
  performance: number;
  testability: number;
}

export interface CodeReview {
  id: ID;
  sourceType: ReviewSourceType;
  sourceRef: string | null;
  language: string | null;
  fileCount: number;
  review: ReviewContent;
  score: ReviewScore | null;
  createdAt: ISODateTime;
}

export interface SubmitRepoReviewRequest {
  sourceType: "REPO";
  sourceRef: string;
  branch?: string;
  language?: string;
}

export interface SubmitSnippetReviewRequest {
  sourceType: "SNIPPET";
  code: string;
  language: string;
}

export type SubmitReviewRequest = SubmitRepoReviewRequest | SubmitSnippetReviewRequest;
