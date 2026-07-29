package com.mniu.aicamp.article.application;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mniu.aicamp.article.infrastructure.mapper.ArticleMapper;
import com.mniu.aicamp.article.infrastructure.po.ArticlePO;
import com.mniu.aicamp.shared.util.SnowflakeIdGenerator;
import com.mniu.aicamp.user.infrastructure.mapper.UserMapper;
import com.mniu.aicamp.user.infrastructure.po.UserPO;
import jakarta.annotation.PostConstruct;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;

/**
 * Seeds demo articles on first startup so the CMS has content to display.
 */
@Component
@ConditionalOnProperty(name = "app.article.seed-enabled", havingValue = "true", matchIfMissing = true)
public class ArticleDataSeeder {
    private final ArticleMapper articles;
    private final SnowflakeIdGenerator idGenerator;
    private final ObjectMapper objectMapper;
    private final UserMapper users;

    public ArticleDataSeeder(ArticleMapper articles, SnowflakeIdGenerator idGenerator,
                             ObjectMapper objectMapper, UserMapper users) {
        this.articles = articles;
        this.idGenerator = idGenerator;
        this.objectMapper = objectMapper;
        this.users = users;
    }

    @PostConstruct
    public void seed() {
        if (articles.selectCount(null) > 0) {
            return;
        }
        UserPO user = users.selectOne(Wrappers.<UserPO>lambdaQuery()
                .orderByAsc(UserPO::getCreatedAt).last("LIMIT 1"));
        Long authorId = user != null ? user.getId() : 1L;

        createArticle(authorId, "Java 集合框架深度解析",
                "探索 Java 集合框架的核心数据结构与算法",
                "Java 集合框架是 Java 编程中最基础也最重要的 API 之一。本文将深入剖析 ArrayList、LinkedList、HashMap、ConcurrentHashMap 等核心数据结构的实现原理。\n\n## ArrayList vs LinkedList\n\nArrayList 基于动态数组实现，支持 O(1) 随机访问；LinkedList 基于双向链表，插入删除更高效。\n\n## HashMap 原理\n\nHashMap 使用数组+链表+红黑树解决哈希冲突，默认负载因子 0.75。",
                "后端", List.of("Java", "集合", "数据结构"), "BEGINNER", 8);

        createArticle(authorId, "Spring AI 实战：构建 RAG 应用",
                "使用 Spring AI 快速构建检索增强生成系统",
                "Spring AI 是 Spring 生态中用于 AI 应用开发的框架。本文将手把手教你构建一个完整的 RAG（检索增强生成）应用。\n\n## 什么是 RAG？\n\nRAG 结合检索与生成，让大模型基于私有知识库回答问题。\n\n## 核心组件\n\n- Embedding Model\n- Vector Store\n- Prompt Template",
                "AI", List.of("Spring AI", "RAG", "大模型"), "INTERMEDIATE", 12);

        createArticle(authorId, "系统设计面试指南",
                "掌握系统设计面试的核心思路与常见题型",
                "系统设计面试是技术面试中最具挑战性的环节。本文总结了高频考点和答题框架。\n\n## 答题框架\n\n1. 明确需求（功能/非功能）\n2. 高层设计（架构图）\n3. 深入细节（数据模型/接口）\n4. 扩展性讨论\n\n## 常见题型\n\n- 设计短链服务\n- 设计消息队列\n- 设计搜索引擎",
                "面试", List.of("系统设计", "面试", "架构"), "ADVANCED", 15);
    }

    private void createArticle(Long authorId, String title, String summary, String content,
                               String category, List<String> tags, String difficulty, int readMinutes) {
        ArticlePO po = new ArticlePO();
        po.setId(idGenerator.nextId());
        po.setTitle(title);
        po.setSlug(generateSlug(title));
        po.setSummary(summary);
        po.setContent(content);
        po.setCoverUrl(null);
        po.setCategory(category);
        try {
            po.setTags(objectMapper.writeValueAsString(tags));
        } catch (Exception e) {
            po.setTags("[]");
        }
        po.setAuthorId(authorId);
        po.setStatus("PUBLISHED");
        po.setTargetAudience("ALL");
        po.setDifficulty(difficulty);
        po.setReadMinutes(readMinutes);
        po.setViewCount(0L);
        po.setLikeCount(0L);
        po.setPublishedAt(Instant.now());
        po.setCreatedAt(Instant.now());
        po.setUpdatedAt(Instant.now());
        articles.insert(po);
    }

    private String generateSlug(String title) {
        return title.toLowerCase()
                .replaceAll("[^\\p{IsHan}\\p{Alnum}]+", "-")
                .replaceAll("^-|-$", "")
                .substring(0, Math.min(50, title.length())) + "-" + System.nanoTime() % 10000;
    }
}
