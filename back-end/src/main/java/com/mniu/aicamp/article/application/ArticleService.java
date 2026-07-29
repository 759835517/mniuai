package com.mniu.aicamp.article.application;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mniu.aicamp.article.infrastructure.mapper.ArticleMapper;
import com.mniu.aicamp.article.infrastructure.mapper.ArticleReadMapper;
import com.mniu.aicamp.article.infrastructure.po.ArticlePO;
import com.mniu.aicamp.article.infrastructure.po.ArticleReadPO;
import com.mniu.aicamp.shared.api.ErrorCode;
import com.mniu.aicamp.shared.api.PageResponse;
import com.mniu.aicamp.shared.exception.BusinessException;
import com.mniu.aicamp.shared.security.CurrentUsers;
import com.mniu.aicamp.shared.util.SnowflakeIdGenerator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class ArticleService {
    private final ArticleMapper articles;
    private final ArticleReadMapper articleReads;
    private final SnowflakeIdGenerator idGenerator;
    private final ObjectMapper objectMapper;

    public ArticleService(ArticleMapper articles, ArticleReadMapper articleReads,
                          SnowflakeIdGenerator idGenerator, ObjectMapper objectMapper) {
        this.articles = articles;
        this.articleReads = articleReads;
        this.idGenerator = idGenerator;
        this.objectMapper = objectMapper;
    }

    // ========== 前台 ==========

    public PageResponse<Article> listPublished(String category, String tag, int page, int size) {
        List<ArticlePO> all = articles.selectList(Wrappers.<ArticlePO>lambdaQuery()
                .eq(ArticlePO::getStatus, "PUBLISHED")
                .eq(category != null, ArticlePO::getCategory, category)
                .orderByDesc(ArticlePO::getCreatedAt));
        List<ArticlePO> filtered = tag != null
                ? all.stream().filter(po -> containsTag(po, tag)).toList()
                : all;
        List<Article> items = filtered.stream().map(this::toArticle).toList();
        return PageResponse.of(items, page, size);
    }

    public ArticleDetail getBySlug(String slug) {
        ArticlePO po = articles.selectOne(Wrappers.<ArticlePO>lambdaQuery()
                .eq(ArticlePO::getSlug, slug));
        if (po == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND, "Article not found");
        }
        // 增加浏览量
        po.setViewCount((po.getViewCount() == null ? 0 : po.getViewCount()) + 1);
        articles.updateById(po);
        return toArticleDetail(po);
    }

    @Transactional
    public void reportReadProgress(Long userId, Long articleId, ReadProgressRequest request) {
        ArticlePO article = articles.selectById(articleId);
        if (article == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND, "Article not found");
        }
        ArticleReadPO read = articleReads.selectOne(Wrappers.<ArticleReadPO>lambdaQuery()
                .eq(ArticleReadPO::getUserId, userId)
                .eq(ArticleReadPO::getArticleId, articleId));
        Instant now = Instant.now();
        if (read == null) {
            read = new ArticleReadPO();
            read.setId(idGenerator.nextId());
            read.setUserId(userId);
            read.setArticleId(articleId);
            read.setFirstReadAt(now);
            articleReads.insert(read);
        }
        read.setScrollRatio(request.scrollRatio());
        read.setReadSeconds((read.getReadSeconds() == null ? 0 : read.getReadSeconds()) + request.readSeconds());
        read.setCompleted(request.scrollRatio() >= 0.85);
        read.setLastReadAt(now);
        articleReads.updateById(read);
    }

    @Transactional
    public void likeArticle(Long userId, Long articleId) {
        ArticlePO article = articles.selectById(articleId);
        if (article == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND, "Article not found");
        }
        article.setLikeCount((article.getLikeCount() == null ? 0 : article.getLikeCount()) + 1);
        articles.updateById(article);
    }

    // ========== 后台管理 ==========

    public PageResponse<Article> listAll(String status, String category, int page, int size) {
        List<ArticlePO> all = articles.selectList(Wrappers.<ArticlePO>lambdaQuery()
                .eq(status != null, ArticlePO::getStatus, status)
                .eq(category != null, ArticlePO::getCategory, category)
                .orderByDesc(ArticlePO::getCreatedAt));
        List<Article> items = all.stream().map(this::toArticle).toList();
        return PageResponse.of(items, page, size);
    }

    @Transactional
    public Article createDraft(ArticleCreateRequest request) {
        ArticlePO po = new ArticlePO();
        po.setId(idGenerator.nextId());
        po.setTitle(request.title());
        po.setSlug(request.slug() != null ? request.slug() : generateSlug(request.title()));
        po.setSummary(request.summary());
        po.setContent(request.content());
        po.setCoverUrl(request.coverUrl());
        po.setCategory(request.category());
        po.setTags(toJson(request.tags()));
        po.setAuthorId(CurrentUsers.require().id());
        po.setStatus("DRAFT");
        po.setTargetAudience(request.targetAudience() != null ? request.targetAudience() : "ALL");
        po.setDifficulty(request.difficulty());
        po.setReadMinutes(request.readMinutes());
        po.setViewCount(0L);
        po.setLikeCount(0L);
        po.setAssociatedType(request.associatedType());
        po.setAssociatedId(request.associatedId());
        po.setCreatedAt(Instant.now());
        po.setUpdatedAt(Instant.now());
        articles.insert(po);
        return toArticle(po);
    }

    @Transactional
    public Article updateArticle(Long id, ArticleUpdateRequest request) {
        ArticlePO existing = articles.selectById(id);
        if (existing == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND, "Article not found");
        }
        ArticlePO update = new ArticlePO();
        update.setId(id);
        update.setTitle(request.title());
        update.setSlug(request.slug() != null ? request.slug() : generateSlug(request.title()));
        update.setSummary(request.summary());
        update.setContent(request.content());
        update.setCoverUrl(request.coverUrl());
        update.setCategory(request.category());
        update.setTags(toJson(request.tags()));
        update.setTargetAudience(request.targetAudience());
        update.setDifficulty(request.difficulty());
        update.setReadMinutes(request.readMinutes());
        update.setAssociatedType(request.associatedType());
        update.setAssociatedId(request.associatedId());
        update.setUpdatedAt(Instant.now());
        articles.updateById(update);
        return toArticle(articles.selectById(id));
    }

    @Transactional
    public Article publishArticle(Long id) {
        ArticlePO existing = articles.selectById(id);
        if (existing == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND, "Article not found");
        }
        if ("PUBLISHED".equals(existing.getStatus())) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "Article already published");
        }
        ArticlePO update = new ArticlePO();
        update.setId(id);
        update.setStatus("PUBLISHED");
        update.setPublishedAt(Instant.now());
        update.setUpdatedAt(Instant.now());
        articles.updateById(update);
        return toArticle(articles.selectById(id));
    }

    @Transactional
    public Article archiveArticle(Long id) {
        ArticlePO existing = articles.selectById(id);
        if (existing == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND, "Article not found");
        }
        ArticlePO update = new ArticlePO();
        update.setId(id);
        update.setStatus("ARCHIVED");
        update.setUpdatedAt(Instant.now());
        articles.updateById(update);
        return toArticle(articles.selectById(id));
    }

    @Transactional
    public void deleteArticle(Long id) {
        ArticlePO existing = articles.selectById(id);
        if (existing == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND, "Article not found");
        }
        if ("PUBLISHED".equals(existing.getStatus())) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "Cannot delete published article, archive it first");
        }
        articles.deleteById(id);
    }

    public Article getById(Long id) {
        ArticlePO po = articles.selectById(id);
        if (po == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND, "Article not found");
        }
        return toArticle(po);
    }

    // ========== 内部方法 ==========

    private String generateSlug(String title) {
        return title.toLowerCase()
                .replaceAll("[^\\p{IsHan}\\p{Alnum}]+", "-")
                .replaceAll("^-|-$", "")
                .substring(0, Math.min(100, title.length())) + "-" + System.nanoTime() % 10000;
    }

    private String toJson(List<String> tags) {
        try {
            return objectMapper.writeValueAsString(tags != null ? tags : List.of());
        } catch (JsonProcessingException e) {
            return "[]";
        }
    }

    @SuppressWarnings("unchecked")
    private List<String> parseTags(String tags) {
        if (tags == null || tags.isBlank()) {
            return List.of();
        }
        try {
            return objectMapper.readValue(tags, List.class);
        } catch (Exception e) {
            return List.of();
        }
    }

    private boolean containsTag(ArticlePO po, String tag) {
        return parseTags(po.getTags()).contains(tag);
    }

    private Article toArticle(ArticlePO po) {
        return new Article(po.getId(), po.getTitle(), po.getSlug(), po.getSummary(), po.getContent(),
                po.getCoverUrl(), po.getCategory(), parseTags(po.getTags()), po.getAuthorId(),
                po.getStatus(), po.getTargetAudience(), po.getDifficulty(), po.getReadMinutes(),
                po.getViewCount() == null ? 0 : po.getViewCount(),
                po.getLikeCount() == null ? 0 : po.getLikeCount(),
                po.getAssociatedType(), po.getAssociatedId(), po.getPublishedAt(), po.getCreatedAt());
    }

    private ArticleDetail toArticleDetail(ArticlePO po) {
        return new ArticleDetail(po.getId(), po.getTitle(), po.getSlug(), po.getSummary(), po.getContent(),
                po.getCoverUrl(), po.getCategory(), parseTags(po.getTags()),
                po.getAuthorId() != null ? "author-" + po.getAuthorId() : "Unknown",
                po.getTargetAudience(), po.getDifficulty(), po.getReadMinutes() == null ? 0 : po.getReadMinutes(),
                po.getViewCount() == null ? 0 : po.getViewCount(),
                po.getLikeCount() == null ? 0 : po.getLikeCount(),
                po.getPublishedAt(), po.getCreatedAt());
    }
}
