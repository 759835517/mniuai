package com.mniu.aicamp.video.application;

import com.mniu.aicamp.course.infrastructure.po.LessonPO;
import com.mniu.aicamp.shared.util.SnowflakeIdGenerator;
import com.mniu.aicamp.video.infrastructure.mapper.VideoHeartbeatMapper;
import com.mniu.aicamp.video.infrastructure.po.VideoHeartbeatPO;
import com.mniu.aicamp.video.infrastructure.po.VideoProgressPO;
import com.mniu.aicamp.video.infrastructure.redis.HeartbeatDedup;
import com.mniu.aicamp.video.infrastructure.redis.VideoWatchBitSet;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;

@Service
public class VideoHeartbeatService {
    private final VideoService videoService;
    private final AntiCheatEngine antiCheatEngine;
    private final HeartbeatDedup dedup;
    private final VideoWatchBitSet watchBitSet;
    private final VideoHeartbeatMapper heartbeatMapper;
    private final SnowflakeIdGenerator idGenerator;

    public VideoHeartbeatService(VideoService videoService, AntiCheatEngine antiCheatEngine,
                                 HeartbeatDedup dedup, VideoWatchBitSet watchBitSet,
                                 VideoHeartbeatMapper heartbeatMapper, SnowflakeIdGenerator idGenerator) {
        this.videoService = videoService;
        this.antiCheatEngine = antiCheatEngine;
        this.dedup = dedup;
        this.watchBitSet = watchBitSet;
        this.heartbeatMapper = heartbeatMapper;
        this.idGenerator = idGenerator;
    }

    @Transactional
    public ProgressSnapshot processHeartbeat(Long userId, Long lessonId, HeartbeatRequest request) {
        LessonPO lesson = videoService.findLesson(lessonId);
        videoService.verifyLessonAccess(userId, lesson);

        // 同秒去重
        if (!dedup.tryAcquire(userId, lessonId, request.positionSec())) {
            return videoService.getProgress(userId, lessonId);
        }

        VideoProgressPO progress = videoService.findProgress(userId, lessonId).orElseGet(() -> {
            VideoProgressPO po = new VideoProgressPO();
            po.setId(idGenerator.nextId());
            po.setUserId(userId);
            po.setLessonId(lessonId);
            po.setTotalDurationSec(lesson.getVideoDuration());
            return po;
        });

        Instant now = Instant.now();
        Instant lastHeartbeatAt = progress.getUpdatedAt() != null ? progress.getUpdatedAt() : now;
        int lastPosition = progress.getLastPositionSec();
        int validWatched = progress.getValidWatchedSec() == null ? 0 : progress.getValidWatchedSec();

        // 防作弊计算
        HeartbeatContext ctx = new HeartbeatContext(request.positionSec(), request.speed(),
                lastPosition, validWatched, lastHeartbeatAt, now);
        int validDelta = antiCheatEngine.evaluate(ctx);

        // bitset 去重：仅在有效增量 > 0 时检查新分段
        int bitsetDelta = 0;
        if (validDelta > 0) {
            int startSegment = (lastPosition + 4) / 5; // 上一个分段之后
            int endSegment = request.positionSec() / 5;
            for (int seg = startSegment; seg <= endSegment; seg++) {
                if (watchBitSet.markNewSegment(userId, lessonId, seg * 5)) {
                    bitsetDelta += 5;
                }
            }
        }

        // 取防作弊和 bitset 的最小值作为实际增量
        int actualDelta = Math.min(validDelta, bitsetDelta);
        int newValid = validWatched + actualDelta;

        // 更新进度
        progress.setLastPositionSec(request.positionSec());
        progress.setValidWatchedSec(newValid);
        progress.setTotalDurationSec(lesson.getVideoDuration());
        double ratio = lesson.getVideoDuration() > 0
                ? Math.min(1.0, (double) newValid / lesson.getVideoDuration()) : 0;
        progress.setWatchRatio(ratio);
        boolean completed = ratio >= 0.9;
        progress.setCompleted(completed);
        videoService.saveProgress(progress);

        // 记录心跳日志
        VideoHeartbeatPO heartbeat = new VideoHeartbeatPO();
        heartbeat.setId(idGenerator.nextId());
        heartbeat.setUserId(userId);
        heartbeat.setLessonId(lessonId);
        heartbeat.setPositionSec(request.positionSec());
        heartbeat.setSpeed(BigDecimal.valueOf(request.speed()));
        heartbeat.setRecordedAt(now);
        heartbeatMapper.insert(heartbeat);

        return new ProgressSnapshot(progress.getLastPositionSec(), newValid,
                lesson.getVideoDuration(), ratio, completed);
    }
}
