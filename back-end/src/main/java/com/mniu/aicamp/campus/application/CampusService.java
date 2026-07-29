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

    public CampusService(LearningPathMapper learningPathMapper,
                         PathCourseMapper pathCourseMapper,
                         PathEnrollmentMapper pathEnrollmentMapper,
                         CourseMapper courseMapper,
                         LessonMapper lessonMapper,
                         PracticeProblemMapper practiceProblemMapper,
                         CodeSubmissionMapper codeSubmissionMapper,
                         GuaranteeProgressMapper guaranteeProgressMapper,
                         SnowflakeIdGenerator idGenerator) {
        this.learningPathMapper = learningPathMapper;
        this.pathCourseMapper = pathCourseMapper;
        this.pathEnrollmentMapper = pathEnrollmentMapper;
        this.courseMapper = courseMapper;
        this.lessonMapper = lessonMapper;
        this.practiceProblemMapper = practiceProblemMapper;
        this.codeSubmissionMapper = codeSubmissionMapper;
        this.guaranteeProgressMapper = guaranteeProgressMapper;
        this.idGenerator = idGenerator;
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
