"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { reviewApi } from "@/lib/api/review";
import { toast } from "sonner";
import ReviewInput from "@/components/review/ReviewInput";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils/format";
import type { CodeReview, SubmitReviewRequest } from "@/lib/types/review";
import { ChevronRight, FileCode2, GitBranch, History } from "lucide-react";

export default function ReviewPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [reviews, setReviews] = useState<CodeReview[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  useEffect(() => {
    let active = true;
    reviewApi.getReviews(0, 10)
      .then((page) => {
        if (active) setReviews(page.items);
      })
      .catch(() => {
        if (active) setReviews([]);
      })
      .finally(() => {
        if (active) setLoadingReviews(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (payload: SubmitReviewRequest) => {
    setSubmitting(true);
    try {
      const review = await reviewApi.submitReview(payload);
      toast.success("审查已完成");
      router.push(`/review/${review.id}`);
    } catch (e) {
      toast.error("提交失败：" + (e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">代码审查</h1>
        <p className="mt-1 text-sm text-[#8B949E]">提交代码或仓库链接，获取 AI 审查意见</p>
      </div>

      <ReviewInput submitting={submitting} onSubmit={handleSubmit} />

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-[#3B82F6]" />
          <h2 className="text-lg font-semibold">最近审查记录</h2>
        </div>

        <Card className="border-[#30363D] bg-[#161B22]">
          {loadingReviews ? (
            <div className="px-4 py-6 text-sm text-[#8B949E]">正在加载记录...</div>
          ) : reviews.length === 0 ? (
            <div className="px-4 py-6 text-sm text-[#8B949E]">暂无审查记录</div>
          ) : (
            <div className="divide-y divide-[#30363D]">
              {reviews.map((review) => (
                <ReviewHistoryRow key={review.id} review={review} />
              ))}
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}

function ReviewHistoryRow({ review }: { review: CodeReview }) {
  const Icon = review.sourceType === "REPO" ? GitBranch : FileCode2;
  const sourceLabel = review.sourceType === "REPO" ? review.sourceRef ?? "仓库审查" : "代码片段";

  return (
    <Link
      href={`/review/${review.id}`}
      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[#1C2128]"
    >
      <Icon className="h-5 w-5 shrink-0 text-[#8B949E]" />
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-2">
          <p className="truncate text-sm font-medium text-[#F0F6FC]">{sourceLabel}</p>
          <Badge variant="outline" className="shrink-0 border-[#30363D] text-[#8B949E]">
            {review.language ?? "unknown"}
          </Badge>
        </div>
        <p className="mt-1 text-xs text-[#8B949E]">
          {formatDateTime(review.createdAt)}
          {review.score ? ` · ${review.score.overall}/10` : ""}
        </p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-[#8B949E]" />
    </Link>
  );
}
