package com.mniu.aicamp.kids.application;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.mniu.aicamp.kids.infrastructure.mapper.CompetitionProblemMapper;
import com.mniu.aicamp.kids.infrastructure.mapper.CompetitionSubmissionMapper;
import com.mniu.aicamp.kids.infrastructure.mapper.GrowthBadgeMapper;
import com.mniu.aicamp.kids.infrastructure.mapper.KidsAiTutorMessageMapper;
import com.mniu.aicamp.kids.infrastructure.mapper.KidsAiTutorSessionMapper;
import com.mniu.aicamp.kids.infrastructure.mapper.KidsLearningPathMapper;
import com.mniu.aicamp.kids.infrastructure.mapper.ParentMonitorLogMapper;
import com.mniu.aicamp.kids.infrastructure.mapper.UserBadgeMapper;
import com.mniu.aicamp.kids.infrastructure.po.CompetitionProblemPO;
import com.mniu.aicamp.kids.infrastructure.po.CompetitionSubmissionPO;
import com.mniu.aicamp.kids.infrastructure.po.GrowthBadgePO;
import com.mniu.aicamp.kids.infrastructure.po.KidsAiTutorMessagePO;
import com.mniu.aicamp.kids.infrastructure.po.KidsAiTutorSessionPO;
import com.mniu.aicamp.kids.infrastructure.po.KidsLearningPathPO;
import com.mniu.aicamp.kids.infrastructure.po.ParentMonitorLogPO;
import com.mniu.aicamp.kids.infrastructure.po.UserBadgePO;
import com.mniu.aicamp.shared.ai.AiClientPort;
import com.mniu.aicamp.shared.util.SnowflakeIdGenerator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * 少儿编程端核心业务服务
 * 提供学习路径、竞赛题库、成长勋章、AI 助教、家长监控等业务能力
 */
@Service
public class KidsService {

    private final KidsLearningPathMapper learningPathMapper;
    private final CompetitionProblemMapper competitionProblemMapper;
    private final CompetitionSubmissionMapper competitionSubmissionMapper;
    private final GrowthBadgeMapper growthBadgeMapper;
    private final UserBadgeMapper userBadgeMapper;
    private final ParentMonitorLogMapper parentMonitorLogMapper;
    private final KidsAiTutorSessionMapper tutorSessionMapper;
    private final KidsAiTutorMessageMapper tutorMessageMapper;
    private final SnowflakeIdGenerator idGenerator;
    private final AiClientPort aiClient;

    public KidsService(KidsLearningPathMapper learningPathMapper,
                       CompetitionProblemMapper competitionProblemMapper,
                       CompetitionSubmissionMapper competitionSubmissionMapper,
                       GrowthBadgeMapper growthBadgeMapper,
                       UserBadgeMapper userBadgeMapper,
                       ParentMonitorLogMapper parentMonitorLogMapper,
                       KidsAiTutorSessionMapper tutorSessionMapper,
                       KidsAiTutorMessageMapper tutorMessageMapper,
                       SnowflakeIdGenerator idGenerator,
                       AiClientPort aiClient) {
        this.learningPathMapper = learningPathMapper;
        this.competitionProblemMapper = competitionProblemMapper;
        this.competitionSubmissionMapper = competitionSubmissionMapper;
        this.growthBadgeMapper = growthBadgeMapper;
        this.userBadgeMapper = userBadgeMapper;
        this.parentMonitorLogMapper = parentMonitorLogMapper;
        this.tutorSessionMapper = tutorSessionMapper;
        this.tutorMessageMapper = tutorMessageMapper;
        this.idGenerator = idGenerator;
        this.aiClient = aiClient;
    }

    // ============================================================
    // 学习路径
    // ============================================================

