package com.mniu.aicamp.quiz.application;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mniu.aicamp.growth.application.GrowthService;
import com.mniu.aicamp.quiz.infrastructure.mapper.ExamMapper;
import com.mniu.aicamp.quiz.infrastructure.mapper.ExamQuestionMapper;
import com.mniu.aicamp.quiz.infrastructure.mapper.ExamRecordMapper;
import com.mniu.aicamp.quiz.infrastructure.po.ExamPO;
import com.mniu.aicamp.quiz.infrastructure.po.ExamQuestionPO;
import com.mniu.aicamp.quiz.infrastructure.po.ExamRecordPO;
import com.mniu.aicamp.roadmap.infrastructure.mapper.RoadmapMapper;
import com.mniu.aicamp.roadmap.infrastructure.po.RoadmapPO;
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
import java.util.stream.Collectors;

@Service
public class ExamService {
    private static final String EXAM_GENERATE_PROMPT = """
            你是一位 AI 教育专家，擅长设计技术测验题目。
            请根据以下学习路线图中第 %d 周的内容，生成一场测验。

            周主题：%s
            学习目标：%s

            要求：
            1. 生成 8 道单选题 + 2 道多选题 + 1 道思考题
            2. 选择题覆盖所有学习目标，难度分布：基础 40%%、中级 40%%、进阶 20%%
            3. 每道选择题提供 4 个选项，其中 1-2 个正确答案
            4. 思考题要求结合实际场景进行分析或设计
            5. 每道题必须附带详细的答案解析
            6. 思考题附带评分标准要点（5个维度，每维度2分，满分10分）

            输出必须为合法的 JSON，格式如下：
            {
              "title": "第%d周：%s",
              "description": "本测验检验你对%s的掌握程度",
              "time_limit_minutes": 30,
              "passing_score": 60,
              "questions": [
                {
                  "order_num": 1,
                  "question_type": "SINGLE_CHOICE",
                  "content": "题目内容",
                  "options": [{"key": "A", "content": "选项A"}, {"key": "B", "content": "选项B"}, {"key": "C", "content": "选项C"}, {"key": "D", "content": "选项D"}],
                  "correct_answer": "B",
                  "explanation": "详细解析...",
                  "xp_reward": 5
                }
              ]
            }
            """;

    private static final String THINKING_GRADE_PROMPT = """
            你是一位公正的 AI 评分专家。请根据以下评分标准，对学习者的回答进行评分。

            题目：%s
            评分标准：%s

            学习者回答：%s

            请按以下维度评分（每个维度 0-2 分，满分 10 分）：
            1. 概念准确性
            2. 方案完整性
            3. 代码/示例质量（如适用）
            4. 最佳实践遵循
            5. 创新性/深度

            返回 JSON 格式：
            {
              "score": <int 0-10>,
              "feedback": "总体评价...",
              "dimension_scores": {
                "概念准确性": <int 0-2>,
                "方案完整性": <int 0-2>,
                "代码示例质量": <int 0-2>,
                "最佳实践遵循": <int 0-2>,
                "创新性深度": <int 0-2>
              }
            }
            """;

    private final ExamMapper exams;
    private final ExamQuestionMapper questions;
    private final ExamRecordMapper records;
    private final RoadmapMapper roadmaps;
    private final SnowflakeIdGenerator idGenerator;
    private final ObjectMapper objectMapper;
    private final AiClientPort aiClient;
    private final GrowthService growthService;

    public ExamService(ExamMapper exams, ExamQuestionMapper questions, ExamRecordMapper records,
                      RoadmapMapper roadmaps, SnowflakeIdGenerator idGenerator,
                      ObjectMapper objectMapper, AiClientPort aiClient, GrowthService growthService) {
        this.exams = exams;
        this.questions = questions;
        this.records = records;
        this.roadmaps = roadmaps;
        this.idGenerator = idGenerator;
        this.objectMapper = objectMapper;
        this.aiClient = aiClient;
        this.growthService = growthService;
    }

