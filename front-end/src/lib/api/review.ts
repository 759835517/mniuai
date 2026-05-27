import { apiClient } from "@/lib/utils/apiClient";
import type { CodeReview, SubmitReviewRequest } from "@/lib/types/review";
import type { PageResponse, ID } from "@/lib/types/api";

const BASE = "/reviews";

export const reviewApi = {
  submitReview(payload: SubmitReviewRequest): Promise<CodeReview> {
    return apiClient.post(BASE, payload);
  },
  getReviews(page = 0, size = 20): Promise<PageResponse<CodeReview>> {
    return apiClient.get(BASE, { params: { page, size } });
  },
  getReview(id: ID): Promise<CodeReview> {
    return apiClient.get(`${BASE}/${id}`);
  },
};
