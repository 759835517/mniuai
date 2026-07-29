package com.mniu.aicamp.video.application;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.mniu.aicamp.course.infrastructure.mapper.CourseEnrollmentMapper;
import com.mniu.aicamp.course.infrastructure.mapper.LessonMapper;
import com.mniu.aicamp.course.infrastructure.po.CourseEnrollmentPO;
import com.mniu.aicamp.course.infrastructure.po.LessonPO;
import com.mniu.aicamp.shared.api.ErrorCode;
import com.mniu.aicamp.shared.exception.BusinessException;
import com.mniu.aicamp.video.infrastructure.mapper.VideoProgressMapper;
import com.mniu.aicamp.video.infrastructure.po.VideoProgressPO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;

@Service
public class VideoService {
    private final LessonMapper lessons;
    private final CourseEnrollmentMapper enrollments;
    private final VideoProgressMapper progressMapper;

    public VideoService(LessonMapper lessons, CourseEnrollmentMapper enrollments, VideoProgressMapper progressMapper) {
        this.lessons = lessons;
        this.enrollments = enrollments;
        this.progressMapper = progressMapper;
    }

    /**
     * 根据 ID 查找章节。
     */
    public LessonPO findLesson(Long lessonId) {
        LessonPO lesson = lessons.selectById(lessonId);
        if (lesson == null) {
            throw new BusinessException(ErrorCode.LESSON_NOT_FOUND, "Lesson not found");
        }
        return lesson;
    }

    /**
     * 获取播放 URL + 断点位置。
     */
    @Transactional(readOnly = true)
    public PlayUrlResponse getPlayUrl(Long userId, Long lessonId) {
        LessonPO lesson = findLesson(lessonId);
        verifyLessonAccess(userId, lesson);
        VideoProgressPO progress = findProgress(userId, lessonId).orElse(null);
        int lastPosition = progress == null ? 0 : progress.getLastPositionSec();
        boolean completed = progress != null && Boolean.TRUE.equals(progress.getCompleted());
        return new PlayUrlResponse(lesson.getVideoUrl(), lesson.getVideoDuration(), lastPosition, completed);
    }

    /**
     * 获取章节进度。
     */
    @Transactional(readOnly = true)
    public ProgressSnapshot getProgress(Long userId, Long lessonId) {
        LessonPO lesson = lessons.selectById(lessonId);
        if (lesson == null) {
            throw new BusinessException(ErrorCode.LESSON_NOT_FOUND, "Lesson not found");
        }
        VideoProgressPO progress = findProgress(userId, lessonId).orElse(null);
        if (progress == null) {
            return new ProgressSnapshot(0, 0, lesson.getVideoDuration(), 0, false);
        }
        return new ProgressSnapshot(progress.getLastPositionSec(), progress.getValidWatchedSec(),
                progress.getTotalDurationSec(), progress.getWatchRatio(), progress.getCompleted());
    }

    /**
     * 校验用户是否有权访问章节（已报名或免费章节）。
     */
    public void verifyLessonAccess(Long userId, LessonPO lesson) {
        if (Boolean.TRUE.equals(lesson.getFree())) {
            return;
        }
        CourseEnrollmentPO enrollment = enrollments.selectOne(Wrappers.<CourseEnrollmentPO>lambdaQuery()
                .eq(CourseEnrollmentPO::getUserId, userId)
                .eq(CourseEnrollmentPO::getCourseId, lesson.getCourseId()));
        if (enrollment == null) {
            throw new BusinessException(ErrorCode.NOT_ENROLLED, "Not enrolled in this course");
        }
    }

    public Optional<VideoProgressPO> findProgress(Long userId, Long lessonId) {
        return progressMapper.selectList(Wrappers.<VideoProgressPO>lambdaQuery()
                        .eq(VideoProgressPO::getUserId, userId)
                        .eq(VideoProgressPO::getLessonId, lessonId))
                .stream().findFirst();
    }

    public void saveProgress(VideoProgressPO po) {
        if (po.getId() == null) {
            progressMapper.insert(po);
        } else {
            po.setUpdatedAt(Instant.now());
            progressMapper.updateById(po);
        }
    }
}
