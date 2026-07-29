package com.mniu.aicamp.interview.api;

import com.mniu.aicamp.interview.application.InterviewQuestion;
import com.mniu.aicamp.interview.application.InterviewQuestionCreateRequest;
import com.mniu.aicamp.interview.application.InterviewService;
import com.mniu.aicamp.interview.application.InterviewSet;
import com.mniu.aicamp.interview.application.MockInterview;
import com.mniu.aicamp.interview.application.MockInterviewAnswer;
import com.mniu.aicamp.interview.application.MockInterviewAnswerRequest;
import com.mniu.aicamp.interview.application.MockInterviewStartRequest;
import com.mniu.aicamp.shared.api.ApiResponse;
import com.mniu.aicamp.shared.api.PageResponse;
import com.mniu.aicamp.shared.security.CurrentUsers;
import jakarta.validation.Valid;
import org.springframework.core.task.TaskExecutor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/interview")
public class InterviewController {
    private final InterviewService service;
    private final TaskExecutor streamExecutor;

    public InterviewController(InterviewService service, TaskExecutor sseTaskExecutor) {
        this.service = service;
        this.streamExecutor = sseTaskExecutor;
    }

    // ========== 题库 ==========

    @GetMapping("/questions")
    ApiResponse<PageResponse<InterviewQuestion>> listQuestions(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String company,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.ok(service.listQuestions(category, difficulty, company, page, size));
    }

    @GetMapping("/questions/{id}")
    ApiResponse<InterviewQuestion> getQuestion(@PathVariable Long id) {
        return ApiResponse.ok(service.getQuestion(id));
    }

    // ========== 套题 ==========

    @GetMapping("/sets")
    ApiResponse<PageResponse<InterviewSet>> listSets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.ok(service.listSets(page, size));
    }

    @GetMapping("/sets/{id}")
    ApiResponse<InterviewSet> getSet(@PathVariable Long id) {
        return ApiResponse.ok(service.getSet(id));
    }

    // ========== 模拟面试 ==========

    @PostMapping("/mock/start")
    ApiResponse<MockInterview> startMock(@Valid @RequestBody MockInterviewStartRequest request) {
        return ApiResponse.ok(service.startMockInterview(CurrentUsers.require().id(), request));
    }

    @GetMapping("/mock/{id}")
    ApiResponse<MockInterview> getMock(@PathVariable Long id) {
        return ApiResponse.ok(service.getMockInterview(CurrentUsers.require().id(), id));
    }

    @GetMapping("/mock/history")
    ApiResponse<PageResponse<MockInterview>> listHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.ok(service.listMockInterviews(CurrentUsers.require().id(), page, size));
    }

    @PostMapping("/mock/{id}/answer")
    ApiResponse<MockInterviewAnswer> submitAnswer(@PathVariable Long id, @Valid @RequestBody MockInterviewAnswerRequest request) {
        return ApiResponse.ok(service.submitAnswer(CurrentUsers.require().id(), id, request));
    }

    @PostMapping("/mock/{id}/complete")
    ApiResponse<MockInterview> complete(@PathVariable Long id) {
        return ApiResponse.ok(service.completeMockInterview(CurrentUsers.require().id(), id));
    }

    // ========== AI 面试官 SSE ==========

    @PostMapping(value = "/mock/{id}/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    ResponseEntity<SseEmitter> stream(@PathVariable Long id, @Valid @RequestBody MockInterviewAnswerRequest request) {
        Long userId = CurrentUsers.require().id();
        SseEmitter emitter = new SseEmitter(300000L);
        streamExecutor.execute(() -> {
            try {
                send(emitter, SseEmitter.event().name("ready").data(Map.of("ready", true)));
                service.streamInterview(userId, id, request.questionId(), request.userAnswer(), chunk ->
                        send(emitter, SseEmitter.event().name("token").data(Map.of("delta", chunk))));
                send(emitter, SseEmitter.event().name("done").data(Map.of("done", true)));
                emitter.complete();
            } catch (Exception ex) {
                sendError(emitter, ex);
                emitter.complete();
            }
        });
        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_EVENT_STREAM)
                .header(HttpHeaders.CACHE_CONTROL, "no-cache, no-transform")
                .header("X-Accel-Buffering", "no")
                .body(emitter);
    }

    // ========== 能力画像 ==========

    @GetMapping("/skill-profile")
    ApiResponse<List<com.mniu.aicamp.interview.application.InterviewSkillProfile>> getSkillProfile() {
        return ApiResponse.ok(service.getSkillProfile(CurrentUsers.require().id()));
    }

    // ========== 管理端 ==========

    @PostMapping("/admin/questions")
    @PreAuthorize("hasRole('ADMIN')")
    ApiResponse<InterviewQuestion> createQuestion(@Valid @RequestBody InterviewQuestionCreateRequest request) {
        return ApiResponse.ok(service.createQuestion(request));
    }

    @PostMapping("/admin/questions/batch")
    @PreAuthorize("hasRole('ADMIN')")
    ApiResponse<List<InterviewQuestion>> batchCreate(@Valid @RequestBody List<InterviewQuestionCreateRequest> requests) {
        return ApiResponse.ok(service.batchCreateQuestions(requests));
    }

    private void send(SseEmitter emitter, SseEmitter.SseEventBuilder event) {
        try {
            emitter.send(event);
        } catch (Exception ex) {
            throw new IllegalStateException("SSE send failed", ex);
        }
    }

    private void sendError(SseEmitter emitter, Exception ex) {
        try {
            String message = ex.getMessage() == null ? "SSE stream failed" : ex.getMessage();
            emitter.send(SseEmitter.event().name("error").data(Map.of("message", message)));
        } catch (Exception ignored) {
        }
    }
}
