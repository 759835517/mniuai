import type { ISODateTime, ID } from "./api";

export interface ArticleSummary {
  id: ID;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverUrl: string | null;
  category: string;
  tags: string[];
  authorId: ID;
  status: string;
  targetAudience: string;
  difficulty: string;
  readMinutes: number;
  viewCount: number;
  likeCount: number;
  associatedType: string | null;
  associatedId: ID | null;
  publishedAt: ISODateTime | null;
  createdAt: ISODateTime;
}

export interface ArticleDetail {
  id: ID;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverUrl: string | null;
  category: string;
  tags: string[];
  authorName: string;
  targetAudience: string;
  difficulty: string;
  readMinutes: number;
  viewCount: number;
  likeCount: number;
  publishedAt: ISODateTime | null;
  createdAt: ISODateTime;
}

export interface ArticleCreateRequest {
  title: string;
  slug?: string;
  summary: string;
  content: string;
  coverUrl?: string;
  category: string;
  tags: string[];
  targetAudience?: string;
  difficulty?: string;
  readMinutes?: number;
  associatedType?: string;
  associatedId?: ID;
}

export interface ArticleUpdateRequest {
  title: string;
  slug?: string;
  summary: string;
  content: string;
  coverUrl?: string;
  category: string;
  tags: string[];
  targetAudience?: string;
  difficulty?: string;
  readMinutes?: number;
  associatedType?: string;
  associatedId?: ID;
}

export interface ReadProgressRequest {
  scrollRatio: number;
  readSeconds: number;
}

export interface ArticleRead {
  id: ID;
  userId: ID;
  articleId: ID;
  scrollRatio: number;
  readSeconds: number;
  completed: boolean;
  firstReadAt: ISODateTime;
  lastReadAt: ISODateTime;
}
