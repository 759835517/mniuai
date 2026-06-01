import { apiClient } from "@/lib/utils/apiClient";
import type { CodeReview, ReviewContent, ReviewIssue, ReviewScore, ReviewSourceType, SubmitReviewRequest } from "@/lib/types/review";
import type { PageResponse, ID } from "@/lib/types/api";

const BASE = "/reviews";
const REVIEW_SUBMIT_TIMEOUT_MS = 300_000;

function longRunningApiUrl(path: string): string {
  const directApiBase = process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")}/api/v1`
    : undefined;
  const basePath = (
    directApiBase ||
    process.env.NEXT_PUBLIC_API_BASE_PATH ||
    "/api/backend"
  ).replace(/\/$/, "");
  return `${basePath}${path}`;
}

type ReviewScoreResponse = number | Partial<ReviewScore> | null | undefined;

type CodeReviewResponse = Partial<Omit<CodeReview, "review" | "score">> & {
  id: ID;
  userId?: ID;
  review?: Partial<ReviewContent> | null;
  score?: ReviewScoreResponse;
  suggestions?: string[] | string | null;
};

type ReviewFallback = Partial<Pick<CodeReview, "sourceType" | "sourceRef" | "language">>;

const ISSUE_SEVERITIES = new Set(["LOW", "MEDIUM", "HIGH", "CRITICAL"]);
const ISSUE_CATEGORIES = new Set(["security", "correctness", "performance", "maintainability", "testability"]);

function normalizeReview(raw: CodeReviewResponse, fallback: ReviewFallback = {}): CodeReview {
  const suggestions = normalizeSuggestions(raw.suggestions);
  const sourceType = normalizeSourceType(raw.sourceType) ?? fallback.sourceType ?? inferSourceType(suggestions);
  const sourceRef = raw.sourceRef ?? fallback.sourceRef ?? inferSourceRef(suggestions);

  return {
    id: raw.id,
    sourceType,
    sourceRef,
    language: raw.language ?? fallback.language ?? null,
    fileCount: raw.fileCount ?? 1,
    review: normalizeReviewContent(raw.review, suggestions),
    score: normalizeScore(raw.score),
    createdAt: raw.createdAt ?? new Date().toISOString(),
  };
}

function normalizeReviewPage(page: PageResponse<CodeReviewResponse>): PageResponse<CodeReview> {
  return {
    ...page,
    items: page.items.map((item) => normalizeReview(item)),
  };
}

function normalizeReviewContent(review: CodeReviewResponse["review"], suggestions: string[]): ReviewContent {
  const markdown = suggestionsToMarkdown(suggestions);
  const fallbackSummary = markdown || "代码审查已完成。";

  return {
    summary: nonEmptyString(review?.summary) ?? stripSuggestionPrefix(fallbackSummary),
    issues: Array.isArray(review?.issues) ? review.issues.map(normalizeIssue) : [],
    strengths: Array.isArray(review?.strengths) ? review.strengths.filter(isNonEmptyString) : [],
    nextSteps: Array.isArray(review?.nextSteps)
      ? review.nextSteps.filter(isNonEmptyString)
      : [],
  };
}

function normalizeIssue(issue: ReviewIssue): ReviewIssue {
  return {
    severity: ISSUE_SEVERITIES.has(issue.severity) ? issue.severity : "LOW",
    category: ISSUE_CATEGORIES.has(issue.category) ? issue.category : "maintainability",
    file: issue.file ?? null,
    line: issue.line ?? null,
    message: issue.message,
    suggestion: issue.suggestion,
    originalCode: issue.originalCode,
    suggestedCode: issue.suggestedCode,
  };
}