    // ========== 测验管理 ==========

    public List<Exam> listByRoadmap(Long roadmapId) {
        return exams.selectList(Wrappers.<ExamPO>lambdaQuery()
                        .eq(ExamPO::getRoadmapId, roadmapId)
                        .orderByAsc(ExamPO::getWeek))
                .stream().map(this::toExam).toList();
    }

    public Exam getExam(Long id) {
        ExamPO po = exams.selectById(id);
        if (po == null) throw new BusinessException(ErrorCode.NOT_FOUND, "Exam not found");
        return toExam(po);
    }

    public List<ExamQuestion> getQuestions(Long examId) {
        return questions.selectList(Wrappers.<ExamQuestionPO>lambdaQuery()
                        .eq(ExamQuestionPO::getExamId, examId)
                        .orderByAsc(ExamQuestionPO::getOrderNum))
                .stream().map(this::toQuestion).toList();
    }

    // ========== AI 生成测验 ==========

    @Transactional
    public List<Exam> generateExams(Long roadmapId) {
        RoadmapPO roadmap = roadmaps.selectById(roadmapId);
        if (roadmap == null) throw new BusinessException(ErrorCode.NOT_FOUND, "Roadmap not found");

        // 解析 roadmap JSON 获取各周信息
        List<Map<String, Object>> weeks = parseRoadmapWeeks(roadmap.getRoadmap());
        List<Exam> generated = new ArrayList<>();

        for (int i = 0; i < weeks.size(); i++) {
            Map<String, Object> week = weeks.get(i);
            int weekNum = i + 1;
            String theme = (String) week.getOrDefault("theme", "第" + weekNum + "周");
            String goals = ((List<String>) week.getOrDefault("objectives", List.of())).toString();

            Exam exam = generateSingleExam(roadmapId, weekNum, theme, goals);
            generated.add(exam);
        }
        return generated;
    }

    private Exam generateSingleExam(Long roadmapId, int week, String theme, String goals) {
        // 检查是否已存在
        ExamPO existing = exams.selectOne(Wrappers.<ExamPO>lambdaQuery()
                .eq(ExamPO::getRoadmapId, roadmapId)
                .eq(ExamPO::getWeek, week));
        if (existing != null) return toExam(existing);

        try {
            String prompt = String.format(EXAM_GENERATE_PROMPT, week, theme, goals, week, theme, theme);
            String response = aiClient.chat("你是一个专业的出题专家。只返回 JSON，不要其他内容。", prompt);
            return parseAndSaveExam(response, roadmapId, week);
        } catch (Exception e) {
            // 降级：使用通用模板
            return createFallbackExam(roadmapId, week, theme);
        }
    }

    private Exam parseAndSaveExam(String response, Long roadmapId, int week) {
        try {
            String json = extractJson(response);
            Map<?, ?> data = objectMapper.readValue(json, Map.class);

            ExamPO exam = new ExamPO();
            exam.setId(idGenerator.nextId());
            exam.setRoadmapId(roadmapId);
            exam.setWeek(week);
            exam.setTitle((String) data.getOrDefault("title", "第" + week + "周测验"));
            exam.setDescription((String) data.getOrDefault("description", ""));
            exam.setTimeLimitMinutes(((Number) data.getOrDefault("time_limit_minutes", 30)).intValue());
            exam.setPassingScore(((Number) data.getOrDefault("passing_score", 60)).intValue());
            exam.setCreatedAt(Instant.now());
            exams.insert(exam);

            // 插入题目
            List<Map<String, Object>> questionList = (List<Map<String, Object>>) data.getOrDefault("questions", List.of());
            for (Map<String, Object> q : questionList) {
                ExamQuestionPO qPo = new ExamQuestionPO();
                qPo.setId(idGenerator.nextId());
                qPo.setExamId(exam.getId());
                qPo.setQuestionType((String) q.getOrDefault("question_type", "SINGLE_CHOICE"));
                qPo.setOrderNum(((Number) q.getOrDefault("order_num", 1)).intValue());
                qPo.setContent((String) q.getOrDefault("content", ""));
                qPo.setOptions(toJson(q.get("options")));
                qPo.setCorrectAnswer(toJson(q.get("correct_answer")));
                qPo.setExplanation((String) q.getOrDefault("explanation", ""));
                qPo.setXpReward(((Number) q.getOrDefault("xp_reward", 5)).intValue());
                qPo.setCreatedAt(Instant.now());
                questions.insert(qPo);
            }

            // 更新题目数量
            ExamPO update = new ExamPO();
            update.setId(exam.getId());
            update.setQuestionCount(questionList.size());
            exams.updateById(update);

            return toExam(exams.selectById(exam.getId()));
        } catch (Exception e) {
            return createFallbackExam(roadmapId, week, "第" + week + "周");
        }
    }

