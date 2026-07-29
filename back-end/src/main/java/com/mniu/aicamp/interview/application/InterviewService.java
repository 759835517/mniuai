package com.mniu.aicamp.interview.application;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mniu.aicamp.interview.infrastructure.mapper.InterviewQuestionMapper;
import com.mniu.aicamp.interview.infrastructure.mapper.InterviewSetMapper;
import com.mniu.aicamp.interview.infrastructure.mapper.InterviewSkillProfileMapper;
import com.mniu.aicamp.interview.infrastructure.mapper.MockInterviewAnswerMapper;
import com.mniu.aicamp.interview.infrastructure.mapper.MockInterviewMapper;
import com.mniu.aicamp.interview.infrastructure.po.InterviewQuestionPO;
import com.mniu.aicamp.interview.infrastructure.po.InterviewSetPO;
import com.mniu.aicamp.interview.infrastructure.po.InterviewSkillProfilePO;
import com.mniu.aicamp.interview.infrastructure.po.MockInterviewAnswerPO;
import com.mniu.aicamp.interview.infrastructure.po.MockInterviewPO;
import com.mniu.aicamp.shared.ai.AiClientPort;
import com.mniu.aicamp.shared.api.ErrorCode;
import com.mniu.aicamp.shared.api.PageResponse;
import com.mniu.aicamp.shared.exception.BusinessException;
import com.mniu.aicamp.shared.util.SnowflakeIdGenerator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;
import java.util.stream.Collectors;

@Service
public class InterviewService {
    private static final String INTERVIEW_SYSTEM_PROMPT = """
            你是一名资深技术面试官，正在对候选人进行技术面试。
            候选人目标岗位：{target_role}

            面试规则：
            1. 候选人回答后，你要先追问 1-2 个深入问题（模拟真实面试追问）
            2. 追问结束后，输出 JSON 格式评分：
            {"score": <0-10>, "feedback": "总体评价（50字以内）", "key_points_hit": {"考察点名称": true/false}, "follow_up_done": true, "improvement": "最重要的一个改进建议"}
            3. 评分要严格，工作 3 年以上候选人满分要求：思路清晰、举例充分、考虑边界
            4. 不要透露参考答案，用问题引导候选人自己思考
            """;

    private final InterviewQuestionMapper questions;
    private final InterviewSetMapper sets;
    private final MockInterviewMapper mockInterviews;
    private final MockInterviewAnswerMapper answers;
    private final InterviewSkillProfileMapper skillProfiles;
    private final SnowflakeIdGenerator idGenerator;
    private final ObjectMapper objectMapper;
    private final AiClientPort aiClient;

    public InterviewService(InterviewQuestionMapper questions, InterviewSetMapper sets,
                            MockInterviewMapper mockInterviews, MockInterviewAnswerMapper answers,
                            InterviewSkillProfileMapper skillProfiles, SnowflakeIdGenerator idGenerator,
                            ObjectMapper objectMapper, AiClientPort aiClient) {
        this.questions = questions;
        this.sets = sets;
        this.mockInterviews = mockInterviews;
        this.answers = answers;
        this.skillProfiles = skillProfiles;
        this.idGenerator = idGenerator;
        this.objectMapper = objectMapper;
        this.aiClient = aiClient;
    }

    // ========== 题库管理 ==========

    public PageResponse<InterviewQuestion> listQuestions(String category, String difficulty, String company, int page, int size) {
        List<InterviewQuestionPO> all = questions.selectList(Wrappers.<InterviewQuestionPO>lambdaQuery()
                .eq(InterviewQuestionPO::getStatus, "ACTIVE")
                .eq(category != null, InterviewQuestionPO::getCategory, category)
                .eq(difficulty != null, InterviewQuestionPO::getDifficulty, difficulty)
                .orderByDesc(InterviewQuestionPO::getCreatedAt));
        if (company != null) {
            all = all.stream().filter(po -> containsInJson(po.getCompanies(), company)).toList();
        }
        List<InterviewQuestion> items = all.stream().map(this::toQuestion).toList();
        return PageResponse.of(items, page, size);
    }

