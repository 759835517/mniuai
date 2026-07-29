package com.mniu.aicamp.quiz.application;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mniu.aicamp.quiz.infrastructure.mapper.ExamMapper;
import com.mniu.aicamp.quiz.infrastructure.mapper.ExamQuestionMapper;
import com.mniu.aicamp.quiz.infrastructure.po.ExamPO;
import com.mniu.aicamp.quiz.infrastructure.po.ExamQuestionPO;
import com.mniu.aicamp.roadmap.infrastructure.mapper.RoadmapMapper;
import com.mniu.aicamp.roadmap.infrastructure.mapper.RoadmapTaskMapper;
import com.mniu.aicamp.roadmap.infrastructure.po.RoadmapPO;
import com.mniu.aicamp.roadmap.infrastructure.po.RoadmapTaskPO;
import com.mniu.aicamp.shared.util.SnowflakeIdGenerator;
import com.mniu.aicamp.user.infrastructure.mapper.UserMapper;
import com.mniu.aicamp.user.infrastructure.po.UserPO;
import jakarta.annotation.PostConstruct;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;

/**
 * Seeds demo roadmap + exams for quiz module on first startup.
 * Picks the first existing user so demo data is visible to real accounts.
 */
@Component
@ConditionalOnProperty(name = "app.quiz.seed-enabled", havingValue = "true", matchIfMissing = true)
public class QuizDataSeeder {
    private final RoadmapMapper roadmaps;
    private final RoadmapTaskMapper tasks;
    private final ExamMapper exams;
    private final ExamQuestionMapper questions;
    private final SnowflakeIdGenerator idGenerator;
    private final ObjectMapper objectMapper;
    private final UserMapper users;

    public QuizDataSeeder(RoadmapMapper roadmaps, RoadmapTaskMapper tasks, ExamMapper exams,
                          ExamQuestionMapper questions, SnowflakeIdGenerator idGenerator,
                          ObjectMapper objectMapper, UserMapper users) {
        this.roadmaps = roadmaps;
        this.tasks = tasks;
        this.exams = exams;
        this.questions = questions;
        this.idGenerator = idGenerator;
        this.objectMapper = objectMapper;
        this.users = users;
    }

    @PostConstruct
    public void seed() {
        // Resolve an existing user to attach demo data to
        UserPO user = users.selectOne(Wrappers.<UserPO>lambdaQuery().orderByAsc(UserPO::getCreatedAt).last("LIMIT 1"));
        if (user == null) {
            return;
        }

        // Check if this user already has a roadmap
        Long existingRoadmapId = roadmaps.selectList(Wrappers.<RoadmapPO>lambdaQuery()
                        .eq(RoadmapPO::getUserId, user.getId()))
                .stream().findFirst().map(RoadmapPO::getId).orElse(null);

        Long roadmapId = existingRoadmapId;
        if (roadmapId == null) {
            roadmapId = createDemoRoadmap(user.getId());
        }

        // Only seed exams if this roadmap has none yet
        if (exams.selectCount(Wrappers.<ExamPO>lambdaQuery().eq(ExamPO::getRoadmapId, roadmapId)) != null
                && exams.selectCount(Wrappers.<ExamPO>lambdaQuery().eq(ExamPO::getRoadmapId, roadmapId)) > 0) {
            return;
        }

        createExams(roadmapId);
    }

    private Long createDemoRoadmap(Long userId) {
        RoadmapPO roadmap = new RoadmapPO();
        roadmap.setId(idGenerator.nextId());
        roadmap.setUserId(userId);
        roadmap.setTargetRole("AI Engineer");
        roadmap.setWeeklyHours(10);
        roadmap.setActive(true);
        roadmap.setCreatedAt(Instant.now());
        roadmaps.insert(roadmap);

        // Create roadmap tasks
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
            tasks.insert(task);
        }

        return roadmap.getId();
    }

    private void createExams(Long roadmapId) {
        // Create demo exams
        createExam(roadmapId, 1, "Java 基础测验", "检验 Java 集合与并发的掌握程度");
        createExam(roadmapId, 2, "Spring Boot 测验", "检验 Spring Boot 与 AI 集成能力");
        createExam(roadmapId, 3, "RAG 系统测验", "检验 RAG 系统设计能力");
    }

    private void createExam(Long roadmapId, int week, String title, String description) {
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

        // Create demo questions
        createQuestion(exam.getId(), 1, "SINGLE_CHOICE",
                "ArrayList 与 LinkedList 的主要区别是什么？",
                List.of("A. ArrayList 基于数组，LinkedList 基于链表",
                        "B. ArrayList 线程安全，LinkedList 不安全",
                        "C. ArrayList 只能存储对象，LinkedList 可以存储基本类型",
                        "D. 没有区别"),
                "A", "ArrayList 基于动态数组，LinkedList 基于双向链表", 5);

        createQuestion(exam.getId(), 2, "SINGLE_CHOICE",
                "HashMap 的默认负载因子是多少？",
                List.of("A. 0.5", "B. 0.65", "C. 0.75", "D. 1.0"),
                "C", "HashMap 默认负载因子是 0.75，是空间与时间的折中", 5);

        createQuestion(exam.getId(), 3, "MULTI_CHOICE",
                "以下哪些是线程安全的集合类？",
                List.of("A. Vector", "B. Hashtable", "C. ConcurrentHashMap", "D. ArrayList"),
                "A,B,C", "Vector、Hashtable、ConcurrentHashMap 都是线程安全的", 10);
    }

    private void createQuestion(Long examId, int order, String type, String content,
                                List<String> options, String answer, String explanation, int xp) {
        ExamQuestionPO q = new ExamQuestionPO();
        q.setId(idGenerator.nextId());
        q.setExamId(examId);
        q.setQuestionType(type);
        q.setOrderNum(order);
        q.setContent(content);
        try {
            q.setOptions(objectMapper.writeValueAsString(options));
            q.setCorrectAnswer(objectMapper.writeValueAsString(answer));
        } catch (Exception e) {
            q.setOptions("[]");
            q.setCorrectAnswer("\"\"");
        }
        q.setExplanation(explanation);
        q.setXpReward(xp);
        q.setCreatedAt(Instant.now());
        questions.insert(q);
    }
}
