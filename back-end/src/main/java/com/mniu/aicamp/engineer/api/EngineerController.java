package com.mniu.aicamp.engineer.api;

import com.mniu.aicamp.engineer.application.AlgorithmDTO;
import com.mniu.aicamp.engineer.application.AlgorithmSubmitRequest;
import com.mniu.aicamp.engineer.application.AlgorithmSubmitResultDTO;
import com.mniu.aicamp.engineer.application.AssessmentRequest;
import com.mniu.aicamp.engineer.application.AssessmentResultDTO;
import com.mniu.aicamp.engineer.application.CodeReviewRequest;
import com.mniu.aicamp.engineer.application.CodeReviewResultDTO;
import com.mniu.aicamp.engineer.application.EngineerGuaranteeDTO;
import com.mniu.aicamp.engineer.application.EngineerService;
import com.mniu.aicamp.engineer.application.HintRequest;
import com.mniu.aicamp.engineer.application.HintResultDTO;
import com.mniu.aicamp.engineer.application.InterviewAnswerDTO;
import com.mniu.aicamp.engineer.application.InterviewAnswerRequest;
import com.mniu.aicamp.engineer.application.InterviewReportDTO;
import com.mniu.aicamp.engineer.application.InterviewStartDTO;
import com.mniu.aicamp.engineer.application.InterviewStartRequest;
import com.mniu.aicamp.engineer.application.PathDTO;
import com.mniu.aicamp.engineer.application.SystemDesignDTO;
import com.mniu.aicamp.engineer.application.TaskDTO;
import com.mniu.aicamp.engineer.application.TaskSubmitRequest;
import com.mniu.aicamp.engineer.application.TaskSubmitResultDTO;
import com.mniu.aicamp.engineer.infrastructure.EngineerProgressRepository;
import com.mniu.aicamp.shared.api.ApiResponse;
import com.mniu.aicamp.shared.security.CurrentUser;
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

/**
 * Engineer 程序员端接口
 */
@RestController
@RequestMapping("/api/v1/engineer")
public class EngineerController {
    private final EngineerService service;
    private final EngineerProgressRepository progressRepository;

    public EngineerController(EngineerService service, EngineerProgressRepository progressRepository) {
        this.service = service;
        this.progressRepository = progressRepository;
    }

    /**
     * 获取当前用户ID（未登录则返回 null，由 Repository 使用演示用户）
     */
    private Long currentUserId() {
        return CurrentUsers.optional().map(CurrentUser::id).orElse(null);
    }

    /**
     * 能力诊断测评（公开）
     */
    @PostMapping("/assessment")
    public ApiResponse<AssessmentResultDTO> submitAssessment(@Valid @RequestBody AssessmentRequest request) {
        return ApiResponse.ok(service.evaluateAssessment(request));
    }

    /**
     * 学习路径列表（公开）
     */
    @GetMapping("/paths")
    public ApiResponse<List<PathDTO>> listPaths() {
        return ApiResponse.ok(service.listPaths());
    }

    /**
     * AI编程实战任务列表（公开）
     */
    @GetMapping("/tasks")
    public ApiResponse<List<TaskDTO>> listTasks() {
        return ApiResponse.ok(service.listTasks());
    }

    /**
     * 提交编程实战任务（需登录）
     */
    @PostMapping("/tasks/{taskId}/submit")
    public ApiResponse<TaskSubmitResultDTO> submitTask(
            @PathVariable String taskId,
            @Valid @RequestBody TaskSubmitRequest request) {
        TaskSubmitRequest merged = new TaskSubmitRequest(taskId, request.code(), request.language());
        TaskSubmitResultDTO result = service.submitTask(merged);
        progressRepository.recordTaskComplete(currentUserId(), taskId, result.score());
        return ApiResponse.ok(result);
    }