    private Exam createFallbackExam(Long roadmapId, int week, String theme) {
        ExamPO exam = new ExamPO();
        exam.setId(idGenerator.nextId());
        exam.setRoadmapId(roadmapId);
        exam.setWeek(week);
        exam.setTitle("第" + week + "周：" + theme);
        exam.setDescription("本测验检验你对" + theme + "的掌握程度");
        exam.setTimeLimitMinutes(30);
        exam.setPassingScore(60);
        exam.setCreatedAt(Instant.now());
        exams.insert(exam);

        // 生成通用题目
        for (int i = 1; i <= 5; i++) {
            ExamQuestionPO q = new ExamQuestionPO();
            q.setId(idGenerator.nextId());
            q.setExamId(exam.getId());
            q.setQuestionType(i <= 4 ? "SINGLE_CHOICE" : "THINKING");
            q.setOrderNum(i);
            q.setContent("第 " + i + " 题：关于 " + theme + " 的问题");
            q.setOptions(i <= 4 ? toJson(List.of(
                    Map.of("key", "A", "content", "选项A"),
                    Map.of("key", "B", "content", "选项B"),
                    Map.of("key", "C", "content", "选项C"),
                    Map.of("key", "D", "content", "选项D")
            )) : null);
            q.setCorrectAnswer(i <= 4 ? toJson("B") : null);
            q.setExplanation("参考答案解析");
            q.setXpReward(5);
            q.setCreatedAt(Instant.now());
            questions.insert(q);
        }

        ExamPO update = new ExamPO();
        update.setId(exam.getId());
        update.setQuestionCount(5);
        exams.updateById(update);

        return toExam(exams.selectById(exam.getId()));
    }

    // ========== 考试流程 ==========

    @Transactional
    public ExamRecord startExam(Long userId, Long examId) {
        ExamPO exam = exams.selectById(examId);
        if (exam == null) throw new BusinessException(ErrorCode.NOT_FOUND, "Exam not found");

        // 查找进行中的记录
        ExamRecordPO inProgress = records.selectOne(Wrappers.<ExamRecordPO>lambdaQuery()
                .eq(ExamRecordPO::getUserId, userId)
                .eq(ExamRecordPO::getExamId, examId)
                .isNull(ExamRecordPO::getCompletedAt));
        if (inProgress != null) {
            return toRecord(inProgress, parseAnswers(inProgress.getAnswers()));
        }

        ExamRecordPO po = new ExamRecordPO();
        po.setId(idGenerator.nextId());
        po.setUserId(userId);
        po.setExamId(examId);
        po.setScore(0);
        po.setPassed(false);
        po.setTotalQuestions(exam.getQuestionCount());
        po.setCorrectCount(0);
        po.setStartedAt(Instant.now());
        records.insert(po);

        return toRecord(po, List.of());
    }