    public InterviewQuestion getQuestion(Long id) {
        InterviewQuestionPO po = questions.selectById(id);
        if (po == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND, "Question not found");
        }
        po.setViewCount((po.getViewCount() == null ? 0 : po.getViewCount()) + 1);
        questions.updateById(po);
        return toQuestion(po);
    }

    @Transactional
    public InterviewQuestion createQuestion(InterviewQuestionCreateRequest request) {
        InterviewQuestionPO po = new InterviewQuestionPO();
        po.setId(idGenerator.nextId());
        po.setCategory(request.category());
        po.setSubCategory(request.subCategory());
        po.setDifficulty(request.difficulty());
        po.setTitle(request.title());
        po.setContent(request.content());
        po.setExpectedAnswer(request.expectedAnswer());
        po.setKeyPoints(toJson(request.keyPoints()));
        po.setCompanies(toJson(request.companies()));
        po.setTags(toJson(request.tags()));
        po.setSource(request.source());
        po.setStatus("ACTIVE");
        po.setViewCount(0L);
        po.setCreatedAt(Instant.now());
        po.setUpdatedAt(Instant.now());
        questions.insert(po);
        return toQuestion(po);
    }

    @Transactional
    public List<InterviewQuestion> batchCreateQuestions(List<InterviewQuestionCreateRequest> requests) {
        List<InterviewQuestion> result = new ArrayList<>();
        for (InterviewQuestionCreateRequest request : requests) {
            result.add(createQuestion(request));
        }
        return result;
    }

    // ========== 套题管理 ==========

    public PageResponse<InterviewSet> listSets(int page, int size) {
        List<InterviewSetPO> all = sets.selectList(Wrappers.<InterviewSetPO>lambdaQuery()
                .eq(InterviewSetPO::getStatus, "ACTIVE")
                .orderByDesc(InterviewSetPO::getCreatedAt));
        List<InterviewSet> items = all.stream().map(this::toSet).toList();
        return PageResponse.of(items, page, size);
    }

    public InterviewSet getSet(Long id) {
        InterviewSetPO po = sets.selectById(id);
        if (po == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND, "Interview set not found");
        }
        return toSet(po);
    }

    // ========== 模拟面试 ==========

    @Transactional
    public MockInterview startMockInterview(Long userId, MockInterviewStartRequest request) {
        List<Long> questionIds;
        String targetRole = request.targetRole();

        if ("SET".equals(request.mode())) {
            InterviewSetPO set = sets.selectById(request.interviewSetId());
            if (set == null) {
                throw new BusinessException(ErrorCode.NOT_FOUND, "Interview set not found");
            }
            questionIds = parseJsonLongList(set.getQuestionIds());
            targetRole = targetRole != null ? targetRole : set.getTargetRole();
        } else if ("RANDOM".equals(request.mode())) {
            questionIds = pickRandomQuestions(request.categories(), request.difficulty(), request.questionCount() != null ? request.questionCount() : 5);
        } else if ("WEAK".equals(request.mode())) {
            questionIds = pickWeakPointQuestions(userId, request.questionCount() != null ? request.questionCount() : 5);
        } else {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "Invalid mode: " + request.mode());
        }

        if (questionIds.isEmpty()) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "No questions available");
        }

        MockInterviewPO po = new MockInterviewPO();
        po.setId(idGenerator.nextId());
        po.setUserId(userId);
        po.setInterviewSetId(request.interviewSetId());
        po.setMode(request.mode());
        po.setStatus("IN_PROGRESS");
        po.setStartedAt(Instant.now());
        mockInterviews.insert(po);

        // 存储题目顺序到 aiSummary 字段（临时存储，完成后会被覆盖）
        MockInterviewPO update = new MockInterviewPO();
        update.setId(po.getId());
        update.setAiSummary(toJson(questionIds));
        mockInterviews.updateById(update);

        return toMockInterview(po, questionIds);
    }

    public MockInterview getMockInterview(Long userId, Long id) {
        MockInterviewPO po = mockInterviews.selectOne(Wrappers.<MockInterviewPO>lambdaQuery()
                .eq(MockInterviewPO::getId, id)
                .eq(MockInterviewPO::getUserId, userId));
        if (po == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND, "Mock interview not found");
        }
        List<Long> questionIds = parseJsonLongList(po.getAiSummary());
        return toMockInterview(po, questionIds);
    }

    public PageResponse<MockInterview> listMockInterviews(Long userId, int page, int size) {
        List<MockInterviewPO> all = mockInterviews.selectList(Wrappers.<MockInterviewPO>lambdaQuery()
                .eq(MockInterviewPO::getUserId, userId)
                .orderByDesc(MockInterviewPO::getStartedAt));
        List<MockInterview> items = all.stream().map(po -> toMockInterview(po, null)).toList();
        return PageResponse.of(items, page, size);
    }

    @Transactional
    public MockInterviewAnswer submitAnswer(Long userId, Long mockInterviewId, MockInterviewAnswerRequest request) {
        MockInterviewPO interview = mockInterviews.selectOne(Wrappers.<MockInterviewPO>lambdaQuery()
                .eq(MockInterviewPO::getId, mockInterviewId)
                .eq(MockInterviewPO::getUserId, userId));
        if (interview == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND, "Mock interview not found");
        }
        if (!"IN_PROGRESS".equals(interview.getStatus())) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "Interview is not in progress");
        }

        InterviewQuestionPO question = questions.selectById(request.questionId());
        if (question == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND, "Question not found");
        }

        // AI 评分
        AiScoreResult scoreResult = gradeAnswer(question, request.userAnswer());

        long orderCount = answers.selectCount(Wrappers.<MockInterviewAnswerPO>lambdaQuery()
                .eq(MockInterviewAnswerPO::getMockInterviewId, mockInterviewId));

        MockInterviewAnswerPO answerPO = new MockInterviewAnswerPO();
        answerPO.setId(idGenerator.nextId());
        answerPO.setMockInterviewId(mockInterviewId);
        answerPO.setQuestionId(request.questionId());
        answerPO.setQuestionOrder((int) orderCount);
        answerPO.setUserAnswer(request.userAnswer());
        answerPO.setAiScore(scoreResult.score());
        answerPO.setAiFeedback(scoreResult.feedback());
        answerPO.setAiKeyPointsHit(toJson(scoreResult.keyPointsHit()));
        answerPO.setThinkingSeconds(request.thinkingSeconds());
        answerPO.setAnsweredAt(Instant.now());
        answers.insert(answerPO);

        return toAnswer(answerPO);
    }

    @Transactional
    public MockInterview completeMockInterview(Long userId, Long mockInterviewId) {
        MockInterviewPO interview = mockInterviews.selectOne(Wrappers.<MockInterviewPO>lambdaQuery()
                .eq(MockInterviewPO::getId, mockInterviewId)
                .eq(MockInterviewPO::getUserId, userId));
        if (interview == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND, "Mock interview not found");
        }

        List<MockInterviewAnswerPO> answerList = answers.selectList(Wrappers.<MockInterviewAnswerPO>lambdaQuery()
                .eq(MockInterviewAnswerPO::getMockInterviewId, mockInterviewId)
                .orderByAsc(MockInterviewAnswerPO::getQuestionOrder));

        // 计算整体分数
        int overallScore = answerList.isEmpty() ? 0 :
                (int) answerList.stream().mapToInt(MockInterviewAnswerPO::getAiScore).average().orElse(0) * 10;

        // 生成整体评价
        String summary = generateOverallSummary(answerList);

        MockInterviewPO update = new MockInterviewPO();
        update.setId(mockInterviewId);
        update.setStatus("COMPLETED");
        update.setOverallScore(overallScore);
        update.setAiSummary(summary);
        update.setCompletedAt(Instant.now());
        if (interview.getStartedAt() != null) {
            update.setDurationSeconds((int) java.time.Duration.between(interview.getStartedAt(), Instant.now()).getSeconds());
        }
        mockInterviews.updateById(update);

        // 更新能力画像
        updateSkillProfiles(userId, answerList);

        return toMockInterview(mockInterviews.selectById(mockInterviewId), null);
    }

    // ========== 能力画像 ==========

    public List<InterviewSkillProfile> getSkillProfile(Long userId) {
        List<InterviewSkillProfilePO> list = skillProfiles.selectList(Wrappers.<InterviewSkillProfilePO>lambdaQuery()
                .eq(InterviewSkillProfilePO::getUserId, userId));
        return list.stream().map(this::toSkillProfile).toList();
    }

    // ========== AI 面试官 SSE ==========

    public void streamInterview(Long userId, Long mockInterviewId, Long questionId, String userAnswer, Consumer<String> onToken) {
        InterviewQuestionPO question = questions.selectById(questionId);
        if (question == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND, "Question not found");
        }

        String systemPrompt = INTERVIEW_SYSTEM_PROMPT.replace("{target_role}", "候选人");
        String prompt = buildInterviewPrompt(question, userAnswer);

        aiClient.stream(systemPrompt, prompt, onToken);
    }

    // ========== 内部方法 ==========

    private AiScoreResult gradeAnswer(InterviewQuestionPO question, String userAnswer) {
        String prompt = String.format("""
                请对以下面试回答进行评分（0-10分）。

                题目：%s
                考察点：%s
                候选人回答：%s

                请严格按以下 JSON 格式返回评分：
                {"score": <0-10>, "feedback": "总体评价（50字以内）", "key_points_hit": {"考察点": true/false}, "improvement": "最重要的一个改进建议"}
                """,
                question.getTitle(),
                question.getKeyPoints(),
                userAnswer);

        try {
            String response = aiClient.chat("你是一个严格的面试评分官。只返回 JSON，不要其他内容。", prompt);
            return parseScoreResult(response, parseJsonList(question.getKeyPoints()));
        } catch (Exception e) {
            return new AiScoreResult(5, "评分完成", Map.of(), "继续努力");
        }
    }

    @SuppressWarnings("unchecked")
    private AiScoreResult parseScoreResult(String response, List<String> keyPoints) {
        try {
            String json = extractJson(response);
            Map<String, Object> map = objectMapper.readValue(json, Map.class);
            int score = ((Number) map.getOrDefault("score", 5)).intValue();
            String feedback = (String) map.getOrDefault("feedback", "回答完成");
            String improvement = (String) map.getOrDefault("improvement", "继续提升");
            Map<String, Boolean> hit = new java.util.HashMap<>();
            for (String kp : keyPoints) {
                Object kpHit = map.get("key_points_hit");
                if (kpHit instanceof Map) {
                    Object v = ((Map<?, ?>) kpHit).get(kp);
                    hit.put(kp, Boolean.TRUE.equals(v));
                } else {
                    hit.put(kp, false);
                }
            }
            return new AiScoreResult(score, feedback, hit, improvement);
        } catch (Exception e) {
            return new AiScoreResult(5, "评分完成", new java.util.HashMap<>(), "继续努力");
        }
    }

    private String buildInterviewPrompt(InterviewQuestionPO question, String userAnswer) {
        StringBuilder sb = new StringBuilder();
        sb.append("面试题目：").append(question.getTitle()).append("\n");
        sb.append("题目描述：").append(question.getContent()).append("\n");
        sb.append("关键考察点：").append(question.getKeyPoints()).append("\n");
        if (userAnswer != null && !userAnswer.isBlank()) {
            sb.append("\n候选人回答：").append(userAnswer).append("\n");
            sb.append("\n请根据回答进行追问（1-2个深入问题），或如果回答充分则输出评分 JSON。");
        } else {
            sb.append("\n请开始提问。");
        }
        return sb.toString();
    }

    private String generateOverallSummary(List<MockInterviewAnswerPO> answers) {
        double avgScore = answers.stream().mapToInt(MockInterviewAnswerPO::getAiScore).average().orElse(0);
        if (avgScore >= 8) return "表现优秀，思路清晰，基础知识扎实，建议继续保持。";
        if (avgScore >= 6) return "整体表现良好，部分知识点需要加强，建议针对性复习。";
        if (avgScore >= 4) return "基础尚可，但深度和系统性不足，建议系统学习相关知识。";
        return "需要加强基础知识学习，建议从基础概念开始系统复习。";
    }

    private void updateSkillProfiles(Long userId, List<MockInterviewAnswerPO> answerList) {
        Map<String, List<MockInterviewAnswerPO>> byCategory = answerList.stream().collect(
                Collectors.groupingBy(a -> {
                    InterviewQuestionPO q = questions.selectById(a.getQuestionId());
                    return q != null ? q.getCategory() : "UNKNOWN";
                }));

        byCategory.forEach((category, categoryAnswers) -> {
            double avgScore = categoryAnswers.stream().mapToInt(MockInterviewAnswerPO::getAiScore).average().orElse(0);
            InterviewSkillProfilePO existing = skillProfiles.selectOne(Wrappers.<InterviewSkillProfilePO>lambdaQuery()
                    .eq(InterviewSkillProfilePO::getUserId, userId)
                    .eq(InterviewSkillProfilePO::getCategory, category));

            if (existing == null) {
                InterviewSkillProfilePO po = new InterviewSkillProfilePO();
                po.setId(idGenerator.nextId());
                po.setUserId(userId);
                po.setCategory(category);
                po.setAvgScore(new java.math.BigDecimal(avgScore));
                po.setInterviewCount(1);
                po.setLastUpdated(Instant.now());
                skillProfiles.insert(po);
            } else {
                int newCount = (existing.getInterviewCount() == null ? 0 : existing.getInterviewCount()) + 1;
                double newAvg = (existing.getAvgScore().doubleValue() * (newCount - 1) + avgScore) / newCount;
                InterviewSkillProfilePO update = new InterviewSkillProfilePO();
                update.setId(existing.getId());
                update.setAvgScore(new java.math.BigDecimal(newAvg).setScale(1, java.math.RoundingMode.HALF_UP));
                update.setInterviewCount(newCount);
                update.setLastUpdated(Instant.now());
                skillProfiles.updateById(update);
            }
        });
    }

    private List<Long> pickRandomQuestions(List<String> categories, String difficulty, int count) {
        var query = Wrappers.<InterviewQuestionPO>lambdaQuery()
                .eq(InterviewQuestionPO::getStatus, "ACTIVE");
        if (categories != null && !categories.isEmpty()) {
            query.in(InterviewQuestionPO::getCategory, categories);
        }
        if (difficulty != null) {
            query.eq(InterviewQuestionPO::getDifficulty, difficulty);
        }
        List<InterviewQuestionPO> all = questions.selectList(query);
        Collections.shuffle(all);
        return all.stream().limit(count).map(InterviewQuestionPO::getId).toList();
    }

    private List<Long> pickWeakPointQuestions(Long userId, int count) {
        // 找出分数最低的类别
        List<InterviewSkillProfilePO> profiles = skillProfiles.selectList(Wrappers.<InterviewSkillProfilePO>lambdaQuery()
                .eq(InterviewSkillProfilePO::getUserId, userId));
        String weakestCategory = null;
        if (!profiles.isEmpty()) {
            weakestCategory = profiles.stream()
                    .min((a, b) -> Double.compare(a.getAvgScore().doubleValue(), b.getAvgScore().doubleValue()))
                    .map(InterviewSkillProfilePO::getCategory)
                    .orElse(null);
        }
        return pickRandomQuestions(
                weakestCategory != null ? List.of(weakestCategory) : null,
                null, count);
    }

    private String extractJson(String text) {
        int start = text.indexOf("{");
        int end = text.lastIndexOf("}");
        if (start >= 0 && end > start) {
            return text.substring(start, end + 1);
        }
        return text;
    }

    private List<Long> parseJsonLongList(String json) {
        if (json == null || json.isBlank()) return List.of();
        try {
            return Arrays.stream(objectMapper.readValue(json, Long[].class)).toList();
        } catch (Exception e) {
            return List.of();
        }
    }

    @SuppressWarnings("unchecked")
    private List<String> parseJsonList(String json) {
        if (json == null || json.isBlank()) return List.of();
        try {
            return objectMapper.readValue(json, List.class);
        } catch (Exception e) {
            return List.of();
        }
    }

    private boolean containsInJson(String json, String value) {
        return parseJsonList(json).contains(value);
    }

    private String toJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            return "[]";
        }
    }

    // ========== PO -> Record 转换 ==========

    private InterviewQuestion toQuestion(InterviewQuestionPO po) {
        return new InterviewQuestion(po.getId(), po.getCategory(), po.getSubCategory(), po.getDifficulty(),
                po.getTitle(), po.getContent(), parseJsonList(po.getKeyPoints()), parseJsonList(po.getCompanies()),
                parseJsonList(po.getTags()), po.getSource(), po.getStatus(),
                po.getViewCount() == null ? 0 : po.getViewCount(), po.getCreatedAt());
    }

    private InterviewSet toSet(InterviewSetPO po) {
        return new InterviewSet(po.getId(), po.getTitle(), po.getDescription(), po.getTargetRole(),
                po.getDifficulty(), parseJsonLongList(po.getQuestionIds()),
                po.getDurationMinutes() == null ? 45 : po.getDurationMinutes(),
                po.getStatus(), po.getCreatedAt());
    }

    private MockInterview toMockInterview(MockInterviewPO po, List<Long> questionIds) {
        return new MockInterview(po.getId(), po.getUserId(), po.getInterviewSetId(), po.getMode(),
                po.getStatus(), po.getOverallScore(),
                po.getAiSummary(), po.getStartedAt(), po.getCompletedAt(), po.getDurationSeconds());
    }

    private MockInterviewAnswer toAnswer(MockInterviewAnswerPO po) {
        @SuppressWarnings("unchecked")
        Map<String, Boolean> hit = Map.of();
        try {
            if (po.getAiKeyPointsHit() != null && !po.getAiKeyPointsHit().isBlank()) {
                hit = objectMapper.readValue(po.getAiKeyPointsHit(), Map.class);
            }
        } catch (Exception ignored) {}
        return new MockInterviewAnswer(po.getId(), po.getMockInterviewId(), po.getQuestionId(),
                po.getQuestionOrder(), po.getUserAnswer(), po.getAiScore(), po.getAiFeedback(),
                hit, po.getThinkingSeconds(), po.getAnsweredAt());
    }

    private InterviewSkillProfile toSkillProfile(InterviewSkillProfilePO po) {
        return new InterviewSkillProfile(po.getId(), po.getUserId(), po.getCategory(),
                po.getAvgScore() == null ? 0 : po.getAvgScore().doubleValue(),
                po.getInterviewCount() == null ? 0 : po.getInterviewCount(), po.getLastUpdated());
    }

    record AiScoreResult(int score, String feedback, Map<String, Boolean> keyPointsHit, String improvement) {
    }
}
