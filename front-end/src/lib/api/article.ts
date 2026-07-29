import { apiClient } from "@/lib/utils/apiClient";
import type {
  ArticleSummary,
  ArticleDetail,
  ArticleCreateRequest,
  ArticleUpdateRequest,
  ReadProgressRequest,
} from "@/lib/types/article";
import type { PageResponse, ID } from "@/lib/types/api";

export const articleApi = {
  // ========== 前台 ==========
  list(category?: string, tag?: string, page = 0, size = 20): Promise<PageResponse<ArticleSummary>> {
    return apiClient.get("/articles", { params: { category, tag, page, size } });
  },
  getBySlug(slug: string): Promise<ArticleDetail> {
    return apiClient.get(`/articles/${slug}`);
  },
  reportProgress(id: ID, payload: ReadProgressRequest): Promise<void> {
    return apiClient.post(`/articles/${id}/read-progress`, payload);
  },
  like(id: ID): Promise<void> {
    return apiClient.post(`/articles/${id}/like`);
  },

  // ========== 后台管理 ==========
  adminList(status?: string, category?: string, page = 0, size = 20): Promise<PageResponse<ArticleSummary>> {
    return apiClient.get("/admin/articles", { params: { status, category, page, size } });
  },
  adminGet(id: ID): Promise<ArticleSummary> {
    return apiClient.get(`/admin/articles/${id}`);
  },
  adminCreate(payload: ArticleCreateRequest): Promise<ArticleSummary> {
    return apiClient.post("/admin/articles", payload);
  },
  adminUpdate(id: ID, payload: ArticleUpdateRequest): Promise<ArticleSummary> {
    return apiClient.put(`/admin/articles/${id}`, payload);
  },
  adminPublish(id: ID): Promise<ArticleSummary> {
    return apiClient.post(`/admin/articles/${id}/publish`);
  },
  adminArchive(id: ID): Promise<ArticleSummary> {
    return apiClient.post(`/admin/articles/${id}/archive`);
  },
  adminDelete(id: ID): Promise<void> {
    return apiClient.delete(`/admin/articles/${id}`);
  },
};
