"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { reviewApi } from "@/lib/api/review";
import { toast } from "sonner";
import ReviewInput from "@/components/review/ReviewInput";
import type { SubmitReviewRequest } from "@/lib/types/review";

export default function ReviewPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (payload: SubmitReviewRequest) => {
    setSubmitting(true);
    try {
      const review = await reviewApi.submitReview(payload);
      toast.success("审查已提交，正在分析...");
      router.push(`/review/${review.id}`);
    } catch (e) {
      toast.error("提交失败: " + (e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">代码审查</h1>
        <p className="mt-1 text-sm text-[#8B949E]">提交代码，获取 AI 审查意见</p>
      </div>

      <ReviewInput submitting={submitting} onSubmit={handleSubmit} />
    </div>
  );
}