    /**
     * 查询所有已发布的少儿学习路径
     *
     * @return 学习路径列表
     */
    public List<KidsLearningPathDTO> listLearningPaths() {
        return learningPathMapper.selectList(Wrappers.<KidsLearningPathPO>lambdaQuery()
                        .eq(KidsLearningPathPO::getStatus, "PUBLISHED")
                        .orderByAsc(KidsLearningPathPO::getSortOrder))
                .stream()
                .map(po -> new KidsLearningPathDTO(po.getId(), po.getSlug(), po.getName(),
                        po.getDescription(), po.getIcon(), po.getStage(), po.getDurationWeeks(),
                        po.getLevelFrom(), po.getLevelTo(), po.getStudentCount(), po.getSortOrder()))
                .toList();
    }

    /**
     * 根据 slug 查询学习路径详情
     *
     * @param slug 路径标识
     * @return 学习路径 DTO，不存在返回 null
     */
    public KidsLearningPathDTO getLearningPath(String slug) {
        KidsLearningPathPO po = learningPathMapper.selectOne(Wrappers.<KidsLearningPathPO>lambdaQuery()
                .eq(KidsLearningPathPO::getSlug, slug)
                .eq(KidsLearningPathPO::getStatus, "PUBLISHED"));
        if (po == null) return null;
        return new KidsLearningPathDTO(po.getId(), po.getSlug(), po.getName(),
                po.getDescription(), po.getIcon(), po.getStage(), po.getDurationWeeks(),
                po.getLevelFrom(), po.getLevelTo(), po.getStudentCount(), po.getSortOrder());
    }

    // ============================================================
    // 竞赛题库
    // ============================================================

    /**
     * 查询竞赛题目列表（支持按难度和类别筛选）
     *
     * @param difficulty 难度筛选（可为 null）
     * @param category   类别筛选（可为 null）
     * @return 竞赛题目列表
     */
    public List<CompetitionProblemDTO> listCompetitionProblems(String difficulty, String category) {
        return competitionProblemMapper.selectList(Wrappers.<CompetitionProblemPO>lambdaQuery()
                        .eq(CompetitionProblemPO::getStatus, "PUBLISHED")
                        .eq(difficulty != null && !difficulty.isBlank(), CompetitionProblemPO::getDifficulty, difficulty)
                        .eq(category != null && !category.isBlank(), CompetitionProblemPO::getCategory, category)
                        .orderByAsc(CompetitionProblemPO::getSortOrder))
                .stream()
                .map(po -> new CompetitionProblemDTO(po.getId(), po.getSlug(), po.getTitle(),
                        po.getDifficulty(), po.getCategory(), po.getContent(), po.getInputFormat(),
                        po.getOutputFormat(), po.getSampleInput(), po.getSampleOutput(), po.getHint(),
                        po.getTimeLimitMs(), po.getMemoryLimitMb()))
                .toList();
    }

    /**
     * 根据 ID 查询竞赛题目详情
     *
     * @param problemId 题目 ID
     * @return 竞赛题目 DTO，不存在返回 null
     */
    public CompetitionProblemDTO getCompetitionProblem(Long problemId) {
        CompetitionProblemPO po = competitionProblemMapper.selectById(problemId);
        if (po == null) return null;
        return new CompetitionProblemDTO(po.getId(), po.getSlug(), po.getTitle(),
                po.getDifficulty(), po.getCategory(), po.getContent(), po.getInputFormat(),
                po.getOutputFormat(), po.getSampleInput(), po.getSampleOutput(), po.getHint(),
                po.getTimeLimitMs(), po.getMemoryLimitMb());
    }

    /**
     * 提交竞赛代码（简化版：直接返回模拟评测结果）
     * TODO: 对接 Judge0 沙盒进行真实评测
     *
     * @param userId    用户 ID
     * @param problemId 题目 ID
     * @param language  编程语言
     * @param sourceCode 源代码
     * @return 提交结果
     */
    @Transactional
    public CompetitionSubmissionDTO submitCompetitionCode(Long userId, Long problemId,
                                                           String language, String sourceCode) {
        CompetitionSubmissionPO submission = new CompetitionSubmissionPO();
        submission.setId(idGenerator.nextId());
        submission.setUserId(userId);
        submission.setProblemId(problemId);
        submission.setLanguage(language);
        submission.setSourceCode(sourceCode);
        submission.setSubmittedAt(Instant.now());

        // 简化评测：检查代码是否包含基本语法结构
        String status = evaluateCode(sourceCode, language);
        submission.setStatus(status);
        submission.setPassedCount("ACCEPTED".equals(status) ? 1 : 0);
        submission.setTotalCount(1);
        submission.setRuntimeMs(100);
        submission.setMemoryKb(64);

        competitionSubmissionMapper.insert(submission);

        return new CompetitionSubmissionDTO(submission.getId(), submission.getProblemId(),
                submission.getLanguage(), submission.getSourceCode(), submission.getStatus(),
                submission.getPassedCount(), submission.getTotalCount(), submission.getRuntimeMs(),
                submission.getMemoryKb(), submission.getSubmittedAt());
    }

