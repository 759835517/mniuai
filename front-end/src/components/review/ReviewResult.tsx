"use client";

import { Card } from "@/components/ui/card";
import MarkdownRenderer from "@/components/shared/MarkdownRenderer";
import DiffView from "./DiffView";
import type { CodeReview, ReviewIssue } from "@/lib/types/review";
import { formatDateTime } from "@/lib/utils/format";
import { Shield, Wrench, Zap, TestTube, AlertTriangle, AlertCircle, Info } from "lucide-react";

const SEVERITY_CONFIG: Record<string, { color: string; icon: React.ElementType }> = {
  CRITICAL: { color: "text-red-500", icon: AlertTriangle },
  HIGH: { color: "text-orange-400", icon: AlertCircle },
  MEDIUM: { color: "text-yellow-400", icon: Info },
  LOW: { color: "text-blue-400", icon: Info },
};

const CATEGORY_CONFIG: Record<string, { label: string; color: string }> = {
  security: { label: "安全", color: "bg-red-500/10 text-red-400" },
  correctness: { label: "正确性", color: "bg-orange-500/10 text-orange-400" },
  performance: { label: "性能", color: "bg-yellow-500/10 text-yellow-400" },
  maintainability: { label: "可维护性", color: "bg-blue-500/10 text-blue-400" },
  testability: { label: "可测试性", color: "bg-purple-500/10 text-purple-400" },
};

interface ReviewResultProps {
  review: CodeReview;
}

export default function ReviewResult({ review }: ReviewResultProps) {
  return (
    <div className="space-y-6">
      {/* Source Info */}
      <div>
        <p className="text-sm text-[#8B949E]">
          {review.sourceType === "REPO" ? review.sourceRef : "代码片段"} - {formatDateTime(review.createdAt)}
        </p>
      </div>

      {/* Scores */}
      {review.score && (
        <Card className="border-[#30363D] bg-[#161B22] p-6">
          <h2 className="mb-4 text-lg font-semibold">评分</h2>
          <div className="mb-4 text-center">
            <span className="text-4xl font-bold">{review.score.overall}</span>
            <span className="text-lg text-[#8B949E]">/10</span>
          </div>
          <div className="space-y-3">
            <ScoreBar label="安全性" score={review.score.security} icon={Shield} />
            <ScoreBar label="可维护性" score={review.score.maintainability} icon={Wrench} />
            <ScoreBar label="性能" score={review.score.performance} icon={Zap} />
            <ScoreBar label="可测试性" score={review.score.testability} icon={TestTube} />
          </div>
        </Card>
      )}

      {/* Summary */}
      <Card className="border-[#30363D] bg-[#161B22] p-6">
        <h2 className="mb-3 text-lg font-semibold">总结</h2>
        <MarkdownRenderer content={review.review.summary} />

        {review.review.strengths && review.review.strengths.length > 0 && (
          <div className="mt-4">
            <h3 className="mb-2 text-sm font-medium text-green-400">优点</h3>
            <MarkdownRenderer content={review.review.strengths.map((s) => `- ${s}`).join("\n")} />
          </div>
        )}

        {review.review.nextSteps && review.review.nextSteps.length > 0 && (
          <div className="mt-4">
            <h3 className="mb-2 text-sm font-medium text-[#3B82F6]">下一步建议</h3>
            <MarkdownRenderer content={review.review.nextSteps.map((s) => `- ${s}`).join("\n")} />
          </div>
        )}
      </Card>

      {/* Issues */}
      <div>
        <h2 className="mb-3 text-lg font-semibold">问题 ({review.review.issues.length})</h2>
        <div className="space-y-3">
          {review.review.issues.map((issue, i) => (
            <IssueCard key={i} issue={issue} />
          ))}
          {review.review.issues.length === 0 && (
            <Card className="border-[#30363D] bg-[#161B22] p-6 text-center text-sm text-[#8B949E]">
              没有发现问题
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function ScoreBar({ label, score, icon: Icon, maxScore = 10 }: { label: string; score: number; icon: React.ElementType; maxScore?: number }) {
  const percentage = (score / maxScore) * 100;
  const color =
    percentage >= 80 ? "from-green-500 to-emerald-500"
    : percentage >= 60 ? "from-yellow-500 to-amber-500"
    : "from-red-500 to-orange-500";

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 text-[#8B949E]">
          <Icon className="h-4 w-4" />
          {label}
        </span>
        <span className="font-medium">{score}/{maxScore}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-[#1C2128]">
        <div className={`h-full rounded-full bg-gradient-to-r ${color} transition-all`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

function IssueCard({ issue }: { issue: ReviewIssue }) {
  const severity = SEVERITY_CONFIG[issue.severity] ?? SEVERITY_CONFIG.LOW;
  const category = CATEGORY_CONFIG[issue.category] ?? { label: issue.category, color: "bg-[#30363D] text-[#8B949E]" };
  const SeverityIcon = severity?.icon ?? Info;

  return (
    <Card className="border-[#30363D] bg-[#161B22] p-4">
      <div className="flex items-start gap-3">
        <SeverityIcon className={`mt-0.5 h-5 w-5 shrink-0 ${severity?.color ?? "text-[#8B949E]"}`} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded px-2 py-0.5 text-xs font-medium ${category.color}`}>{category.label}</span>
            <span className="text-xs text-[#484F58]">
              {issue.file && <span>{issue.file}{issue.line ? `:${issue.line}` : ""} - </span>}
              {issue.severity}
            </span>
          </div>
          <div className="mt-2">
            <MarkdownRenderer content={issue.message} />
          </div>
          {issue.suggestion && (
            <div className="mt-2 rounded-md border border-[#30363D] bg-[#0D1117] p-3">
              <p className="mb-2 text-xs font-medium text-[#3B82F6]">建议</p>
              <MarkdownRenderer content={issue.suggestion} />
            </div>
          )}
          {issue.originalCode && issue.suggestedCode && (
            <div className="mt-3">
              <DiffView original={issue.originalCode} modified={issue.suggestedCode} language="text" height={150} />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
