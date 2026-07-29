package com.mniu.aicamp.engineer.infrastructure;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.mniu.aicamp.engineer.infrastructure.mapper.EngineerActivityLogMapper;
import com.mniu.aicamp.engineer.infrastructure.mapper.EngineerProgressMapper;
import com.mniu.aicamp.engineer.infrastructure.po.EngineerActivityLogPO;
import com.mniu.aicamp.engineer.infrastructure.po.EngineerProgressPO;
import com.mniu.aicamp.shared.util.SnowflakeIdGenerator;
import org.springframework.stereotype.Repository;

/**
 * 程序员学习进度仓库
 */
@Repository
public class EngineerProgressRepository {
    private final EngineerProgressMapper progressMapper;
    private final EngineerActivityLogMapper activityLogMapper;
    private final SnowflakeIdGenerator idGenerator;

    public EngineerProgressRepository(EngineerProgressMapper progressMapper,
                                      EngineerActivityLogMapper activityLogMapper,
                                      SnowflakeIdGenerator idGenerator) {
        this.progressMapper = progressMapper;
        this.activityLogMapper = activityLogMapper;
        this.idGenerator = idGenerator;
    }

    /**
     * 获取用户学习进度（不存在则初始化）。
     * 若 userId 为 null，则使用 users 表中第一个用户（演示模式）。
     */
    public EngineerProgressPO getOrCreate(Long userId) {
        Long actualUserId = userId != null ? userId : findFirstUserId();
        EngineerProgressPO progress = progressMapper.selectOne(
                new LambdaQueryWrapper<EngineerProgressPO>()
                        .eq(EngineerProgressPO::getUserId, actualUserId)
        );
        if (progress == null) {
            long id = idGenerator.nextId();
            progressMapper.ensureExists(id, actualUserId);
            progress = progressMapper.selectOne(
                    new LambdaQueryWrapper<EngineerProgressPO>()
                            .eq(EngineerProgressPO::getUserId, actualUserId)
            );
        }
        return progress;
    }

    /**
     * 查询 users 表中第一个用户 ID（用于演示模式）
     */
    private Long findFirstUserId() {
        var user = progressMapper.findFirstUser();
        if (user == null) {
            return 1L;
        }
        return ((Number) user.get("user_id")).longValue();
    }

    /**
     * 记录算法题解答
     */
    public void recordAlgorithmSolve(Long userId, String problemId, int score) {
        Long actualUserId = resolveUserId(userId);
        ensureExists(actualUserId);
        progressMapper.incrementField(actualUserId, "solved_problems");
        logActivity(actualUserId, "ALGORITHM_SOLVE", problemId, score);
    }

    /**
     * 记录编程实战任务完成
     */
    public void recordTaskComplete(Long userId, String taskId, int score) {
        Long actualUserId = resolveUserId(userId);
        ensureExists(actualUserId);
        progressMapper.incrementField(actualUserId, "completed_tasks");
        logActivity(actualUserId, "TASK_COMPLETE", taskId, score);
    }

    /**
     * 记录AI面试轮次
     */
    public void recordInterviewRound(Long userId, String sessionId, int score) {
        Long actualUserId = resolveUserId(userId);
        ensureExists(actualUserId);
        progressMapper.incrementField(actualUserId, "interview_rounds");
        logActivity(actualUserId, "INTERVIEW", sessionId, score);
    }

    /**
     * 记录系统设计完成
     */
    public void recordSystemDesign(Long userId, String topicId, int score) {
        Long actualUserId = resolveUserId(userId);
        ensureExists(actualUserId);
        progressMapper.incrementField(actualUserId, "system_design_count");
        logActivity(actualUserId, "SYSTEM_DESIGN", topicId, score);
    }

    /**
     * 记录代码审查
     */
    public void recordCodeReview(Long userId, int score) {
        Long actualUserId = resolveUserId(userId);
        ensureExists(actualUserId);
        progressMapper.incrementField(actualUserId, "code_review_count");
        logActivity(actualUserId, "CODE_REVIEW", null, score);
    }

    /**
     * 记录求职投递
     */
    public void recordJobApplication(Long userId, String companyName) {
        Long actualUserId = resolveUserId(userId);
        ensureExists(actualUserId);
        progressMapper.incrementField(actualUserId, "job_applications");
        logActivity(actualUserId, "JOB_APPLY", companyName, null);
    }

    /**
     * 解析 userId：若为 null 则使用演示用户
     */
    private Long resolveUserId(Long userId) {
        return userId != null ? userId : findFirstUserId();
    }

    private void ensureExists(Long userId) {
        getOrCreate(userId);
    }

    private void logActivity(Long userId, String type, String refId, Integer score) {
        EngineerActivityLogPO log = new EngineerActivityLogPO();
        log.setId(idGenerator.nextId());
        log.setUserId(userId);
        log.setActivityType(type);
        log.setRefId(refId);
        log.setScore(score);
        log.setCreatedAt(java.time.Instant.now());
        activityLogMapper.insert(log);
    }
}
