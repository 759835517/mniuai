package com.mniu.aicamp.review.application;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.mniu.aicamp.growth.application.GrowthService;
import com.mniu.aicamp.review.infrastructure.RepositoryContentPort;
import com.mniu.aicamp.review.infrastructure.mapper.CodeReviewMapper;
import com.mniu.aicamp.review.infrastructure.po.CodeReviewPO;
import com.mniu.aicamp.shared.ai.AiClientPort;
import com.mniu.aicamp.shared.api.ErrorCode;
import com.mniu.aicamp.shared.exception.BusinessException;
import com.mniu.aicamp.shared.util.SnowflakeIdGenerator;
import com.mniu.aicamp.user.infrastructure.mapper.UserMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;

@Service
public class CodeReviewService {
    private final AiClientPort aiClient;
    private final RepositoryContentPort repositoryContent;
    private final SnowflakeIdGenerator idGenerator;
    private final UserMapper users;
    private final CodeReviewMapper reviews;
    private final GrowthService growthService;

    public CodeReviewService(AiClientPort aiClient,
                             RepositoryContentPort repositoryContent,
                             SnowflakeIdGenerator idGenerator,
                             UserMapper users,
                             CodeReviewMapper reviews,
                             GrowthService growthService) {
        this.aiClient = aiClient;
        this.repositoryContent = repositoryContent;
        this.idGenerator = idGenerator;
        this.users = users;
        this.reviews = reviews;
        this.growthService = growthService;
    }

    @Transactional
    public CodeReview reviewSnippet(Long userId, String language, String code) {
        requireUser(userId);
        if (code.getBytes().length > 204800) {
            throw new BusinessException(ErrorCode.CODE_TOO_LARGE, "Code snippet is too large");
        }
        String aiText = aiClient.chat("你是一名资深中文代码审查助手。请用简体中文输出简洁、可执行的建议。", code);
        Long id = idGenerator.nextId();
        CodeReviewPO review = new CodeReviewPO();
        review.setId(id);
        review.setUserId(userId);
        review.setLanguage(language);
        review.setScore(86);
        review.setSuggestions(join(List.of("AI 审查：\n" + aiText)));
        reviews.insert(review);
        growthService.addXp(userId, 10, "CODE_REVIEW_CREATED");
        return toCodeReview(requireReview(id));
    }

    @Transactional
    public CodeReview reviewRepository(Long userId, String repositoryUrl, String branch, String language) {
        requireUser(userId);
        RepositoryContentPort.RepositorySnapshot snapshot = repositoryContent.fetch(repositoryUrl, branch);
        String prompt = "仓库名称：" + snapshot.repository() + "\n"
                + "分支：" + snapshot.branch() + "\n"
                + "请基于以下仓库内容进行中文审查，重点关注架构、测试、安全性和可维护性。\n"
                + snapshot.combinedText();
        String aiText = aiClient.chat("你是一名资深中文 GitHub 仓库审查助手。请默认使用简体中文输出，除非用户明确要求英文。", prompt);
        Long id = idGenerator.nextId();
        CodeReviewPO review = new CodeReviewPO();
        review.setId(id);
        review.setUserId(userId);
        review.setLanguage(blankTo(language, "repository"));
        review.setScore(82);
        review.setSuggestions(join(List.of(
                "仓库审查：" + snapshot.repository() + "（" + snapshot.branch() + "）",
                "已审查文件：" + snapshot.files().stream().map(RepositoryContentPort.RepositoryFile::path).toList(),
                "AI 审查：\n" + aiText
        )));
        reviews.insert(review);
        growthService.addXp(userId, 10, "CODE_REVIEW_CREATED");
        return toCodeReview(requireReview(id));
    }

    public List<CodeReview> listReviews(Long userId) {
        return reviews.selectList(Wrappers.<CodeReviewPO>lambdaQuery()
                        .eq(CodeReviewPO::getUserId, userId)
                        .orderByDesc(CodeReviewPO::getCreatedAt))
                .stream().map(this::toCodeReview).toList();
    }

    public CodeReview getReview(Long userId, Long reviewId) {
        CodeReviewPO review = reviews.selectOne(Wrappers.<CodeReviewPO>lambdaQuery()
                .eq(CodeReviewPO::getId, reviewId)
                .eq(CodeReviewPO::getUserId, userId));
        if (review == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND, "Code review not found");
        }
        return toCodeReview(review);
    }

    private void requireUser(Long userId) {
        if (users.selectById(userId) == null) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND, "User not found");
        }
    }

    private CodeReviewPO requireReview(Long id) {
        CodeReviewPO po = reviews.selectById(id);
        if (po == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND, "Code review not found");
        }
        return po;
    }

    private CodeReview toCodeReview(CodeReviewPO po) {
        return new CodeReview(po.getId(), po.getUserId(), po.getLanguage(), valueOrZero(po.getScore()),
                split(po.getSuggestions()), po.getCreatedAt());
    }

    private String blankTo(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }

    private String join(List<String> values) {
        return values == null ? "" : String.join("\n", values);
    }

    private List<String> split(String value) {
        if (value == null || value.isBlank()) {
            return List.of();
        }
        return Arrays.asList(value.split("\\R"));
    }

    private int valueOrZero(Integer value) {
        return value == null ? 0 : value;
    }
}