function normalizeScore(score: ReviewScoreResponse): ReviewScore | null {
  if (score == null) return null;

  if (typeof score === "number") {
    const overall = toTenPointScore(score);
    return {
      overall,
      security: overall,
      maintainability: overall,
      performance: overall,
      testability: overall,
    };
  }

  const subscores = [score.security, score.maintainability, score.performance, score.testability]
    .filter((value): value is number => typeof value === "number")
    .map(toTenPointScore);
  const average = subscores.length > 0
    ? Number((subscores.reduce((sum, value) => sum + value, 0) / subscores.length).toFixed(1))
    : 0;
  const overall = toTenPointScore(score.overall ?? average);

  return {
    overall,
    security: toTenPointScore(score.security ?? overall),
    maintainability: toTenPointScore(score.maintainability ?? overall),
    performance: toTenPointScore(score.performance ?? overall),
    testability: toTenPointScore(score.testability ?? overall),
  };
}

function toTenPointScore(score: number): number {
  const normalized = score > 10 ? score / 10 : score;
  return Number(Math.max(0, Math.min(10, normalized)).toFixed(1));
}

function normalizeSuggestions(suggestions: CodeReviewResponse["suggestions"]): string[] {
  if (Array.isArray(suggestions)) return suggestions.filter((item): item is string => typeof item === "string");
  if (typeof suggestions === "string") return [suggestions];
  return [];
}

function suggestionsToMarkdown(suggestions: string[]): string {
  return suggestions
    .map(stripSuggestionPrefix)
    .join("\n")
    .trim();
}

function normalizeSourceType(sourceType: unknown): ReviewSourceType | null {
  return sourceType === "REPO" || sourceType === "SNIPPET" ? sourceType : null;
}

function inferSourceType(suggestions: string[]): ReviewSourceType {
  return suggestions.some((item) => item.includes("Repository review for ") || item.includes("仓库审查："))
    ? "REPO"
    : "SNIPPET";
}

function inferSourceRef(suggestions: string[]): string | null {
  const text = suggestions.join("\n");
  const chineseMatch = text.match(/仓库审查：(.+?)(?:（[^）]*）|\n|$)/);
  if (chineseMatch?.[1]) return chineseMatch[1].trim();

  const englishMatch = text.match(/Repository review for\s+(.+?)(?:\s+\([^)]*\)|\n|$)/);
  return englishMatch?.[1]?.trim() ?? null;
}

function stripSuggestionPrefix(value: string): string {
  return value
    .replace(/^AI review:\s*/i, "")
    .replace(/^AI\s*审查：\s*/i, "")
    .trim();
}

function nonEmptyString(value: unknown): string | undefined {
  return isNonEmptyString(value) ? value : undefined;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export const reviewApi = {
  async submitReview(payload: SubmitReviewRequest): Promise<CodeReview> {
    if (payload.sourceType === "REPO") {
      const review = await apiClient.post<unknown, CodeReviewResponse>(longRunningApiUrl(`${BASE}/repository`), {
        repositoryUrl: payload.sourceRef,
        branch: payload.branch,
        language: payload.language ?? "repository",
      }, {
        timeout: REVIEW_SUBMIT_TIMEOUT_MS,
      });
      return normalizeReview(review, {
        sourceType: "REPO",
        sourceRef: payload.sourceRef,
        language: payload.language ?? "repository",
      });
    }

    const review = await apiClient.post<unknown, CodeReviewResponse>(longRunningApiUrl(`${BASE}/snippet`), {
      language: payload.language,
      code: payload.code,
    }, {
      timeout: REVIEW_SUBMIT_TIMEOUT_MS,
    });
    return normalizeReview(review, {
      sourceType: "SNIPPET",
      sourceRef: null,
      language: payload.language,
    });
  },
  async getReviews(page = 0, size = 20): Promise<PageResponse<CodeReview>> {
    const reviews = await apiClient.get<unknown, PageResponse<CodeReviewResponse>>(BASE, { params: { page, size } });
    return normalizeReviewPage(reviews);
  },
  async getReview(id: ID): Promise<CodeReview> {
    const review = await apiClient.get<unknown, CodeReviewResponse>(`${BASE}/${id}`);
    return normalizeReview(review);
  },
};
