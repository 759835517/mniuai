package com.mniu.aicamp.course.application;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.mniu.aicamp.course.infrastructure.mapper.CourseEnrollmentMapper;
import com.mniu.aicamp.course.infrastructure.mapper.CourseMapper;
import com.mniu.aicamp.course.infrastructure.mapper.LessonMapper;
import com.mniu.aicamp.course.infrastructure.po.CourseEnrollmentPO;
import com.mniu.aicamp.course.infrastructure.po.CoursePO;
import com.mniu.aicamp.course.infrastructure.po.LessonPO;
import com.mniu.aicamp.shared.api.ErrorCode;
import com.mniu.aicamp.shared.api.PageResponse;
import com.mniu.aicamp.shared.exception.BusinessException;
import com.mniu.aicamp.shared.util.SnowflakeIdGenerator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
public class CourseService {
    private final CourseMapper courses;
    private final LessonMapper lessons;
    private final CourseEnrollmentMapper enrollments;
    private final SnowflakeIdGenerator idGenerator;

    public CourseService(CourseMapper courses, LessonMapper lessons,
                         CourseEnrollmentMapper enrollments, SnowflakeIdGenerator idGenerator) {
        this.courses = courses;
        this.lessons = lessons;
        this.enrollments = enrollments;
        this.idGenerator = idGenerator;
    }

    // ========== 用户端 ==========

    public PageResponse<CourseSummary> listCourses(String category, String difficulty, int page, int size) {
        List<CoursePO> all = courses.selectList(Wrappers.<CoursePO>lambdaQuery()
                .eq(CoursePO::getStatus, "PUBLISHED")
                .eq(category != null, CoursePO::getCategory, category)
                .eq(difficulty != null, CoursePO::getDifficulty, difficulty)
                .orderByAsc(CoursePO::getSortOrder));
        List<CourseSummary> summaries = all.stream().map(po ->
                new CourseSummary(po.getId(), po.getTitle(), po.getCoverUrl(), po.getCategory(),
                        po.getDifficulty(), po.getTotalLessons(), po.getTotalMinutes(), false, 0)).toList();
        return PageResponse.of(summaries, page, size);
    }

    public CourseDetail getCourse(Long userId, Long courseId) {
        CoursePO po = courses.selectById(courseId);
        if (po == null) {
            throw new BusinessException(ErrorCode.COURSE_NOT_FOUND, "Course not found");
        }
        boolean enrolled = isEnrolled(userId, courseId);
        List<LessonPO> lessonList = lessons.selectList(Wrappers.<LessonPO>lambdaQuery()
                .eq(LessonPO::getCourseId, courseId)
                .eq(LessonPO::getStatus, "PUBLISHED")
                .orderByAsc(LessonPO::getSortOrder));
        return toCourseDetail(po, enrolled, lessonList, userId);
    }

    @Transactional
    public void enroll(Long userId, Long courseId) {
        CoursePO po = courses.selectById(courseId);
        if (po == null) {
            throw new BusinessException(ErrorCode.COURSE_NOT_FOUND, "Course not found");
        }
        if (isEnrolled(userId, courseId)) {
            throw new BusinessException(ErrorCode.ALREADY_ENROLLED, "Already enrolled");
        }
        CourseEnrollmentPO enrollment = new CourseEnrollmentPO();
        enrollment.setId(idGenerator.nextId());
        enrollment.setUserId(userId);
        enrollment.setCourseId(courseId);
        enrollment.setEnrolledAt(Instant.now());
        enrollments.insert(enrollment);
    }

    public CourseProgress courseProgress(Long userId, Long courseId) {
        if (!isEnrolled(userId, courseId)) {
            throw new BusinessException(ErrorCode.NOT_ENROLLED, "Not enrolled in this course");
        }
        List<LessonPO> lessonList = lessons.selectList(Wrappers.<LessonPO>lambdaQuery()
                .eq(LessonPO::getCourseId, courseId)
                .eq(LessonPO::getStatus, "PUBLISHED")
                .orderByAsc(LessonPO::getSortOrder));
        List<LessonProgress> items = new ArrayList<>();
        int completed = 0;
        for (LessonPO lesson : lessonList) {
            items.add(new LessonProgress(lesson.getId(), lesson.getTitle(), 0, 0, false));
        }
        int percent = lessonList.isEmpty() ? 0 : (int) Math.round(completed * 100.0 / lessonList.size());
        return new CourseProgress(courseId, lessonList.size(), completed, percent, items);
    }

    // ========== Admin 端 ==========

    @Transactional
    public Course createCourse(CourseCreateRequest r) {
        CoursePO po = new CoursePO();
        po.setId(idGenerator.nextId());
        po.setTitle(r.title());
        po.setDescription(r.description());
        po.setCoverUrl(r.coverUrl());
        po.setCategory(r.category());
        po.setDifficulty(r.difficulty());
        po.setTargetAudience(r.targetAudience());
        po.setTotalLessons(r.totalLessons());
        po.setTotalMinutes(r.totalMinutes());
        po.setStatus("PUBLISHED");
        po.setSortOrder(r.sortOrder());
        po.setCreatedAt(Instant.now());
        courses.insert(po);
        return toCourse(po);
    }