    @Transactional
    public ExamRecord submitExam(Long userId, Long examId, ExamSubmitRequest request) {
        ExamRecordPO record = records.selectOne(Wrappers.<ExamRecordPO>lambdaQuery()
                .eq(ExamRecordPO::getId, request.recordId())
                .eq(ExamRecordPO::getUserId, userId));
        if (record == null) throw new BusinessException(ErrorCode.NOT_FOUND, "Exam record not found");
        if (record.getCompletedAt() != null) throw new BusinessException(ErrorCode.BAD_REQUEST, "Exam already submitted");

        ExamPO exam = exams.selectById(examId);
        if (exam == null) throw new BusinessException(ErrorCode.NOT_FOUND, "Exam not found");

        List<ExamQuestionPO> questionList = questions.selectList(Wrappers.<ExamQuestionPO>lambdaQuery()
                .eq(ExamQuestionPO::getExamId, examId));

        // 评分选择题
        int choiceScore = 0;
        int correctCount = 0;
        int totalChoiceXp = 0;
        List<AnswerDetail> answerDetails = new ArrayList<>();
        List<Map<String, Object>> thinkingAnswers = new ArrayList<>();

        Map<Long, ExamQuestionPO> questionMap = questionList.stream()
                .collect(Collectors.toMap(ExamQuestionPO::getId, q -> q));

        for (AnswerItem answer : request.answers()) {
            ExamQuestionPO q = questionMap.get(answer.questionId());
            if (q == null) continue;

            if ("SINGLE_CHOICE".equals(q.getQuestionType()) || "MULTI_CHOICE".equals(q.getQuestionType())) {
                boolean isCorrect = checkChoiceAnswer(q.getCorrectAnswer(), answer.userAnswer());
                int points = isCorrect ? (q.getXpReward() != null ? q.getXpReward() : 5) : 0;
                if (isCorrect) {
                    correctCount++;
                    choiceScore += points;
                }
                totalChoiceXp += (q.getXpReward() != null ? q.getXpReward() : 5);
                answerDetails.add(new AnswerDetail(q.getId(), q.getQuestionType(), answer.userAnswer(), isCorrect, points));
            } else if ("THINKING".equals(q.getQuestionType())) {
                answerDetails.add(new AnswerDetail(q.getId(), "THINKING", answer.userAnswer(), null, 0));
                thinkingAnswers.add(Map.of(
                        "question_id", q.getId(),
                        "question", q.getContent(),
                        "explanation", q.getExplanation(),
                        "answer", answer.userAnswer().toString()
                ));
            }
        }

        // AI 评分思考题
        int thinkingScore = 0;
        int thinkingMaxScore = 0;
        List<ThinkingEvaluation> thinkingEvaluations = new ArrayList<>();
        String overallComment = "";

        if (!thinkingAnswers.isEmpty()) {
            ThinkingGradeResult gradeResult = gradeThinkingAnswers(thinkingAnswers);
            thinkingScore = gradeResult.totalScore();
            thinkingMaxScore = gradeResult.totalMaxScore();
            thinkingEvaluations = gradeResult.evaluations();
            overallComment = gradeResult.overallComment();

            // 更新思考题得分
            for (int i = 0; i < answerDetails.size(); i++) {
                AnswerDetail ad = answerDetails.get(i);
                if ("THINKING".equals(ad.questionType())) {
                    ThinkingEvaluation eval = thinkingEvaluations.stream()
                            .filter(e -> e.questionId().equals(ad.questionId()))
                            .findFirst().orElse(null);
                    if (eval != null) {
                        answerDetails.set(i, new AnswerDetail(ad.questionId(), ad.questionType(), ad.userAnswer(), null, eval.score()));
                    }
                }
            }
        }

        // 计算总分（百分制）
        int totalPossible = totalChoiceXp + thinkingMaxScore;
        int finalScore = totalPossible > 0 ? (choiceScore + thinkingScore) * 100 / totalPossible : 0;
        boolean passed = finalScore >= (exam.getPassingScore() != null ? exam.getPassingScore() : 60);

        // 更新记录
        ExamRecordPO update = new ExamRecordPO();
        update.setId(record.getId());
        update.setScore(finalScore);
        update.setPassed(passed);
        update.setCorrectCount(correctCount);
        update.setAnswers(toJson(answerDetails));
        update.setAiEvaluation(toJson(new AiEvaluationRecord(thinkingEvaluations, overallComment)));
        update.setCompletedAt(Instant.now());
        records.updateById(update);

        // 奖励 XP
        int xpEarned = 10; // 参与奖励
        xpEarned += choiceScore;
        xpEarned += thinkingScore;
        if (passed) xpEarned += 30;
        if (finalScore >= 90) xpEarned += 50;
        growthService.addXp(userId, xpEarned, "EXAM_SUBMITTED");

        // 更新路线图掌握度
        updateRoadmapMastery(exam.getRoadmapId(), exam.getWeek());

        return toRecord(records.selectById(record.getId()), answerDetails);
    }