    /**
     * 算法题库列表（公开，支持分页和筛选）
     */
    @GetMapping("/algorithms")
    public ApiResponse<java.util.Map<String, Object>> listAlgorithms(
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize) {
        // 限制每页最大数量
        pageSize = Math.min(pageSize, 100);
        List<AlgorithmDTO> list = service.listAlgorithms(difficulty, category, page, pageSize);
        int total = service.countAlgorithms(difficulty, category);
        java.util.Map<String, Object> result = new java.util.HashMap<>();
        result.put("list", list);
        result.put("total", total);
        result.put("page", page);
        result.put("pageSize", pageSize);
        result.put("totalPages", (total + pageSize - 1) / pageSize);
        return ApiResponse.ok(result);
    }

    /**
     * 提交算法题（需登录）
     */
    @PostMapping("/algorithms/{problemId}/submit")
    public ApiResponse<AlgorithmSubmitResultDTO> submitAlgorithm(
            @PathVariable String problemId,
            @Valid @RequestBody AlgorithmSubmitRequest request) {
        AlgorithmSubmitRequest merged = new AlgorithmSubmitRequest(problemId, request.code(), request.language());
        AlgorithmSubmitResultDTO result = service.submitAlgorithm(merged);
        int score = result.totalCases() > 0 ? result.passedCases() * 100 / result.totalCases() : 0;
        progressRepository.recordAlgorithmSolve(currentUserId(), problemId, score);
        return ApiResponse.ok(result);
    }

    /**
     * 请求AI提示（公开）
     */
    @PostMapping("/algorithms/{problemId}/hint")
    public ApiResponse<HintResultDTO> getHint(
            @PathVariable String problemId,
            @Valid @RequestBody HintRequest request) {
        HintRequest merged = new HintRequest(problemId, request.code(), request.currentLevel());
        return ApiResponse.ok(service.getHint(merged));
    }

    /**
     * 开始AI面试（需登录）
     */
    @PostMapping("/interview/start")
    public ApiResponse<InterviewStartDTO> startInterview(@Valid @RequestBody InterviewStartRequest request) {
        InterviewStartDTO result = service.startInterview(request);
        progressRepository.recordInterviewRound(currentUserId(), result.sessionId(), 0);
        return ApiResponse.ok(result);
    }

    /**
     * 提交面试回答（需登录）
     */
    @PostMapping("/interview/answer")
    public ApiResponse<InterviewAnswerDTO> answerInterview(@Valid @RequestBody InterviewAnswerRequest request) {
        return ApiResponse.ok(service.answerInterview(request));
    }

    /**
     * 获取面试报告（需登录）
     */
    @GetMapping("/interview/{sessionId}/report")
    public ApiResponse<InterviewReportDTO> getInterviewReport(@PathVariable String sessionId) {
        return ApiResponse.ok(service.getInterviewReport(sessionId));
    }

    /**
     * 代码审查（公开）
     */
    @PostMapping("/code-review")
    public ApiResponse<CodeReviewResultDTO> reviewCode(@Valid @RequestBody CodeReviewRequest request) {
        CodeReviewResultDTO result = service.reviewCode(request);
        progressRepository.recordCodeReview(currentUserId(), result.totalScore());
        return ApiResponse.ok(result);
    }

    /**
     * 获取系统设计题（公开）
     */
    @GetMapping("/system-design/{topicId}")
    public ApiResponse<SystemDesignDTO> getSystemDesign(@PathVariable String topicId) {
        return ApiResponse.ok(service.getSystemDesign(topicId));
    }

    /**
     * 查询对赌进度（公开，未登录则使用演示用户）
     */
    @GetMapping("/guarantee/progress")
    public ApiResponse<EngineerGuaranteeDTO> getGuaranteeProgress() {
        Long userId = CurrentUsers.optional().map(CurrentUser::id).orElse(null);
        return ApiResponse.ok(service.getGuaranteeProgress(userId));
    }

    /**
     * 申请退款（公开，演示模式）
     */
    @PostMapping("/guarantee/apply")
    public ApiResponse<String> applyGuarantee() {
        // TODO: 持久化退款申请
        return ApiResponse.ok("退款申请已提交，我们将在 3 个工作日内审核");
    }
}
