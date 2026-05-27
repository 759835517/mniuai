"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { reviewApi } from "@/lib/api/review";
import type { CodeReview } from "@/lib/types/review";
import ReviewResult from "@/components/review/ReviewResult";
import Loading from "@/components/shared/Loading";
import EmptyState from "@/components/shared/EmptyState";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ReviewDetailPage() {
  const params = useParams();
  const reviewId = params.id as string;
  const [review, setReview] = useState<CodeReview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reviewApi.getReview(reviewId)
      .then(setReview)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [reviewId]);

  if (loading) return <Loading text="加载审查结果..." className="mt-12" />;
  if (!review) return <EmptyState title="审查不存在" className="mt-12" />;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/review" className="mb-3 inline-flex items-center gap-1 text-sm text-[#8B949E] hover:text-[#F0F6FC]">
          <ArrowLeft className="h-4 w-4" />
          返回
        </Link>
        <h1 className="text-2xl font-bold">审查详情</h1>
      </div>

      <ReviewResult review={review} />
    </div>
  );
}