    /**
     * 简化版代码评测逻辑
     * 实际生产环境应调用 Judge0 沙盒
     */
    private String evaluateCode(String sourceCode, String language) {
        if (sourceCode == null || sourceCode.isBlank()) {
            return "WRONG_ANSWER";
        }
        // 基础检查：代码长度 > 10 且包含关键字
        String lower = sourceCode.toLowerCase();
        if (language.toLowerCase().contains("python")) {
            if (lower.contains("print") || lower.contains("input") || lower.contains("def")) {
                return "ACCEPTED";
            }
        } else if (language.toLowerCase().contains("java")) {
            if (lower.contains("system.out") || lower.contains("public")) {
                return "ACCEPTED";
            }
        } else if (language.toLowerCase().contains("cpp") || lower.contains("c++")) {
            if (lower.contains("cout") || lower.contains("printf") || lower.contains("iostream")) {
                return "ACCEPTED";
            }
        }
        return "WRONG_ANSWER";
    }

    /**
     * 查询用户的竞赛提交历史
     *
     * @param userId 用户 ID
     * @return 提交记录列表（按时间倒序）
     */
    public List<CompetitionSubmissionDTO> getUserSubmissions(Long userId) {
        return competitionSubmissionMapper.selectList(Wrappers.<CompetitionSubmissionPO>lambdaQuery()
                        .eq(CompetitionSubmissionPO::getUserId, userId)
                        .orderByDesc(CompetitionSubmissionPO::getSubmittedAt))
                .stream()
                .map(po -> new CompetitionSubmissionDTO(po.getId(), po.getProblemId(),
                        po.getLanguage(), po.getSourceCode(), po.getStatus(),
                        po.getPassedCount(), po.getTotalCount(), po.getRuntimeMs(),
                        po.getMemoryKb(), po.getSubmittedAt()))
                .toList();
    }

    // ============================================================
    // 成长勋章
    // ============================================================

    /**
     * 查询所有勋章定义及用户获得状态
     *
     * @param userId 用户 ID
     * @return 勋章列表（含 earned 状态）
     */
    public List<GrowthBadgeDTO> listBadges(Long userId) {
        List<GrowthBadgePO> badges = growthBadgeMapper.selectList(
                Wrappers.<GrowthBadgePO>lambdaQuery()
                        .orderByAsc(GrowthBadgePO::getSortOrder));

        // 查询用户已获得的勋章 ID 集合
        Set<Long> earnedBadgeIds = userBadgeMapper.selectList(
                        Wrappers.<UserBadgePO>lambdaQuery().eq(UserBadgePO::getUserId, userId))
                .stream().map(UserBadgePO::getBadgeId).collect(Collectors.toSet());

        return badges.stream()
                .map(po -> new GrowthBadgeDTO(po.getId(), po.getSlug(), po.getName(),
                        po.getDescription(), po.getIcon(), po.getCategory(),
                        po.getRequirement(), earnedBadgeIds.contains(po.getId())))
                .toList();
    }

    /**
     * 授予用户勋章（幂等：已拥有则不重复插入）
     *
     * @param userId  用户 ID
     * @param badgeId 勋章 ID
     */
    @Transactional
    public void awardBadge(Long userId, Long badgeId) {
        UserBadgePO existing = userBadgeMapper.selectOne(
                Wrappers.<UserBadgePO>lambdaQuery()
                        .eq(UserBadgePO::getUserId, userId)
                        .eq(UserBadgePO::getBadgeId, badgeId));
        if (existing != null) return;

        UserBadgePO userBadge = new UserBadgePO();
        userBadge.setId(idGenerator.nextId());
        userBadge.setUserId(userId);
        userBadge.setBadgeId(badgeId);
        userBadge.setEarnedAt(Instant.now());
        userBadgeMapper.insert(userBadge);
    }

