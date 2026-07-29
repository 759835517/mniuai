package com.mniu.aicamp.campus.api;

import com.mniu.aicamp.campus.application.AiTutorRequest;
import com.mniu.aicamp.campus.application.AiTutorResponse;
import com.mniu.aicamp.campus.application.CampusService;
import com.mniu.aicamp.campus.application.EmploymentReportDTO;
import com.mniu.aicamp.campus.application.EmploymentReportRequest;
import com.mniu.aicamp.campus.application.GuaranteeApplicationDTO;
import com.mniu.aicamp.campus.application.GuaranteeApplicationRequest;
import com.mniu.aicamp.campus.application.PortfolioDTO;
import com.mniu.aicamp.campus.application.ResumeRequest;
import com.mniu.aicamp.campus.application.ResumeResponse;
import com.mniu.aicamp.campus.application.SubscriptionPlanDTO;
import com.mniu.aicamp.campus.application.CodeSubmissionDTO;
import com.mniu.aicamp.campus.application.CodeSubmitRequest;
import com.mniu.aicamp.campus.application.CourseSummaryDTO;
import com.mniu.aicamp.campus.application.GuaranteeProgressDTO;
import com.mniu.aicamp.campus.application.LearningPathDTO;
import com.mniu.aicamp.campus.application.LessonDTO;
import com.mniu.aicamp.campus.application.PathDetailDTO;
import com.mniu.aicamp.campus.application.PracticeProblemDTO;
import com.mniu.aicamp.campus.application.ProgressDTO;
import com.mniu.aicamp.campus.infrastructure.po.PathEnrollmentPO;
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

/**
 * Campus 大学生端接口（需登录）
 */
@RestController
@RequestMapping("/api/v1/campus")
public class CampusController {
    private final CampusService service;

    public CampusController(CampusService service) {
        this.service = service;
    }

    /**
     * 学习路径列表
     */
    @GetMapping("/paths")
    public ApiResponse<List<LearningPathDTO>> listPaths() {
        Long currentUserId = getCurrentUserIdSafely();
        return ApiResponse.ok(service.listPaths());
    }

    /**
     * 学习路径详情
     */
    @GetMapping("/paths/{slug}")
    public ApiResponse<PathDetailDTO> getPathDetail(@PathVariable String slug) {
        Long currentUserId = getCurrentUserIdSafely();
        PathDetailDTO detail = service.getPathDetail(slug, currentUserId);
        if (detail == null) {
            return ApiResponse.error("PATH_NOT_FOUND", "学习路径不存在");
        }
        return ApiResponse.ok(detail);
    }

    /**
     * 报名学习路径
     */
    @PostMapping("/paths/{slug}/enroll")
    public ApiResponse<PathEnrollmentPO> enrollPath(@PathVariable String slug) {
        Long userId = CurrentUsers.require().id();
        return ApiResponse.ok(service.enrollPath(userId, slug));
    }

    /**
     * 课程课时列表
     */
    @GetMapping("/courses/{courseId}/lessons")
    public ApiResponse<List<LessonDTO>> listLessons(@PathVariable Long courseId) {
        Long currentUserId = getCurrentUserIdSafely();
        return ApiResponse.ok(service.listLessons(courseId, currentUserId));
    }

    /**
     * 编程练习题目列表
     */
    @GetMapping("/practice/problems")
    public ApiResponse<List<PracticeProblemDTO>> listProblems(
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String category) {
        return ApiResponse.ok(service.listProblems(difficulty, category));
    }

    /**
     * 提交代码
     */
    @PostMapping("/practice/submit")
    public ApiResponse<CodeSubmissionDTO> submitCode(@Valid @RequestBody CodeSubmitRequest request) {
        Long userId = CurrentUsers.require().id();
        return ApiResponse.ok(service.submitCode(userId, request));
    }

    /**
     * 学习进度总览（需登录）
     */
    @GetMapping("/my/progress")
    public ApiResponse<List<ProgressDTO>> getUserProgress() {
        Long userId = CurrentUsers.require().id();
        return ApiResponse.ok(service.getUserProgress(userId));
    }

    /**
     * 对赌进度详情（需登录）
     */
    @GetMapping("/guarantee/progress")
    public ApiResponse<GuaranteeProgressDTO> getGuaranteeProgress(@RequestParam String slug) {
        Long userId = CurrentUsers.require().id();
        GuaranteeProgressDTO progress = service.getGuaranteeProgress(userId, slug);
        if (progress == null) {
            return ApiResponse.error("PATH_NOT_FOUND", "学习路径不存在");
        }
        return ApiResponse.ok(progress);
    }

    /**
     * AI 助教对话（需登录）
     */
    @PostMapping("/ai/tutor")
    public ApiResponse<AiTutorResponse> chatWithTutor(@Valid @RequestBody AiTutorRequest request) {
        Long userId = CurrentUsers.require().id();
        return ApiResponse.ok(service.chatWithTutor(userId, request));
    }

    /**
     * 获取用户作品集（需登录）
     */
    @GetMapping("/portfolio")
    public ApiResponse<PortfolioDTO> getPortfolio() {
        Long userId = CurrentUsers.require().id();
        return ApiResponse.ok(service.getPortfolio(userId));
    }

    /**
     * AI 生成简历（需登录）
     */
    @PostMapping("/resume/generate")
    public ApiResponse<ResumeResponse> generateResume(@Valid @RequestBody ResumeRequest request) {
        Long userId = CurrentUsers.require().id();
        return ApiResponse.ok(service.generateResume(userId, request));
    }

    /**
     * 订阅计划列表（公开）
     */
    @GetMapping("/subscription/plans")
    public ApiResponse<List<SubscriptionPlanDTO>> listSubscriptionPlans() {
        return ApiResponse.ok(service.listSubscriptionPlans());
    }

    /**
     * 申请对赌协议（需登录）
     */
    @PostMapping("/guarantee/apply")
    public ApiResponse<GuaranteeApplicationDTO> applyForGuarantee(@Valid @RequestBody GuaranteeApplicationRequest request) {
        Long userId = CurrentUsers.require().id();
        return ApiResponse.ok(service.applyForGuarantee(userId, request));
    }

    /**
     * 就业上报（需登录）
     */
    @PostMapping("/employment/report")
    public ApiResponse<EmploymentReportDTO> reportEmployment(@Valid @RequestBody EmploymentReportRequest request) {
        Long userId = CurrentUsers.require().id();
        return ApiResponse.ok(service.reportEmployment(userId, request));
    }

    /**
     * 安全获取当前用户 ID（未登录返回 null）
     */
    private Long getCurrentUserIdSafely() {
        try {
            return CurrentUsers.require().id();
        } catch (Exception e) {
            return null;
        }
    }
}
