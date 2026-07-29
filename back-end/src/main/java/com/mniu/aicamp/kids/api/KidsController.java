package com.mniu.aicamp.kids.api;

import com.mniu.aicamp.kids.application.CompetitionProblemDTO;
import com.mniu.aicamp.kids.application.CompetitionSubmissionDTO;
import com.mniu.aicamp.kids.application.GrowthBadgeDTO;
import com.mniu.aicamp.kids.application.KidsAiTutorRequest;
import com.mniu.aicamp.kids.application.KidsAiTutorResponse;
import com.mniu.aicamp.kids.application.KidsLearningPathDTO;
import com.mniu.aicamp.kids.application.KidsProgressDTO;
import com.mniu.aicamp.kids.application.KidsService;
import com.mniu.aicamp.kids.application.ParentMonitorDTO;
import com.mniu.aicamp.shared.api.ApiResponse;
import com.mniu.aicamp.shared.security.CurrentUsers;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * 少儿编程端接口（需登录）
 * 路由前缀：/api/v1/kids
 * 面向 8-15 岁学生 + 家长，提供学习路径、竞赛题库、成长勋章、AI 助教、家长监控等功能
 */
@RestController
@RequestMapping("/api/v1/kids")
public class KidsController {

    private final KidsService service;

    public KidsController(KidsService service) {
        this.service = service;
    }

    // ============================================================
    // 学习路径
    // ============================================================

    /**
     * 查询所有已发布的少儿学习路径（公开接口，无需登录）
     */
    @GetMapping("/paths")
    public ApiResponse<List<KidsLearningPathDTO>> listLearningPaths() {
        return ApiResponse.ok(service.listLearningPaths());
    }

    /**
     * 查询学习路径详情（公开接口，无需登录）
     */
    @GetMapping("/paths/{slug}")
    public ApiResponse<KidsLearningPathDTO> getLearningPath(@PathVariable String slug) {
        KidsLearningPathDTO path = service.getLearningPath(slug);
        if (path == null) {
            return ApiResponse.error("PATH_NOT_FOUND", "学习路径不存在");
        }
        return ApiResponse.ok(path);
    }

    // ============================================================
    // 竞赛题库
    // ============================================================

    /**
     * 查询竞赛题目列表（支持按难度和类别筛选）
     */
    @GetMapping("/competition/problems")
    public ApiResponse<List<CompetitionProblemDTO>> listCompetitionProblems(
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String category) {
        return ApiResponse.ok(service.listCompetitionProblems(difficulty, category));
    }

    /**
     * 查询竞赛题目详情
     */
    @GetMapping("/competition/problems/{problemId}")
    public ApiResponse<CompetitionProblemDTO> getCompetitionProblem(@PathVariable Long problemId) {
        CompetitionProblemDTO problem = service.getCompetitionProblem(problemId);
        if (problem == null) {
            return ApiResponse.error("PROBLEM_NOT_FOUND", "题目不存在");
        }
        return ApiResponse.ok(problem);
    }

    /**
     * 提交竞赛代码
     */
    @PostMapping("/competition/submit")
    public ApiResponse<CompetitionSubmissionDTO> submitCode(
            @RequestParam Long problemId,
            @RequestParam String language,
            @RequestBody String sourceCode) {
        Long userId = CurrentUsers.require().id();
        return ApiResponse.ok(service.submitCompetitionCode(userId, problemId, language, sourceCode));
    }

    /**
     * 查询用户竞赛提交历史
     */
    @GetMapping("/competition/submissions")
    public ApiResponse<List<CompetitionSubmissionDTO>> getUserSubmissions() {
        Long userId = CurrentUsers.require().id();
        return ApiResponse.ok(service.getUserSubmissions(userId));
    }

    // ============================================================
    // 成长勋章
    // ============================================================

    /**
     * 查询所有勋章及用户获得状态
     */
    @GetMapping("/badges")
    public ApiResponse<List<GrowthBadgeDTO>> listBadges() {
        Long userId = CurrentUsers.require().id();
        return ApiResponse.ok(service.listBadges(userId));
    }

    // ============================================================
    // AI 助教（少儿版）
    // ============================================================

    /**
     * AI 助教对话
     */
    @PostMapping("/ai/tutor")
    public ApiResponse<KidsAiTutorResponse> chatWithTutor(@Valid @RequestBody KidsAiTutorRequest request) {
        Long userId = CurrentUsers.require().id();
        return ApiResponse.ok(service.chatWithTutor(userId, request));
    }

    /**
     * 查询 AI 会话列表
     */
    @GetMapping("/ai/sessions")
    public ApiResponse<List<Map<String, Object>>> listTutorSessions() {
        Long userId = CurrentUsers.require().id();
        return ApiResponse.ok(service.listTutorSessions(userId));
    }

    /**
     * 查询会话对话历史
     */
    @GetMapping("/ai/sessions/{sessionId}/messages")
    public ApiResponse<List<Map<String, Object>>> getSessionMessages(@PathVariable Long sessionId) {
        Long userId = CurrentUsers.require().id();
        return ApiResponse.ok(service.getSessionMessages(sessionId, userId));
    }

    // ============================================================
    // 学习进度
    // ============================================================

    /**
     * 查询学习进度总览
     */
    @GetMapping("/my/progress")
    public ApiResponse<KidsProgressDTO> getUserProgress() {
        Long userId = CurrentUsers.require().id();
        return ApiResponse.ok(service.getUserProgress(userId));
    }

    // ============================================================
    // 家长监控
    // ============================================================

    /**
     * 查询少儿学习活动记录（家长视角）
     */
    @GetMapping("/parent/activity")
    public ApiResponse<List<ParentMonitorDTO>> getChildActivity(
            @RequestParam Long childUserId,
            @RequestParam(defaultValue = "7") int days) {
        return ApiResponse.ok(service.getChildActivity(childUserId, days));
    }

    /**
     * 记录每日学习活动（内部调用或家长录入）
     */
    @PostMapping("/parent/record-activity")
    public ApiResponse<Void> recordActivity(
            @RequestParam Long childUserId,
            @RequestParam int minutes,
            @RequestParam(required = false) String activities) {
        // 简化：activities 为 JSON 字符串，实际应使用 DTO
        service.recordDailyActivity(childUserId, minutes, Map.of());
        return ApiResponse.ok(null);
    }
}