    // ============================================================
    // 家长监控
    // ============================================================

    /**
     * 记录每日学习活动
     *
     * @param childUserId 少儿用户 ID
     * @param minutes     学习分钟数
     * @param activities  活动分类统计
     */
    @Transactional
    public void recordDailyActivity(Long childUserId, int minutes, Map<String, Object> activities) {
        LocalDate today = LocalDate.now();
        ParentMonitorLogPO existing = parentMonitorLogMapper.selectOne(
                Wrappers.<ParentMonitorLogPO>lambdaQuery()
                        .eq(ParentMonitorLogPO::getChildUserId, childUserId)
                        .eq(ParentMonitorLogPO::getLogDate, today));

        if (existing != null) {
            existing.setDailyMinutes(existing.getDailyMinutes() + minutes);
            existing.setActivities(activities);
            parentMonitorLogMapper.updateById(existing);
        } else {
            ParentMonitorLogPO log = new ParentMonitorLogPO();
            log.setId(idGenerator.nextId());
            log.setChildUserId(childUserId);
            log.setDailyMinutes(minutes);
            log.setLogDate(today);
            log.setActivities(activities);
            parentMonitorLogMapper.insert(log);
        }
    }

    /**
     * 查询少儿用户的学习记录（最近 N 天）
     *
     * @param childUserId 少儿用户 ID
     * @param days        查询天数
     * @return 监控记录列表
     */
    public List<ParentMonitorDTO> getChildActivity(Long childUserId, int days) {
        LocalDate startDate = LocalDate.now().minusDays(days - 1);
        return parentMonitorLogMapper.selectList(Wrappers.<ParentMonitorLogPO>lambdaQuery()
                        .eq(ParentMonitorLogPO::getChildUserId, childUserId)
                        .ge(ParentMonitorLogPO::getLogDate, startDate)
                        .orderByDesc(ParentMonitorLogPO::getLogDate))
                .stream()
                .map(po -> new ParentMonitorDTO(po.getId(), po.getChildUserId(),
                        po.getDailyMinutes(), po.getLogDate(), po.getActivities()))
                .toList();
    }

    // ============================================================
    // AI 助教（少儿版）
    // ============================================================

    /**
     * 少儿 AI 助教对话
     * 使用鼓励式、拟人化的 Prompt 风格
     *
     * @param userId  用户 ID
     * @param request 对话请求
     * @return AI 回复
     */
    @Transactional
    public KidsAiTutorResponse chatWithTutor(Long userId, KidsAiTutorRequest request) {
        // 获取或创建会话
        KidsAiTutorSessionPO session;
        if (request.sessionId() != null) {
            session = tutorSessionMapper.selectById(request.sessionId());
        } else {
            session = new KidsAiTutorSessionPO();
            session.setId(idGenerator.nextId());
            session.setUserId(userId);
            session.setTitle(request.message().length() > 20
                    ? request.message().substring(0, 20) + "..."
                    : request.message());
            session.setLessonId(request.lessonId());
            session.setCreatedAt(Instant.now());
            tutorSessionMapper.insert(session);
        }

        // 保存用户消息
        saveMessage(session.getId(), "user", request.message());

        // 构建少儿专属 Prompt
        String prompt = buildKidsTutorPrompt(request);

        // 调用 AI（systemPrompt 和 userPrompt 合并传入）
        String reply = aiClient.chat("", prompt);

        // 保存 AI 回复
        saveMessage(session.getId(), "assistant", reply);

        return new KidsAiTutorResponse(session.getId(), reply, "继续学习");
    }