    @Transactional
    public void updateRoadmapMastery(Long roadmapId, int week) {
        // 获取该周所有考试记录，计算最佳分数
        ExamPO exam = exams.selectOne(Wrappers.<ExamPO>lambdaQuery()
                .eq(ExamPO::getRoadmapId, roadmapId)
                .eq(ExamPO::getWeek, week));
        if (exam == null) return;

        List<ExamRecordPO> weekRecords = records.selectList(Wrappers.<ExamRecordPO>lambdaQuery()
                .eq(ExamRecordPO::getExamId, exam.getId())
                .isNotNull(ExamRecordPO::getCompletedAt));

        if (weekRecords.isEmpty()) return;

        int bestScore = weekRecords.stream().mapToInt(ExamRecordPO::getScore).max().orElse(0);
        String level = getMasteryLevel(bestScore);

        // 更新 roadmaps 表
        RoadmapPO roadmapUpdate = new RoadmapPO();
        roadmapUpdate.setId(roadmapId);
        roadmapUpdate.setMasteryScore(bestScore);
        roadmapUpdate.setMasteryLevel(level);
        roadmapUpdate.setLastExamAt(Instant.now());
        roadmaps.updateById(roadmapUpdate);
    }

    // ========== 考试记录 ==========

    public PageResponse<ExamRecord> listMyRecords(Long userId, int page, int size) {
        List<ExamRecordPO> all = records.selectList(Wrappers.<ExamRecordPO>lambdaQuery()
                .eq(ExamRecordPO::getUserId, userId)
                .isNotNull(ExamRecordPO::getCompletedAt)
                .orderByDesc(ExamRecordPO::getCreatedAt));
        List<ExamRecord> items = all.stream().map(po -> toRecord(po, parseAnswers(po.getAnswers()))).toList();
        return PageResponse.of(items, page, size);
    }

    public ExamRecord getRecord(Long userId, Long recordId) {
        ExamRecordPO po = records.selectOne(Wrappers.<ExamRecordPO>lambdaQuery()
                .eq(ExamRecordPO::getId, recordId)
                .eq(ExamRecordPO::getUserId, userId));
        if (po == null) throw new BusinessException(ErrorCode.NOT_FOUND, "Exam record not found");
        return toRecord(po, parseAnswers(po.getAnswers()));
    }

    // ========== 掌握程度 ==========

