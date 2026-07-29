package com.mniu.aicamp.edu.application;

import com.mniu.aicamp.shared.ai.AiClientPort;
import com.mniu.aicamp.shared.util.SnowflakeIdGenerator;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class EduService {
    private final AiClientPort aiClient;
    private final SnowflakeIdGenerator idGenerator;

    public EduService(AiClientPort aiClient, SnowflakeIdGenerator idGenerator) {
        this.aiClient = aiClient;
        this.idGenerator = idGenerator;
    }

    /**
     * AI 生成教案
     */
    public String generateLesson(LessonRequest request) {
        String systemPrompt = """
                你是一位资深教师，擅长编写高质量教案。
                请根据以下信息生成一份完整的教案，包含以下模块：
                1. 教案标题
                2. 学情分析
                3. 教学目标（知识与技能、过程与方法、情感态度价值观）
                4. 教学重难点
                5. 教学方法
                6. 教学流程（导入→新授→练习→小结→作业）
                7. 板书设计
                8. 教学反思提示

                要求：
                - 内容专业、符合课程标准
                - 教学环节时间分配合理
                - 练习设计有层次性
                - 用 Markdown 格式输出
                """;

        String userPrompt = String.format("""
                【学科】%s
                【年级】%s
                【课题】%s
                【课时】%s
                【教材】%s
                【教学目标】%s
                """,
                request.subject(),
                request.grade(),
                request.topic(),
                request.duration() != null ? request.duration() : "45分钟",
                request.textbook() != null ? request.textbook() : "人教版",
                request.objective() != null ? request.objective() : "请根据课题自动推断"
        );

        return aiClient.chat(systemPrompt, userPrompt);
    }

    /**
     * AI 生成题目
     */
    public List<QuizQuestionDTO> generateQuiz(QuizRequest request) {
        String systemPrompt = """
                你是一位资深教师，擅长出题。
                请根据以下信息生成题目，每道题包含：
                - 题目内容
                - 选项（选择题）
                - 正确答案
                解析

                要求：
                - 题目覆盖知识点，难度适中
                - 选项有干扰性
                - 答案准确无误
                - 用 JSON 数组格式输出
                """;

        String userPrompt = String.format("""
                【学科】%s
                【年级】%s
                【知识点】%s
                【题型】%s
                【难度】%s
                【数量】%d
                """,
                request.subject(),
                request.grade(),
                request.knowledgePoint() != null ? request.knowledgePoint() : "综合",
                String.join(", ", request.questionTypes()),
                request.difficulty() != null ? request.difficulty() : "中等",
                request.count()
        );

        // 调用 AI 生成题目
        String aiResponse = aiClient.chat(systemPrompt, userPrompt);

        // 简化版：生成模拟题目
        List<QuizQuestionDTO> questions = new ArrayList<>();
        for (int i = 0; i < request.count(); i++) {
            questions.add(new QuizQuestionDTO(
                    idGenerator.nextId(),
                    request.questionTypes().get(i % request.questionTypes().size()),
                    String.format("第%d道%s题（%s年级%s）", i + 1, request.subject(), request.grade(), request.questionTypes().get(i % request.questionTypes().size())),
                    List.of("选项A", "选项B", "选项C", "选项D"),
                    "A",
                     String.format("这是一道关于%s的%s题，正确答案是A。", request.knowledgePoint() != null ? request.knowledgePoint() : "综合知识点", request.questionTypes().get(i % request.questionTypes().size())),
                    request.difficulty() != null ? request.difficulty() : "中等",
                    request.knowledgePoint()
            ));
        }
        return questions;
    }

    /**
     * AI 生成课件
     */
    public SlidesDTO generateSlides(SlidesRequest request) {
        String systemPrompt = """
                你是一位资深教师，擅长制作课件。
                请根据以下信息生成课件结构，包含：
                - 每页标题
                - 每页内容要点
                - 教师备注

                要求：
                - 结构清晰，逻辑连贯
                - 每页内容适量，适合课堂展示
                - 用 JSON 格式输出
                """;

        String userPrompt = String.format("""
                【学科】%s
                【年级】%s
                【课题】%s
                【课时】%s
                【风格】%s
                """,
                request.subject(),
                request.grade(),
                request.topic(),
                request.duration() != null ? request.duration() : "45分钟",
                request.style() != null ? request.style() : "简约"
        );

        // 简化版：生成模拟课件
        List<SlidesDTO.SlideItemDTO> slides = List.of(
                new SlidesDTO.SlideItemDTO(1, request.topic(), "课程导入\n• 复习上节课内容\n• 引入新课题", "用5分钟导入"),
                new SlidesDTO.SlideItemDTO(2, "知识讲解", "核心知识点\n• 概念定义\n• 重点难点\n• 典型例题", "重点讲解概念"),
                new SlidesDTO.SlideItemDTO(3, "课堂练习", "练习题\n• 基础题2道\n• 提高题1道", "学生练习，教师巡视"),
                new SlidesDTO.SlideItemDTO(4, "课堂小结", "本节要点\n• 知识回顾\n• 布置作业", "总结提升")
        );

        return new SlidesDTO(
                idGenerator.nextId(),
                request.subject(),
                request.grade(),
                request.topic(),
                slides,
                Instant.now()
        );
    }

    /**
     * AI 批改（简化版）
     */
    public GradeResultDTO gradeSubmission(GradeRequest request) {
        String systemPrompt = """
                你是一位资深教师，擅长批改作业。
                请根据以下信息批改作业，给出评分和反馈。

                要求：
                - 评分客观公正
                - 反馈具体、有建设性
                - 用 JSON 格式输出
                """;

        String userPrompt = String.format("""
                【学科】%s
                【题目】%s
                【学生答案】%s
                【参考答案】%s
                """,
                request.subject(),
                request.question(),
                request.studentAnswer(),
                request.standardAnswer() != null ? request.standardAnswer() : "无参考答案"
        );

        // 简化版：返回模拟批改结果
        return new GradeResultDTO(
                idGenerator.nextId(),
                request.subject(),
                85,
                List.of(
                        new GradeResultDTO.GradeItemDTO(1, 10, 10, "第一题回答正确，思路清晰", 0.95),
                        new GradeResultDTO.GradeItemDTO(2, 8, 10, "第二题基本正确，但步骤不够完整", 0.85),
                        new GradeResultDTO.GradeItemDTO(3, 7, 10, "第三题有部分错误，建议复习相关知识点", 0.75)
                ),
                Instant.now()
        );
    }

    /**
     * 获取使用统计
     */
    public UsageStatsDTO getUsageStats(Long userId) {
        // 简化版：返回模拟数据
        return new UsageStatsDTO(
                25,  // totalUsage
                10,  // lessonCount
                8,   // quizCount
                3,   // gradeCount
                4,   // slidesCount
                15,  // streakDays
                50   // guaranteeProgress (百分比)
        );
    }

    /**
     * 检查对赌达成情况
     */
    public GuaranteeCheckDTO checkGuarantee(Long userId) {
        // 简化版：返回模拟数据
        List<String> gaps = new ArrayList<>();
        int totalUsage = 25;
        int daysUsed = 15;
        int toolsUsed = 3;

        if (totalUsage < 50) {
            gaps.add(String.format("还需使用 %d 次（当前 %d/50）", 50 - totalUsage, totalUsage));
        }
        if (daysUsed < 30) {
            gaps.add(String.format("还需使用 %d 天（当前 %d/30）", 30 - daysUsed, daysUsed));
        }
        if (toolsUsed < 3) {
            gaps.add(String.format("还需使用 %d 个工具（当前 %d/3）", 3 - toolsUsed, toolsUsed));
        }

        return new GuaranteeCheckDTO(
                totalUsage,
                50,
                daysUsed,
                30,
                toolsUsed,
                3,
                gaps.isEmpty(),
                gaps
        );
    }
}