    @Transactional
    public Course updateCourse(Long id, CourseUpdateRequest r) {
        CoursePO existing = courses.selectById(id);
        if (existing == null) {
            throw new BusinessException(ErrorCode.COURSE_NOT_FOUND, "Course not found");
        }
        CoursePO update = new CoursePO();
        update.setId(id);
        update.setTitle(r.title());
        update.setDescription(r.description());
        update.setCoverUrl(r.coverUrl());
        update.setCategory(r.category());
        update.setDifficulty(r.difficulty());
        update.setTargetAudience(r.targetAudience());
        update.setTotalLessons(r.totalLessons());
        update.setTotalMinutes(r.totalMinutes());
        update.setSortOrder(r.sortOrder());
        courses.updateById(update);
        return toCourse(courses.selectById(id));
    }

    @Transactional
    public void deleteCourse(Long id) {
        if (courses.selectById(id) == null) {
            throw new BusinessException(ErrorCode.COURSE_NOT_FOUND, "Course not found");
        }
        courses.deleteById(id);
    }

    @Transactional
    public Lesson createLesson(Long courseId, LessonCreateRequest r) {
        if (courses.selectById(courseId) == null) {
            throw new BusinessException(ErrorCode.COURSE_NOT_FOUND, "Course not found");
        }
        LessonPO po = new LessonPO();
        po.setId(idGenerator.nextId());
        po.setCourseId(courseId);
        po.setTitle(r.title());
        po.setDescription(r.description());
        po.setVideoUrl(r.videoUrl());
        po.setVideoDuration(r.videoDuration());
        po.setThumbnailUrl(r.thumbnailUrl());
        po.setSortOrder(r.sortOrder());
        po.setFree(r.free());
        po.setRequiresExamPass(r.requiresExamPass());
        po.setStatus("PUBLISHED");
        po.setCreatedAt(Instant.now());
        lessons.insert(po);
        return toLesson(po);
    }

    @Transactional
    public Lesson updateLesson(Long lessonId, LessonUpdateRequest r) {
        LessonPO existing = lessons.selectById(lessonId);
        if (existing == null) {
            throw new BusinessException(ErrorCode.LESSON_NOT_FOUND, "Lesson not found");
        }
        LessonPO update = new LessonPO();
        update.setId(lessonId);
        update.setTitle(r.title());
        update.setDescription(r.description());
        update.setVideoUrl(r.videoUrl());
        update.setVideoDuration(r.videoDuration());
        update.setThumbnailUrl(r.thumbnailUrl());
        update.setSortOrder(r.sortOrder());
        update.setFree(r.free());
        update.setRequiresExamPass(r.requiresExamPass());
        lessons.updateById(update);
        return toLesson(lessons.selectById(lessonId));
    }

    @Transactional
    public void deleteLesson(Long lessonId) {
        if (lessons.selectById(lessonId) == null) {
            throw new BusinessException(ErrorCode.LESSON_NOT_FOUND, "Lesson not found");
        }
        lessons.deleteById(lessonId);
    }

    // ========== 内部方法 ==========

    private boolean isEnrolled(Long userId, Long courseId) {
        return enrollments.selectOne(Wrappers.<CourseEnrollmentPO>lambdaQuery()
                .eq(CourseEnrollmentPO::getUserId, userId)
                .eq(CourseEnrollmentPO::getCourseId, courseId)) != null;
    }

    private CourseDetail toCourseDetail(CoursePO po, boolean enrolled, List<LessonPO> lessonList, Long userId) {
        List<LessonSummary> lessonSummaries = new ArrayList<>();
        for (LessonPO lesson : lessonList) {
            boolean unlocked = lesson.getFree() || enrolled;
            lessonSummaries.add(new LessonSummary(lesson.getId(), lesson.getTitle(), lesson.getThumbnailUrl(),
                    lesson.getVideoDuration(), lesson.getSortOrder(), lesson.getFree(), unlocked, false));
        }
        return new CourseDetail(po.getId(), po.getTitle(), po.getDescription(), po.getCoverUrl(),
                po.getCategory(), po.getDifficulty(), po.getTargetAudience(),
                po.getTotalLessons(), po.getTotalMinutes(), enrolled, lessonSummaries);
    }

    private Course toCourse(CoursePO po) {
        return new Course(po.getId(), po.getTitle(), po.getDescription(), po.getCoverUrl(),
                po.getCategory(), po.getDifficulty(), po.getTargetAudience(),
                po.getTotalLessons(), po.getTotalMinutes(), po.getStatus(), po.getCreatedAt());
    }

    private Lesson toLesson(LessonPO po) {
        return new Lesson(po.getId(), po.getCourseId(), po.getTitle(), po.getDescription(),
                po.getVideoUrl(), po.getVideoDuration(), po.getThumbnailUrl(),
                po.getSortOrder(), po.getFree(), po.getRequiresExamPass(), po.getStatus());
    }
}
