package com.mniu.aicamp.course.application;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.mniu.aicamp.course.infrastructure.mapper.CourseMapper;
import com.mniu.aicamp.course.infrastructure.mapper.LessonMapper;
import com.mniu.aicamp.course.infrastructure.po.CoursePO;
import com.mniu.aicamp.course.infrastructure.po.LessonPO;
import com.mniu.aicamp.shared.util.SnowflakeIdGenerator;
import jakarta.annotation.PostConstruct;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.time.Instant;

/**
 * Seeds demo courses + lessons on first startup so the course center has content.
 */
@Component
@ConditionalOnProperty(name = "app.course.seed-enabled", havingValue = "true", matchIfMissing = true)
public class CourseDataSeeder {
    private final CourseMapper courses;
    private final LessonMapper lessons;
    private final SnowflakeIdGenerator idGenerator;

    public CourseDataSeeder(CourseMapper courses, LessonMapper lessons, SnowflakeIdGenerator idGenerator) {
        this.courses = courses;
        this.lessons = lessons;
        this.idGenerator = idGenerator;
    }

    @PostConstruct
    public void seed() {
        // 清空旧数据重新种子（确保课程+章节完整）
        lessons.delete(null);
        courses.delete(null);

        // 注意：category 必须与前端 PERSONA_CATEGORY_MAP 的 value 一致
        // engineer/kids/campus/teacher/creator/business
        // difficulty 使用中文：入门/进阶/高级（与前端 DIFFICULTIES 一致）

        // Course 1: AI 工程师面试训练营（程序员 - 进阶）
        Long course1 = createCourse("AI 工程师面试训练营",
                "从传统开发到 AI 工程师的系统学习路径，覆盖大模型、RAG、Agent 核心技能。",
                "engineer", "进阶", 1);
        createLesson(course1, "AI 工程师能力模型", "了解 AI 工程师的核心技能栈与职业发展路径。",
                "https://www.w3schools.com/html/mov_bbb.mp4", 600, true, 1);
        createLesson(course1, "大模型基础与 Prompt Engineering", "掌握 LLM 原理与高质量 Prompt 编写技巧。",
                "https://www.w3schools.com/html/mov_bbb.mp4", 900, false, 2);
        createLesson(course1, "RAG 系统实战", "构建检索增强生成系统，面试高频考点。",
                "https://www.w3schools.com/html/mov_bbb.mp4", 780, false, 3);

        // Course 2: 少儿 AI 编程竞赛班（少儿 - 入门）
        Long course2 = createCourse("少儿 AI 编程竞赛班",
                "专业教研团队设计，覆盖 NOI / 信息学竞赛全路径。",
                "kids", "入门", 2);
        createLesson(course2, "编程思维启蒙", "通过图形化编程培养逻辑思维能力。",
                "https://www.w3schools.com/html/mov_bbb.mp4", 800, true, 1);
        createLesson(course2, "Python 基础语法", "学习变量、循环、条件判断等基础语法。",
                "https://www.w3schools.com/html/mov_bbb.mp4", 720, false, 2);
        createLesson(course2, "算法入门", "排序、查找等基础算法与竞赛真题讲解。",
                "https://www.w3schools.com/html/mov_bbb.mp4", 1000, false, 3);

        // Course 3: 大学生零基础就业班（大学生 - 入门）
        Long course3 = createCourse("大学生零基础就业班",
                "零基础系统学习 AI 应用开发，保障就业。",
                "campus", "入门", 3);
        createLesson(course3, "编程零基础入门", "从零开始学习 Python，适合非计算机专业学生。",
                "https://www.w3schools.com/html/mov_bbb.mp4", 900, true, 1);
        createLesson(course3, "AI 应用开发基础", "使用 Spring AI 构建第一个 AI 应用。",
                "https://www.w3schools.com/html/mov_bbb.mp4", 1100, false, 2);
        createLesson(course3, "就业项目实战", "完成企业级项目，丰富简历。",
                "https://www.w3schools.com/html/mov_bbb.mp4", 1200, false, 3);

        // Course 4: 教师 AI 备课效率课（老师 - 入门）
        Long course4 = createCourse("教师 AI 备课效率课",
                "专为教师设计，快速上手 AI 备课、出题、批改全流程。",
                "teacher", "入门", 4);
        createLesson(course4, "AI 备课工具入门", "掌握 ChatGPT、文心一言等备课工具。",
                "https://www.w3schools.com/html/mov_bbb.mp4", 600, true, 1);
        createLesson(course4, "AI 出题与批改", "用 AI 自动生成试题、智能批改作业。",
                "https://www.w3schools.com/html/mov_bbb.mp4", 720, false, 2);
        createLesson(course4, "AI 课件制作", "用 AI 快速生成 PPT 与教学素材。",
                "https://www.w3schools.com/html/mov_bbb.mp4", 900, false, 3);

        // Course 5: 自媒体 AI 创作涨粉课（自媒体 - 入门）
        Long course5 = createCourse("自媒体 AI 创作涨粉课",
                "公众号/小红书/视频号运营者专属，用 AI 降低创作成本。",
                "creator", "入门", 5);
        createLesson(course5, "AI 文案创作", "用 AI 快速生成爆款标题与正文。",
                "https://www.w3schools.com/html/mov_bbb.mp4", 600, true, 1);
        createLesson(course5, "AI 图片与视频生成", "掌握 Midjourney、剪映等 AI 创作工具。",
                "https://www.w3schools.com/html/mov_bbb.mp4", 720, false, 2);
        createLesson(course5, "AI 数据分析与涨粉策略", "用 AI 分析数据，优化内容策略。",
                "https://www.w3schools.com/html/mov_bbb.mp4", 900, false, 3);

        // Course 6: RAG + Agent 实战开发（程序员 - 高级）
        Long course6 = createCourse("RAG + Agent 实战开发",
                "深入 RAG 和 Agent 技术栈，企业级 AI 应用开发。",
                "engineer", "高级", 6);
        createLesson(course6, "RAG 架构设计", "理解向量检索、Embedding、重排序等核心概念。",
                "https://www.w3schools.com/html/mov_bbb.mp4", 900, true, 1);
        createLesson(course6, "Function Calling 与 Agent", "构建能调用工具的 AI Agent。",
                "https://www.w3schools.com/html/mov_bbb.mp4", 1100, false, 2);
        createLesson(course6, "企业级 AI 应用部署", "生产环境部署、监控与优化。",
                "https://www.w3schools.com/html/mov_bbb.mp4", 1200, false, 3);

        // Course 7: 小老板 AI 获客引流课（小老板 - 入门）
        Long course7 = createCourse("小老板 AI 获客引流课",
                "实体店/服务业小老板专属，用 AI 做朋友圈文案、引流内容。",
                "business", "入门", 7);
        createLesson(course7, "AI 朋友圈文案", "用 AI 批量生成朋友圈营销文案。",
                "https://www.w3schools.com/html/mov_bbb.mp4", 600, true, 1);
        createLesson(course7, "AI 引流内容创作", "用 AI 生成短视频脚本与海报。",
                "https://www.w3schools.com/html/mov_bbb.mp4", 720, false, 2);
        createLesson(course7, "本地生活 AI 营销案例", "餐饮、美业等行业 AI 获客实战案例。",
                "https://www.w3schools.com/html/mov_bbb.mp4", 900, false, 3);

        // Course 8: AI 全栈实战项目营（程序员 - 进阶）
        Long course8 = createCourse("AI 全栈实战项目营",
                "全栈开发 + AI 应用，完成 3 个企业级项目。",
                "engineer", "进阶", 8);
        createLesson(course8, "全栈项目架构", "前后端 + AI 服务的整体架构设计。",
                "https://www.w3schools.com/html/mov_bbb.mp4", 900, true, 1);
        createLesson(course8, "项目实战 AI 客服系统", "构建一个完整的 AI 智能客服系统。",
                "https://www.w3schools.com/html/mov_bbb.mp4", 1100, false, 2);
        createLesson(course8, "项目实战 AI 写作助手", "构建一个 AI 内容创作平台。",
                "https://www.w3schools.com/html/mov_bbb.mp4", 1200, false, 3);
    }