    public Map<String, Object> getMastery(Long roadmapId) {
        List<ExamPO> examList = exams.selectList(Wrappers.<ExamPO>lambdaQuery()
                .eq(ExamPO::getRoadmapId, roadmapId)
                .orderByAsc(ExamPO::getWeek));

        List<Map<String, Object>> weekMastery = new ArrayList<>();
        int totalScore = 0;
        int testedWeeks = 0;

        for (ExamPO exam : examList) {
            List<ExamRecordPO> completed = records.selectList(Wrappers.<ExamRecordPO>lambdaQuery()
                    .eq(ExamRecordPO::getExamId, exam.getId())
                    .isNotNull(ExamRecordPO::getCompletedAt));

            if (completed.isEmpty()) {
                weekMastery.add(Map.of(
                        "week", exam.getWeek(),
                        "score", (Object) null,
                        "level", "NOT_TESTED",
                        "attempts", 0,
                        "best_score", (Object) null,
                        "last_exam_at", (Object) null
                ));
            } else {
                int best = completed.stream().mapToInt(ExamRecordPO::getScore).max().orElse(0);
                totalScore += best;
                testedWeeks++;
                weekMastery.add(Map.of(
                        "week", exam.getWeek(),
                        "score", best,
                        "level", getMasteryLevel(best),
                        "attempts", completed.size(),
                        "best_score", best,
                        "last_exam_at", completed.get(0).getCompletedAt()
                ));
            }
        }

        int overallScore = testedWeeks > 0 ? totalScore / testedWeeks : 0;
        return Map.of(
                "overall_score", overallScore,
                "overall_level", getMasteryLevel(overallScore),
                "tested_weeks", testedWeeks,
                "total_weeks", examList.size(),
                "week_mastery", weekMastery
        );
    }

    // ========== AI 评分 ==========

    private ThinkingGradeResult gradeThinkingAnswers(List<Map<String, Object>> thinkingAnswers) {
        int totalScore = 0;
        int totalMaxScore = 0;
        List<ThinkingEvaluation> evaluations = new ArrayList<>();
        StringBuilder comments = new StringBuilder();

        for (Map<String, Object> answer : thinkingAnswers) {
            try {
                String prompt = String.format(THINKING_GRADE_PROMPT,
                        answer.get("question"), answer.get("explanation"), answer.get("answer"));
                String response = aiClient.chat("你是一个严格的评分专家。只返回 JSON。", prompt);
                Map<?, ?> result = objectMapper.readValue(extractJson(response), Map.class);

                int score = ((Number) result.getOrDefault("score", 5)).intValue();
                String feedback = (String) result.getOrDefault("feedback", "回答完成");
                @SuppressWarnings("unchecked")
                Map<String, Integer> dimensions = (Map<String, Integer>) result.getOrDefault("dimension_scores", Map.of());

                totalScore += score;
                totalMaxScore += 10;
                evaluations.add(new ThinkingEvaluation(
                        ((Number) answer.get("question_id")).longValue(),
                        score, 10, feedback, dimensions));
                comments.append(feedback).append("; ");
            } catch (Exception e) {
                totalScore += 5; // 降级：默认 50%
                totalMaxScore += 10;
                evaluations.add(new ThinkingEvaluation(
                        ((Number) answer.get("question_id")).longValue(),
                        5, 10, "评分完成", Map.of()));
            }
        }

        return new ThinkingGradeResult(totalScore, totalMaxScore, evaluations, comments.toString());
    }

    // ========== 内部方法 ==========

    private boolean checkChoiceAnswer(String correctAnswerJson, Object userAnswer) {
        try {
            String correct = objectMapper.readValue(correctAnswerJson, String.class);
            if (userAnswer instanceof String) {
                return correct.equalsIgnoreCase((String) userAnswer);
            } else if (userAnswer instanceof List) {
                List<String> correctList = objectMapper.readValue(correctAnswerJson,
                        objectMapper.getTypeFactory().constructCollectionType(List.class, String.class));
                List<String> userList = ((List<?>) userAnswer).stream().map(Object::toString).toList();
                return new java.util.HashSet<>(correctList).equals(new java.util.HashSet<>(userList));
            }
        } catch (Exception e) {
            return false;
        }
        return false;
    }

    private String getMasteryLevel(int score) {
        if (score >= 90) return "MASTERY";
        if (score >= 75) return "GOOD";
        if (score >= 60) return "PASS";
        return "FAIL";
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> parseRoadmapWeeks(String roadmapJson) {
        if (roadmapJson == null || roadmapJson.isBlank()) return List.of();
        try {
            Map<String, Object> roadmap = objectMapper.readValue(roadmapJson, Map.class);
            List<Map<String, Object>> weeks = (List<Map<String, Object>>) roadmap.getOrDefault("weeks", List.of());
            return weeks != null ? weeks : List.of();
        } catch (Exception e) {
            return List.of();
        }
    }

    private String extractJson(String text) {
        int start = text.indexOf("{");
        int end = text.lastIndexOf("}");
        if (start >= 0 && end > start) return text.substring(start, end + 1);
        return text;
    }

    private String toJson(Object obj) {
        if (obj == null) return null;
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            return "[]";
        }
    }

