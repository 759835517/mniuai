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
import com.mniu.aicamp.roadmap.infrastructure.mapper.RoadmapTaskMapper;
import com.mniu.aicamp.roadmap.infrastructure.po.RoadmapPO;
import com.mniu.aicamp.roadmap.infrastructure.po.RoadmapTaskPO;
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
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ExamService {
    private static final String EXAM_GENERATE_PROMPT = """
            你是一位 AI 教育专家，擅长设计技术测验题目。
            请根据以下学习路线图中第 %d 周的内容，生成一场测验。

            周主题：%s
            学习任务：%s

            要求：
            1. 生成 8 道单选题 + 2 道多选题 + 1 道思考题
            2. 选择题覆盖所有学习任务，难度分布：基础 40%%、中级 40%%、进阶 20%%
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
    private final RoadmapTaskMapper roadmapTasks;
    private final SnowflakeIdGenerator idGenerator;
    private final ObjectMapper objectMapper;
    private final AiClientPort aiClient;
    private final GrowthService growthService;

    public ExamService(ExamMapper exams, ExamQuestionMapper questions, ExamRecordMapper records,
                      RoadmapMapper roadmaps, RoadmapTaskMapper roadmapTasks, SnowflakeIdGenerator idGenerator,
                      ObjectMapper objectMapper, AiClientPort aiClient, GrowthService growthService) {
        this.exams = exams;
        this.questions = questions;
        this.records = records;
        this.roadmaps = roadmaps;
        this.roadmapTasks = roadmapTasks;
        this.idGenerator = idGenerator;
        this.objectMapper = objectMapper;
        this.aiClient = aiClient;
        this.growthService = growthService;
    }

    // ========== 演示数据初始化 ==========

    /**
     * 为当前用户初始化演示路线图 + 考试数据（幂等）。
     * 如果用户已有路线图则复用，否则创建一个演示路线图并生成考试。
     */
    @Transactional
    public Long initDemoData(Long userId) {
        // 查找用户已有的活跃路线图
        RoadmapPO existing = roadmaps.selectOne(Wrappers.<RoadmapPO>lambdaQuery()
                .eq(RoadmapPO::getUserId, userId)
                .eq(RoadmapPO::getActive, true));
        Long roadmapId = existing != null ? existing.getId() : null;

        if (roadmapId == null) {
            roadmapId = createDemoRoadmap(userId);
        }

        // 如果该路线图已有考试则跳过
        Long finalRoadmapId = roadmapId;
        long examCount = exams.selectCount(Wrappers.<ExamPO>lambdaQuery()
                .eq(ExamPO::getRoadmapId, finalRoadmapId));
        if (examCount > 0) {
            return roadmapId;
        }

        createDemoExams(roadmapId);
        return roadmapId;
    }

    private Long createDemoRoadmap(Long userId) {
        // 将其他路线图设为非活跃
        roadmaps.update(null, Wrappers.<RoadmapPO>lambdaUpdate()
                .eq(RoadmapPO::getUserId, userId)
                .set(RoadmapPO::getActive, false));

        RoadmapPO roadmap = new RoadmapPO();
        roadmap.setId(idGenerator.nextId());
        roadmap.setUserId(userId);
        roadmap.setTargetRole("AI Engineer");
        roadmap.setWeeklyHours(10);
        roadmap.setActive(true);
        roadmap.setCreatedAt(Instant.now());
        roadmaps.insert(roadmap);

        String[][] taskData = {
                {"1", "Java 集合框架"},
                {"1", "并发编程基础"},
                {"1", "JVM 原理"},
                {"2", "Spring Boot 基础"},
                {"2", "Spring AI 集成"},
                {"3", "RAG 系统设计"},
        };
        for (String[] td : taskData) {
            RoadmapTaskPO task = new RoadmapTaskPO();
            task.setId(idGenerator.nextId());
            task.setRoadmapId(roadmap.getId());
            task.setWeek(Integer.parseInt(td[0]));
            task.setTitle(td[1]);
            task.setCompleted(false);
            roadmapTasks.insert(task);
        }
        return roadmap.getId();
    }

    private void createDemoExams(Long roadmapId) {
        createDemoExam(roadmapId, 1, "Java 基础测验", "检验 Java 集合与并发的掌握程度");
        createDemoExam(roadmapId, 2, "Spring Boot 测验", "检验 Spring Boot 与 AI 集成能力");
        createDemoExam(roadmapId, 3, "RAG 系统测验", "检验 RAG 系统设计能力");
    }

    private void createDemoExam(Long roadmapId, int week, String title, String description) {
        ExamPO exam = new ExamPO();
        exam.setId(idGenerator.nextId());
        exam.setRoadmapId(roadmapId);
        exam.setWeek(week);
        exam.setTitle(title);
        exam.setDescription(description);
        exam.setQuestionCount(3);
        exam.setTimeLimitMinutes(30);
        exam.setPassingScore(60);
        exam.setCreatedAt(Instant.now());
        exams.insert(exam);

        createDemoQuestion(exam.getId(), 1, "SINGLE_CHOICE",
                "ArrayList 与 LinkedList 的主要区别是什么？",
                List.of("A. ArrayList 基于数组，LinkedList 基于链表",
                        "B. ArrayList 线程安全，LinkedList 不安全",
                        "C. ArrayList 只能存储对象，LinkedList 可以存储基本类型",
                        "D. 没有区别"),
                "A", "ArrayList 基于动态数组，LinkedList 基于双向链表", 5);

        createDemoQuestion(exam.getId(), 2, "SINGLE_CHOICE",
                "HashMap 的默认负载因子是多少？",
                List.of("A. 0.5", "B. 0.65", "C. 0.75", "D. 1.0"),
                "C", "HashMap 默认负载因子是 0.75，是空间与时间的折中", 5);

        createDemoQuestion(exam.getId(), 3, "MULTI_CHOICE",
                "以下哪些是线程安全的集合类？",
                List.of("A. Vector", "B. Hashtable", "C. ConcurrentHashMap", "D. ArrayList"),
                "A,B,C", "Vector、Hashtable、ConcurrentHashMap 都是线程安全的", 10);

        createDemoQuestion(exam.getId(), 4, "THINKING",
                "请结合实际项目场景，分析在高并发环境下如何选择合适的集合类？请举例说明。",
                null, null, "1. 概念准确性：能区分线程安全与非线程安全集合\n2. 方案完整性：覆盖读多写少、写多读少等场景\n3. 代码示例质量：给出实际代码示例\n4. 最佳实践遵循：提及 ConcurrentHashMap、CopyOnWriteArrayList 等\n5. 创新性深度：考虑性能优化、锁粒度等", 10);
    }

    private void createDemoQuestion(Long examId, int order, String type, String content,
                                    List<String> options, String answer, String explanation, int xp) {
        ExamQuestionPO q = new ExamQuestionPO();
        q.setId(idGenerator.nextId());
        q.setExamId(examId);
        q.setQuestionType(type);
        q.setOrderNum(order);
        q.setContent(content);
        try {
            q.setOptions(options != null ? objectMapper.writeValueAsString(options) : null);
            q.setCorrectAnswer(answer != null ? objectMapper.writeValueAsString(answer) : null);
        } catch (Exception e) {
            q.setOptions("[]");
            q.setCorrectAnswer("\"\"");
        }
        q.setExplanation(explanation);
        q.setXpReward(xp);
        q.setCreatedAt(Instant.now());
        questions.insert(q);
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

        // 获取所有任务并按周分组
        List<RoadmapTaskPO> allTasks = roadmapTasks.selectList(Wrappers.<RoadmapTaskPO>lambdaQuery()
                .eq(RoadmapTaskPO::getRoadmapId, roadmapId)
                .orderByAsc(RoadmapTaskPO::getWeek));

        if (allTasks.isEmpty()) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "Roadmap has no tasks to generate exams from");
        }

        // 按周分组
        Map<Integer, List<RoadmapTaskPO>> tasksByWeek = new HashMap<>();
        for (RoadmapTaskPO task : allTasks) {
            tasksByWeek.computeIfAbsent(task.getWeek() != null ? task.getWeek() : 1, k -> new ArrayList<>()).add(task);
        }

        List<Exam> generated = new ArrayList<>();
        List<Integer> weeks = new ArrayList<>(tasksByWeek.keySet());
        Collections.sort(weeks);

        for (int week : weeks) {
            List<RoadmapTaskPO> weekTasks = tasksByWeek.get(week);
            String theme = weekTasks.get(0).getTitle();
            String goals = weekTasks.stream().map(RoadmapTaskPO::getTitle).collect(Collectors.joining(", "));

            Exam exam = generateSingleExam(roadmapId, week, theme, goals);
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

    @SuppressWarnings("unchecked")
    private Exam parseAndSaveExam(String response, Long roadmapId, int week) {
        try {
            String json = extractJson(response);
            Map<String, Object> data = (Map<String, Object>) objectMapper.readValue(json, Map.class);

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
            List<Map<String, Object>> questionList = parseQuestionList(data.get("questions"));
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

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> parseQuestionList(Object questionsObj) {
        if (questionsObj instanceof List) {
            return (List<Map<String, Object>>) questionsObj;
        }
        return List.of();
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

        Map<Long, ExamQuestionPO> questionMap = new HashMap<>();
        for (ExamQuestionPO q : questionList) {
            questionMap.put(q.getId(), q);
        }

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
                Map<String, Object> notTested = new HashMap<>();
                notTested.put("week", exam.getWeek());
                notTested.put("score", null);
                notTested.put("level", "NOT_TESTED");
                notTested.put("attempts", 0);
                notTested.put("best_score", null);
                notTested.put("last_exam_at", null);
                weekMastery.add(notTested);
            } else {
                int best = completed.stream().mapToInt(ExamRecordPO::getScore).max().orElse(0);
                totalScore += best;
                testedWeeks++;
                Map<String, Object> tested = new HashMap<>();
                tested.put("week", exam.getWeek());
                tested.put("score", best);
                tested.put("level", getMasteryLevel(best));
                tested.put("attempts", completed.size());
                tested.put("best_score", best);
                tested.put("last_exam_at", completed.get(0).getCompletedAt());
                weekMastery.add(tested);
            }
        }

        int overallScore = testedWeeks > 0 ? totalScore / testedWeeks : 0;
        Map<String, Object> result = new HashMap<>();
        result.put("overall_score", overallScore);
        result.put("overall_level", getMasteryLevel(overallScore));
        result.put("tested_weeks", testedWeeks);
        result.put("total_weeks", examList.size());
        result.put("week_mastery", weekMastery);
        return result;
    }

    // ========== AI 评分 ==========

    @SuppressWarnings("unchecked")
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
                Map<String, Object> result = (Map<String, Object>) objectMapper.readValue(extractJson(response), Map.class);

                int score = ((Number) result.getOrDefault("score", 5)).intValue();
                String feedback = (String) result.getOrDefault("feedback", "回答完成");
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
            // 正确答案可能是 "A"（单选字符串）或 "A,B,C"（多选用逗号分隔的字符串）
            String correct = objectMapper.readValue(correctAnswerJson, String.class);
            if (userAnswer instanceof String) {
                return correct.equalsIgnoreCase((String) userAnswer);
            } else if (userAnswer instanceof List) {
                // 多选：将逗号分隔的字符串拆分为集合，与用户答案比较
                Set<String> correctSet = new HashSet<>(Arrays.asList(correct.split(",")));
                Set<String> userSet = ((List<?>) userAnswer).stream()
                        .map(Object::toString).map(String::trim).collect(Collectors.toSet());
                return correctSet.equals(userSet);
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

    private List<AnswerDetail> parseAnswers(String answersJson) {
        if (answersJson == null || answersJson.isBlank()) return List.of();
        try {
            return objectMapper.readValue(answersJson,
                    objectMapper.getTypeFactory().constructCollectionType(List.class, AnswerDetail.class));
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
            List<?> list = objectMapper.readValue(json, List.class);
            if (list.isEmpty()) return List.of();
            // 兼容两种格式：
            // 1. 对象数组 [{"key":"A","content":"选项A"}, ...]
            // 2. 字符串数组 ["A. 选项A", "B. 选项B", ...]
            if (list.get(0) instanceof Map) {
                return list.stream()
                        .map(m -> (Map<String, Object>) m)
                        .map(m -> new QuestionOption((String) m.get("key"), (String) m.get("content")))
                        .toList();
            } else {
                return list.stream()
                        .map(String::valueOf)
                        .map(ExamService::parseOptionString)
                        .filter(java.util.Objects::nonNull)
                        .toList();
            }
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * 将 "A. 选项内容" 或 "A、选项内容" 解析为 QuestionOption。
     * 如果没有识别到选项字母前缀，则 key 为空字符串。
     */
    private static QuestionOption parseOptionString(String raw) {
        if (raw == null) return null;
        String trimmed = raw.trim();
        // 匹配 "A." "A、" "A)" "A]" 等选项前缀
        java.util.regex.Matcher matcher = java.util.regex.Pattern.compile("^([A-Z])[.、)\\]：:]\\s*(.+)$").matcher(trimmed);
        if (matcher.matches()) {
            return new QuestionOption(matcher.group(1), matcher.group(2));
        }
        // 无前缀时整体作为 content
        return new QuestionOption("", trimmed);
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