    private Long createCourse(String title, String description, String category,
                              String difficulty, int sortOrder) {
        CoursePO po = new CoursePO();
        po.setId(idGenerator.nextId());
        po.setTitle(title);
        po.setDescription(description);
        po.setCoverUrl(null);
        po.setCategory(category);
        po.setDifficulty(difficulty);
        po.setTargetAudience("ALL");
        po.setTotalLessons(3);
        po.setTotalMinutes(45);
        po.setStatus("PUBLISHED");
        po.setSortOrder(sortOrder);
        po.setCreatedAt(Instant.now());
        courses.insert(po);
        return po.getId();
    }

    private void createLesson(Long courseId, String title, String description,
                              String videoUrl, int videoDuration, boolean free, int sortOrder) {
        LessonPO po = new LessonPO();
        po.setId(idGenerator.nextId());
        po.setCourseId(courseId);
        po.setTitle(title);
        po.setDescription(description);
        po.setVideoUrl(videoUrl);
        po.setVideoDuration(videoDuration);
        po.setThumbnailUrl(null);
        po.setSortOrder(sortOrder);
        po.setFree(free);
        po.setRequiresExamPass(false);
        po.setStatus("PUBLISHED");
        po.setCreatedAt(Instant.now());
        lessons.insert(po);
    }
}