    @SuppressWarnings("unchecked")
    private List<AnswerDetail> parseAnswers(String answersJson) {
        if (answersJson == null || answersJson.isBlank()) return List.of();
        try {
            return objectMapper.readValue(answersJson, List.class);
        } catch (Exception e) {
            return List.of();
        }
    }

    // ========== PO -> Record 转换 ==========

    private Exam toExam(ExamPO po) {
        return new Exam(po.getId(), po.getRoadmapId(), po.getWeek() != null ? po.getWeek() : 0,
                po.getTitle(), po.getDescription(),
                po.getQuestionCount() != null ? po.getQuestionCount() : 0,
                po.getTimeLimitMinutes() != null ? po.getTimeLimitMinutes() : 0,
                po.getPassingScore() != null ? po.getPassingScore() : 60,
                po.getCreatedAt());
    }

    private ExamQuestion toQuestion(ExamQuestionPO po) {
        List<QuestionOption> options = parseOptions(po.getOptions());
        return new ExamQuestion(po.getId(), po.getExamId(), po.getQuestionType(),
                po.getOrderNum() != null ? po.getOrderNum() : 0,
                po.getContent(), options, po.getExplanation(),
                po.getXpReward() != null ? po.getXpReward() : 5);
    }

    @SuppressWarnings("unchecked")
    private List<QuestionOption> parseOptions(String json) {
        if (json == null || json.isBlank()) return null;
        try {
            List<Map<String, Object>> list = objectMapper.readValue(json, List.class);
            return list.stream().map(m -> new QuestionOption((String) m.get("key"), (String) m.get("content"))).toList();
        } catch (Exception e) {
            return null;
        }
    }

    private ExamRecord toRecord(ExamRecordPO po, List<AnswerDetail> answers) {
        return new ExamRecord(po.getId(), po.getUserId(), po.getExamId(),
                po.getScore() != null ? po.getScore() : 0,
                po.getPassed() != null && po.getPassed(),
                po.getTotalQuestions() != null ? po.getTotalQuestions() : 0,
                po.getCorrectCount() != null ? po.getCorrectCount() : 0,
                answers, parseAiEvaluation(po.getAiEvaluation()),
                po.getStartedAt(), po.getCompletedAt());
    }

    @SuppressWarnings("unchecked")
    private AiEvaluation parseAiEvaluation(String json) {
        if (json == null || json.isBlank()) return null;
        try {
            Map<String, Object> map = objectMapper.readValue(json, Map.class);
            List<Map<String, Object>> questions = (List<Map<String, Object>>) map.getOrDefault("thinking_questions", List.of());
            List<ThinkingEvaluation> evaluations = questions.stream().map(q -> {
                Map<String, Integer> dims = (Map<String, Integer>) q.getOrDefault("dimension_scores", Map.of());
                return new ThinkingEvaluation(((Number) q.get("question_id")).longValue(),
                        ((Number) q.getOrDefault("score", 0)).intValue(),
                        ((Number) q.getOrDefault("max_score", 10)).intValue(),
                        (String) q.getOrDefault("feedback", ""), dims);
            }).toList();
            return new AiEvaluation(evaluations, (String) map.getOrDefault("overall_comment", ""));
        } catch (Exception e) {
            return null;
        }
    }

    record ThinkingGradeResult(int totalScore, int totalMaxScore,
                               List<ThinkingEvaluation> evaluations, String overallComment) {
    }

    record AiEvaluationRecord(List<ThinkingEvaluation> thinkingQuestions, String overallComment) {
    }
}
