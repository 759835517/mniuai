package com.mniu.aicamp.campus.application;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.mniu.aicamp.campus.infrastructure.mapper.CodeSubmissionMapper;
import com.mniu.aicamp.campus.infrastructure.mapper.GuaranteeProgressMapper;
import com.mniu.aicamp.campus.infrastructure.mapper.LearningPathMapper;
import com.mniu.aicamp.campus.infrastructure.mapper.PathCourseMapper;
import com.mniu.aicamp.campus.infrastructure.mapper.PathEnrollmentMapper;
import com.mniu.aicamp.campus.infrastructure.mapper.PracticeProblemMapper;
import com.mniu.aicamp.campus.infrastructure.po.CodeSubmissionPO;
import com.mniu.aicamp.campus.infrastructure.po.GuaranteeProgressPO;
import com.mniu.aicamp.campus.infrastructure.po.LearningPathPO;
import com.mniu.aicamp.campus.infrastructure.po.PathCoursePO;
import com.mniu.aicamp.campus.infrastructure.po.PathEnrollmentPO;
import com.mniu.aicamp.campus.infrastructure.po.PracticeProblemPO;
import com.mniu.aicamp.course.infrastructure.mapper.CourseMapper;
import com.mniu.aicamp.course.infrastructure.mapper.LessonMapper;
import com.mniu.aicamp.course.infrastructure.po.CoursePO;
import com.mniu.aicamp.course.infrastructure.po.LessonPO;
import com.mniu.aicamp.shared.ai.AiClientPort;
import com.mniu.aicamp.shared.util.SnowflakeIdGenerator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class CampusService {
    private final LearningPathMapper learningPathMapper;
    private final PathCourseMapper pathCourseMapper;
    private final PathEnrollmentMapper pathEnrollmentMapper;
    private final CourseMapper courseMapper;
    private final LessonMapper lessonMapper;
    private final PracticeProblemMapper practiceProblemMapper;
    private final CodeSubmissionMapper codeSubmissionMapper;
    private final GuaranteeProgressMapper guaranteeProgressMapper;
    private final SnowflakeIdGenerator idGenerator;
    private final AiClientPort aiClient;

    public CampusService(LearningPathMapper learningPathMapper,
                         PathCourseMapper pathCourseMapper,
                         PathEnrollmentMapper pathEnrollmentMapper,
                         CourseMapper courseMapper,
                         LessonMapper lessonMapper,
                         PracticeProblemMapper practiceProblemMapper,
                         CodeSubmissionMapper codeSubmissionMapper,
                         GuaranteeProgressMapper guaranteeProgressMapper,
                         SnowflakeIdGenerator idGenerator,
                         AiClientPort aiClient) {
        this.learningPathMapper = learningPathMapper;
        this.pathCourseMapper = pathCourseMapper;
        this.pathEnrollmentMapper = pathEnrollmentMapper;
        this.courseMapper = courseMapper;
        this.lessonMapper = lessonMapper;
        this.practiceProblemMapper = practiceProblemMapper;
        this.codeSubmissionMapper = codeSubmissionMapper;
        this.guaranteeProgressMapper = guaranteeProgressMapper;
        this.idGenerator = idGenerator;
        this.aiClient = aiClient;
    }

    /**
     * 查询所有已发布的学习路径
     */
    public List<LearningPathDTO> listPaths() {
        return learningPathMapper.selectList(Wrappers.<LearningPathPO>lambdaQuery()
                        .eq(LearningPathPO::getStatus, "PUBLISHED")
                        .orderByAsc(LearningPathPO::getSortOrder))
                .stream()
                .map(po -> new LearningPathDTO(po.getId(), po.getSlug(), po.getName(),
                        po.getDescription(), po.getIcon(), po.getDurationWeeks(),
                        po.getLevelFrom(), po.getLevelTo(), po.getSortOrder()))
                .toList();
    }

    /**
     * 查询学习路径详情（含课程列表）
     */
    public PathDetailDTO getPathDetail(String slug, Long currentUserId) {
        LearningPathPO path = learningPathMapper.selectOne(Wrappers.<LearningPathPO>lambdaQuery()
                .eq(LearningPathPO::getSlug, slug)
                .eq(LearningPathPO::getStatus, "PUBLISHED"));
        if (path == null) return null;

        // 查询路径关联的课程
        List<PathCoursePO> pathCourses = pathCourseMapper.selectList(
                Wrappers.<PathCoursePO>lambdaQuery()
                        .eq(PathCoursePO::getPathId, path.getId())
                        .orderByAsc(PathCoursePO::getSortOrder));

        List<CourseSummaryDTO> courses = pathCourses.stream().map(pc -> {
            CoursePO course = courseMapper.selectById(pc.getCourseId());
            if (course == null) return null;
            return new CourseSummaryDTO(course.getId(), course.getTitle(), course.getDescription(),
                    course.getCategory(), course.getDifficulty(), course.getTotalLessons(),
                    course.getTotalMinutes(), pc.getSortOrder(), pc.getRequired());
        }).filter(c -> c != null).toList();

        // 检查当前用户是否已报名
        Boolean enrolled = false;
        Double progressPct = 0.0;
        if (currentUserId != null) {
            PathEnrollmentPO enrollment = pathEnrollmentMapper.selectOne(
                    Wrappers.<PathEnrollmentPO>lambdaQuery()
                            .eq(PathEnrollmentPO::getUserId, currentUserId)
                            .eq(PathEnrollmentPO::getPathId, path.getId()));
            enrolled = enrollment != null;
            if (enrolled) {
                progressPct = calculateProgress(currentUserId, path.getId(), courses);
            }
        }

        return new PathDetailDTO(path.getId(), path.getSlug(), path.getName(),
                path.getDescription(), path.getIcon(), path.getDurationWeeks(),
                path.getLevelFrom(), path.getLevelTo(), courses, enrolled, progressPct);
    }

    /**
     * 报名学习路径
     */
    @Transactional
    public PathEnrollmentPO enrollPath(Long userId, String slug) {
        LearningPathPO path = learningPathMapper.selectOne(Wrappers.<LearningPathPO>lambdaQuery()
                .eq(LearningPathPO::getSlug, slug)
                .eq(LearningPathPO::getStatus, "PUBLISHED"));
        if (path == null) throw new IllegalArgumentException("学习路径不存在");

        // 检查是否已报名
        PathEnrollmentPO existing = pathEnrollmentMapper.selectOne(
                Wrappers.<PathEnrollmentPO>lambdaQuery()
                        .eq(PathEnrollmentPO::getUserId, userId)
                        .eq(PathEnrollmentPO::getPathId, path.getId()));
        if (existing != null) return existing;

        PathEnrollmentPO enrollment = new PathEnrollmentPO();
        enrollment.setId(idGenerator.nextId());
        enrollment.setUserId(userId);
        enrollment.setPathId(path.getId());
        enrollment.setEnrolledAt(Instant.now());
        pathEnrollmentMapper.insert(enrollment);
        return enrollment;
    }

    /**
     * 查询课程的所有课时
     */
    public List<LessonDTO> listLessons(Long courseId, Long currentUserId) {
        List<LessonPO> lessons = lessonMapper.selectList(Wrappers.<LessonPO>lambdaQuery()
                .eq(LessonPO::getCourseId, courseId)
                .eq(LessonPO::getStatus, "PUBLISHED")
                .orderByAsc(LessonPO::getSortOrder));

        return lessons.stream().map(po -> new LessonDTO(
                po.getId(), po.getCourseId(), po.getTitle(), po.getDescription(),
                po.getVideoUrl(), po.getVideoDuration(), po.getThumbnailUrl(),
                po.getSortOrder(), po.getFree(),
                // 未登录用户无进度
                null, false, 0.0
        )).toList();
    }

    /**
     * 编程练习题目列表
     */
    public List<PracticeProblemDTO> listProblems(String difficulty, String category) {
        return practiceProblemMapper.selectList(Wrappers.<PracticeProblemPO>lambdaQuery()
                        .eq(PracticeProblemPO::getStatus, "PUBLISHED")
                        .eq(difficulty != null && !difficulty.isBlank(), PracticeProblemPO::getDifficulty, difficulty)
                        .eq(category != null && !category.isBlank(), PracticeProblemPO::getCategory, category)
                        .orderByAsc(PracticeProblemPO::getSortOrder))
                .stream()
                .map(po -> new PracticeProblemDTO(po.getId(), po.getSlug(), po.getTitle(),
                        po.getDescription(), po.getDifficulty(), po.getCategory(), po.getTags(),
                        po.getStarterCode(), po.getTimeLimitSec(), po.getMemoryLimitMb()))
                .toList();
    }

    /**
     * 提交代码（简化版：直接返回通过状态，后续接入沙盒）
     */
    @Transactional
    public CodeSubmissionDTO submitCode(Long userId, CodeSubmitRequest request) {
        PracticeProblemPO problem = practiceProblemMapper.selectById(request.problemId());
        if (problem == null) {
            throw new IllegalArgumentException("题目不存在");
        }

        // 简化版：模拟代码评测（实际应调用沙盒执行）
        // TODO: 接入 Judge0 沙盒
        CodeSubmissionPO submission = new CodeSubmissionPO();
        submission.setId(idGenerator.nextId());
        submission.setUserId(userId);
        submission.setProblemId(request.problemId());
        submission.setLanguage(request.language());
        submission.setSourceCode(request.sourceCode());
        submission.setStatus("ACCEPTED");
        submission.setPassedCount(5);
        submission.setTotalCount(5);
        submission.setRuntimeMs(120);
        submission.setMemoryKb(8192);
        submission.setSubmittedAt(Instant.now());
        codeSubmissionMapper.insert(submission);

        return new CodeSubmissionDTO(submission.getId(), submission.getProblemId(),
                submission.getLanguage(), submission.getStatus(),
                submission.getPassedCount(), submission.getTotalCount(),
                submission.getRuntimeMs(), submission.getMemoryKb());
    }

    /**
     * 学习进度总览（当前用户所有已报名路径的进度）
     */
    public List<ProgressDTO> getUserProgress(Long userId) {
        List<PathEnrollmentPO> enrollments = pathEnrollmentMapper.selectList(
                Wrappers.<PathEnrollmentPO>lambdaQuery()
                        .eq(PathEnrollmentPO::getUserId, userId));

        return enrollments.stream().map(enrollment -> {
            LearningPathPO path = learningPathMapper.selectById(enrollment.getPathId());
            if (path == null) return null;

            // 查询对赌进度（包含练习、面试等数据）
            GuaranteeProgressPO gp = guaranteeProgressMapper.selectOne(
                    Wrappers.<GuaranteeProgressPO>lambdaQuery()
                            .eq(GuaranteeProgressPO::getUserId, userId)
                            .eq(GuaranteeProgressPO::getPathId, enrollment.getPathId()));

            double coursePct = gp != null && gp.getCourseCompletionPct() != null
                    ? gp.getCourseCompletionPct().doubleValue() : 0.0;
            int practiceCompleted = gp != null && gp.getPracticeCompleted() != null ? gp.getPracticeCompleted() : 0;
            int practicePassed = gp != null && gp.getPracticePassed() != null ? gp.getPracticePassed() : 0;
            int interviewRounds = gp != null && gp.getInterviewRounds() != null ? gp.getInterviewRounds() : 0;
            boolean resumeGenerated = gp != null && gp.getResumeGenerated() != null && gp.getResumeGenerated();

            return new ProgressDTO(path.getId(), path.getName(), coursePct,
                    practiceCompleted, practicePassed, interviewRounds, resumeGenerated, true);
        }).filter(dto -> dto != null).toList();
    }

    /**
     * 对赌进度详情
     */
    public GuaranteeProgressDTO getGuaranteeProgress(Long userId, String slug) {
        LearningPathPO path = learningPathMapper.selectOne(Wrappers.<LearningPathPO>lambdaQuery()
                .eq(LearningPathPO::getSlug, slug));
        if (path == null) return null;

        GuaranteeProgressPO gp = guaranteeProgressMapper.selectOne(
                Wrappers.<GuaranteeProgressPO>lambdaQuery()
                        .eq(GuaranteeProgressPO::getUserId, userId)
                        .eq(GuaranteeProgressPO::getPathId, path.getId()));

        double coursePct = gp != null && gp.getCourseCompletionPct() != null
                ? gp.getCourseCompletionPct().doubleValue() : 0.0;
        int practiceCompleted = gp != null && gp.getPracticeCompleted() != null ? gp.getPracticeCompleted() : 0;
        int practicePassed = gp != null && gp.getPracticePassed() != null ? gp.getPracticePassed() : 0;
        int interviewRounds = gp != null && gp.getInterviewRounds() != null ? gp.getInterviewRounds() : 0;
        boolean resumeGenerated = gp != null && gp.getResumeGenerated() != null && gp.getResumeGenerated();

        // 计算总体完成率（5 个维度平均）
        double courseProgress = Math.min(coursePct / 80.0, 1.0) * 100;
        double practiceProgress = Math.min(practicePassed / 120.0, 1.0) * 100;
        double interviewProgress = Math.min(interviewRounds / 10.0, 1.0) * 100;
        double resumeProgress = resumeGenerated ? 100.0 : 0.0;
        double overallPct = (courseProgress + practiceProgress + interviewProgress + resumeProgress) / 4.0;

        boolean allMet = coursePct >= 80.0 && practicePassed >= 120 && interviewRounds >= 10 && resumeGenerated;

        return new GuaranteeProgressDTO(path.getId(), path.getName(), coursePct,
                practiceCompleted, practicePassed, interviewRounds, resumeGenerated,
                Math.round(overallPct * 100.0) / 100.0, allMet);
    }

    /**
     * AI 助教对话
     */
    public AiTutorResponse chatWithTutor(Long userId, AiTutorRequest request) {
        // 构建 system prompt
        String systemPrompt = """
                你是一位专业的编程学习助教，擅长帮助大学生解决编程学习中的问题。
                请用简体中文回答，语气亲切、耐心，给出具体可行的建议。
                如果用户提供了代码，请分析代码问题并给出改进建议。
                回答应包含：1. 直接回答问题 2. 推荐的下一步行动 3. 相关知识点
                """;

        // 构建 user prompt（包含上下文）
        StringBuilder userPrompt = new StringBuilder();
        if (request.lessonId() != null) {
            LessonPO lesson = lessonMapper.selectById(request.lessonId());
            if (lesson != null) {
                userPrompt.append("【当前课时】").append(lesson.getTitle()).append("\n");
                if (lesson.getDescription() != null) {
                    userPrompt.append("【课时内容】").append(lesson.getDescription()).append("\n");
                }
            }
        }
        if (request.code() != null && !request.code().isBlank()) {
            userPrompt.append("【用户代码】\n").append(request.code()).append("\n");
        }
        userPrompt.append("【用户问题】").append(request.message());

        // 调用 AI
        String aiReply = aiClient.chat(systemPrompt, userPrompt.toString());

        // 解析 AI 回复（简化版：将整个回复作为 reply）
        // TODO: 后续可让 AI 返回结构化 JSON
        return new AiTutorResponse(
                aiReply,
                "继续练习相关题目",
                List.of("基础语法", "代码调试")
        );
    }

    /**
     * 获取用户作品集
     */
    public PortfolioDTO getPortfolio(Long userId) {
        // 获取用户学习进度
        List<ProgressDTO> progressList = getUserProgress(userId);

        // 获取对赌进度（包含练习、面试等数据）
        int totalPracticePassed = 0;
        int totalInterviewRounds = 0;
        String pathName = "全栈工程师路径";
        for (ProgressDTO p : progressList) {
            totalPracticePassed += p.practicePassed();
            totalInterviewRounds += p.interviewRounds();
            pathName = p.pathName();
        }

        // 构建技能列表（基于学习路径）
        List<String> skills = List.of("Java", "Spring Boot", "React", "MySQL", "Redis", "Docker");

        // 构建项目列表（简化版，后续可从 project 模块获取）
        List<PortfolioDTO.ProjectItemDTO> projects = List.of(
                new PortfolioDTO.ProjectItemDTO(
                        1L, "校园二手交易平台",
                        "React+Spring Boot全栈项目，实现商品发布、搜索、IM聊天、安全支付",
                        List.of("React", "Spring Boot", "WebSocket", "Alipay SDK"),
                        "https://github.com/example/market", "https://market.example.com"
                ),
                new PortfolioDTO.ProjectItemDTO(
                        2L, "AI简历分析助手",
                        "接入Qwen大模型，解析简历PDF，生成岗位匹配分析报告",
                        List.of("Next.js", "Python FastAPI", "Qwen API"),
                        "https://github.com/example/resume-ai", "https://resume.example.com"
                )
        );

        return new PortfolioDTO(
                userId,
                "学员_" + userId,
                "某二本 计算机专业",
                "L4 全栈工程师",
                pathName,
                "热爱编程，擅长React+Spring Boot全栈开发，寻找2026届实习/校招机会",
                skills,
                projects,
                new PortfolioDTO.PortfolioStatsDTO(totalPracticePassed, totalInterviewRounds, 12, 87)
        );
    }

    /**
     * AI 生成简历
     */
    public ResumeResponse generateResume(Long userId, ResumeRequest request) {
        // 构建 system prompt
        String systemPrompt = """
                你是一名专业的简历优化顾问，擅长帮助大学生撰写技术岗位简历。
                请根据用户提供的信息，生成一份专业的 Markdown 格式简历。
                要求：
                1. 使用 STAR 原则描述项目经历
                2. 量化成果（如性能提升 X%、用户数 Y 万）
                3. 技能栈分类清晰
                4. 语言简洁专业，适合技术岗位投递
                5. 输出纯 Markdown 格式
                """;

        // 构建 user prompt
        StringBuilder userPrompt = new StringBuilder();
        userPrompt.append("【基本信息】\n");
        userPrompt.append("姓名：").append(request.name()).append("\n");
        if (request.school() != null) userPrompt.append("学校：").append(request.school()).append("\n");
        if (request.major() != null) userPrompt.append("专业：").append(request.major()).append("\n");
        if (request.graduationDate() != null) userPrompt.append("毕业时间：").append(request.graduationDate()).append("\n");
        if (request.email() != null) userPrompt.append("邮箱：").append(request.email()).append("\n");
        if (request.phone() != null) userPrompt.append("手机：").append(request.phone()).append("\n");
        if (request.github() != null) userPrompt.append("GitHub：").append(request.github()).append("\n");
        if (request.bio() != null) userPrompt.append("个人简介：").append(request.bio()).append("\n");

        if (request.skills() != null && !request.skills().isEmpty()) {
            userPrompt.append("\n【技能清单】\n");
            userPrompt.append(String.join(", ", request.skills())).append("\n");
        }

        if (request.projects() != null && !request.projects().isEmpty()) {
            userPrompt.append("\n【项目经历】\n");
            for (ResumeRequest.ProjectExperience proj : request.projects()) {
                userPrompt.append("- ").append(proj.name());
                if (proj.role() != null) userPrompt.append("（角色：").append(proj.role()).append("）");
                userPrompt.append("\n");
                if (proj.description() != null) userPrompt.append("  ").append(proj.description()).append("\n");
                if (proj.techStack() != null) userPrompt.append("  技术栈：").append(String.join(", ", proj.techStack())).append("\n");
            }
        }

        if (request.experiences() != null && !request.experiences().isEmpty()) {
            userPrompt.append("\n【实习/工作经历】\n");
            for (String exp : request.experiences()) {
                userPrompt.append("- ").append(exp).append("\n");
            }
        }

        // 调用 AI 生成简历
        String resumeMarkdown = aiClient.chat(systemPrompt, userPrompt.toString());

        // 构建响应
        return new ResumeResponse(
                resumeMarkdown,
                List.of(
                        new ResumeResponse.ResumeSection("基本信息", request.name() + (request.school() != null ? " | " + request.school() : "")),
                        new ResumeResponse.ResumeSection("技能清单", request.skills() != null ? String.join(", ", request.skills()) : ""),
                        new ResumeResponse.ResumeSection("项目经历", request.projects() != null ? request.projects().size() + " 个项目" : "暂无")
                )
        );
    }

    /**
     * 获取订阅计划列表
     */
    public List<SubscriptionPlanDTO> listSubscriptionPlans() {
        return List.of(
                new SubscriptionPlanDTO("free", "免费体验", "¥0", "7天", false, null,
                        List.of("学习路径预览", "前10节课程免费", "每日3道练习题", "AI助教基础提示", "社区讨论")),
                new SubscriptionPlanDTO("monthly", "月度订阅", "¥299", "/ 月", false, null,
                        List.of("全部视频课程", "无限编程练习", "AI面试官（每月10次）", "AI助教无限次", "作品集托管", "简历生成器")),
                new SubscriptionPlanDTO("guarantee", "就业保障版", "¥3,999", "全期", true, "推荐",
                        List.of("全部月度订阅功能", "AI面试官无限次", "1v1职业规划咨询（3次）", "简历专属优化", "内推资源对接", "6个月未就业全额退款", "就业数据跟踪报告")),
                new SubscriptionPlanDTO("school", "高校/企业版", "联系我们", "", false, null,
                        List.of("班级管理后台", "学员进度看板", "定制课程内容", "专属企业项目实训", "批量席位管理", "API集成支持"))
        );
    }

    /**
     * 申请对赌协议
     */
    @Transactional
    public GuaranteeApplicationDTO applyForGuarantee(Long userId, GuaranteeApplicationRequest request) {
        LearningPathPO path = learningPathMapper.selectOne(Wrappers.<LearningPathPO>lambdaQuery()
                .eq(LearningPathPO::getSlug, request.pathSlug()));
        if (path == null) {
            throw new IllegalArgumentException("学习路径不存在");
        }

        // 检查是否已报名该路径
        PathEnrollmentPO enrollment = pathEnrollmentMapper.selectOne(
                Wrappers.<PathEnrollmentPO>lambdaQuery()
                        .eq(PathEnrollmentPO::getUserId, userId)
                        .eq(PathEnrollmentPO::getPathId, path.getId()));
        if (enrollment == null) {
            throw new IllegalArgumentException("请先报名学习路径");
        }

        // 创建对赌申请（简化版，实际应存储到 guarantee_application 表）
        Instant now = Instant.now();
        Instant expiresAt = now.plusSeconds(180L * 24 * 60 * 60); // 6个月

        return new GuaranteeApplicationDTO(
                idGenerator.nextId(),
                userId,
                request.pathSlug(),
                path.getName(),
                "ACTIVE",
                request.agreementVersion() != null ? request.agreementVersion() : "v1.0",
                now,
                expiresAt
        );
    }

    /**
     * 就业上报
     */
    public EmploymentReportDTO reportEmployment(Long userId, EmploymentReportRequest request) {
        Instant now = Instant.now();
        // 简化版：实际应存储到 employment_report 表
        return new EmploymentReportDTO(
                idGenerator.nextId(),
                userId,
                request.companyName(),
                request.position(),
                request.salary(),
                request.offerDate(),
                request.offerImageUrl(),
                request.jobType(),
                "PENDING_REVIEW",
                now
        );
    }

    /**
     * 计算学习进度百分比
     */
    private Double calculateProgress(Long userId, Long pathId, List<CourseSummaryDTO> courses) {
        if (courses.isEmpty()) return 0.0;
        // 简化：按课程数平均计算（后续可按课时细化）
        int totalCourses = courses.size();
        int completedCourses = 0;
        for (CourseSummaryDTO course : courses) {
            // 课程完成判断：所有课时 video_progress.completed = true
            long totalLessons = lessonMapper.selectCount(Wrappers.<LessonPO>lambdaQuery()
                    .eq(LessonPO::getCourseId, course.id())
                    .eq(LessonPO::getStatus, "PUBLISHED"));
            if (totalLessons == 0) {
                completedCourses++;
                continue;
            }
            // 简化处理：暂时按课程数计算
            completedCourses++;
        }
        return Math.round((double) completedCourses / totalCourses * 10000.0) / 100.0;
    }
}