    /**
     * 构建少儿专属 AI 助教 Prompt
     * 使用鼓励式、拟人化语气
     */
    private String buildKidsTutorPrompt(KidsAiTutorRequest request) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("你是一位亲切的少儿编程老师，正在教一位小朋友学习编程。\n");
        prompt.append("请用鼓励、耐心的语气回答问题，多用比喻和生活中的例子。\n");
        prompt.append("回答要简洁明了，适合 8-15 岁的孩子理解。\n\n");

        if (request.lessonId() != null) {
            prompt.append("当前课时 ID: ").append(request.lessonId()).append("\n");
        }
        if (request.code() != null && !request.code().isBlank()) {
            prompt.append("小朋友的代码:\n```\n").append(request.code()).append("\n```\n\n");
        }
        prompt.append("小朋友的问题: ").append(request.message()).append("\n\n");
        prompt.append("请用友好的方式回答：");
        return prompt.toString();
    }

    /**
     * 保存对话消息
     */
    private void saveMessage(Long sessionId, String role, String content) {
        KidsAiTutorMessagePO message = new KidsAiTutorMessagePO();
        message.setId(idGenerator.nextId());
        message.setSessionId(sessionId);
        message.setRole(role);
        message.setContent(content);
        message.setCreatedAt(Instant.now());
        tutorMessageMapper.insert(message);
    }

    /**
     * 查询用户的 AI 会话列表
     *
     * @param userId 用户 ID
     * @return 会话列表
     */
    public List<Map<String, Object>> listTutorSessions(Long userId) {
        return tutorSessionMapper.selectList(Wrappers.<KidsAiTutorSessionPO>lambdaQuery()
                        .eq(KidsAiTutorSessionPO::getUserId, userId)
                        .orderByDesc(KidsAiTutorSessionPO::getCreatedAt))
                .stream()
                .map(po -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", po.getId());
                    map.put("title", po.getTitle());
                    map.put("createdAt", po.getCreatedAt());
                    return map;
                })
                .toList();
    }

    /**
     * 查询会话的对话历史
     *
     * @param sessionId 会话 ID
     * @param userId    用户 ID（用于权限校验）
     * @return 消息列表
     */
    public List<Map<String, Object>> getSessionMessages(Long sessionId, Long userId) {
        KidsAiTutorSessionPO session = tutorSessionMapper.selectById(sessionId);
        if (session == null || !session.getUserId().equals(userId)) {
            return new ArrayList<>();
        }
        return tutorMessageMapper.selectList(Wrappers.<KidsAiTutorMessagePO>lambdaQuery()
                        .eq(KidsAiTutorMessagePO::getSessionId, sessionId)
                        .orderByAsc(KidsAiTutorMessagePO::getCreatedAt))
                .stream()
                .map(po -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", po.getId());
                    map.put("role", po.getRole());
                    map.put("content", po.getContent());
                    map.put("createdAt", po.getCreatedAt());
                    return map;
                })
                .toList();
    }

    // ============================================================
    // 学习进度
    // ============================================================

    /**
     * 查询少儿用户学习进度总览
     *
     * @param userId 用户 ID
     * @return 进度总览
     */
    public KidsProgressDTO getUserProgress(Long userId) {
        long totalPaths = learningPathMapper.selectCount(
                Wrappers.<KidsLearningPathPO>lambdaQuery()
                        .eq(KidsLearningPathPO::getStatus, "PUBLISHED"));

        long totalPractice = competitionSubmissionMapper.selectCount(
                Wrappers.<CompetitionSubmissionPO>lambdaQuery()
                        .eq(CompetitionSubmissionPO::getUserId, userId));

        long passedPractice = competitionSubmissionMapper.selectCount(
                Wrappers.<CompetitionSubmissionPO>lambdaQuery()
                        .eq(CompetitionSubmissionPO::getUserId, userId)
                        .eq(CompetitionSubmissionPO::getStatus, "ACCEPTED"));

        long earnedBadges = userBadgeMapper.selectCount(
                Wrappers.<UserBadgePO>lambdaQuery()
                        .eq(UserBadgePO::getUserId, userId));

        return new KidsProgressDTO(
                (int) totalPaths, 0, 0, (int) totalPractice, (int) passedPractice, (int) earnedBadges, 0);
    }
}
