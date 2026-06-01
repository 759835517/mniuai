package com.mniu.aicamp.coach.api;

import com.mniu.aicamp.coach.application.ChatMessage;
import com.mniu.aicamp.coach.application.CoachService;
import com.mniu.aicamp.coach.application.CoachSession;
import com.mniu.aicamp.shared.api.ApiResponse;
import com.mniu.aicamp.shared.api.PageResponse;
import com.mniu.aicamp.shared.security.CurrentUsers;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.core.task.TaskExecutor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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
@RequestMapping("/api/v1/coach/sessions")
public class CoachController {
    private final CoachService service;
    private final TaskExecutor streamExecutor;

    public CoachController(CoachService service, TaskExecutor sseTaskExecutor) {
        this.service = service;
        this.streamExecutor = sseTaskExecutor;
    }

    @PostMapping
    ApiResponse<CoachSession> create(@RequestBody CreateSessionRequest request) {
        return ApiResponse.ok(service.createSession(CurrentUsers.require().id(), request.title(), request.contextType()));
    }

    @GetMapping
    ApiResponse<?> list(@RequestParam(required = false) Integer page, @RequestParam(required = false) Integer size) {
        List<CoachSession> sessions = service.listSessions(CurrentUsers.require().id());
        if (page == null && size == null) {
            return ApiResponse.ok(sessions);
        }
        return ApiResponse.ok(PageResponse.of(sessions, page == null ? 0 : page, size == null ? 50 : size));
    }

    @GetMapping("/{sessionId}")
    ApiResponse<CoachSession> detail(@PathVariable Long sessionId) {
        return ApiResponse.ok(service.getSession(CurrentUsers.require().id(), sessionId));
    }

    @PostMapping("/{sessionId}/messages")
    ApiResponse<CoachSession> send(@PathVariable Long sessionId, @Valid @RequestBody SendMessageRequest request) {
        return ApiResponse.ok(service.sendMessage(CurrentUsers.require().id(), sessionId, request.content()));
    }

    @GetMapping("/{sessionId}/messages")
    ApiResponse<PageResponse<ChatMessage>> messages(@PathVariable Long sessionId,
                                                    @RequestParam(defaultValue = "0") int page,
                                                    @RequestParam(defaultValue = "50") int size) {
        return ApiResponse.ok(PageResponse.of(service.listMessages(CurrentUsers.require().id(), sessionId), page, size));
    }

    @PostMapping("/{sessionId}/clear")
    ApiResponse<Map<String, Object>> clear(@PathVariable Long sessionId) {
        service.clearSession(CurrentUsers.require().id(), sessionId);
        return ApiResponse.ok(Map.of("sessionId", String.valueOf(sessionId), "cleared", true));
    }

    @DeleteMapping("/{sessionId}")
    ApiResponse<Map<String, Boolean>> delete(@PathVariable Long sessionId) {
        service.deleteSession(CurrentUsers.require().id(), sessionId);
        return ApiResponse.ok(Map.of("deleted", true));
    }

    @PostMapping(value = "/{sessionId}/messages/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    ResponseEntity<SseEmitter> stream(@PathVariable Long sessionId, @Valid @RequestBody SendMessageRequest request) {
        Long userId = CurrentUsers.require().id();
        SseEmitter emitter = new SseEmitter(300000L);
        streamExecutor.execute(() -> {
            try {
                send(emitter, SseEmitter.event().name("ready").data(Map.of("ready", true)));
                service.streamMessage(userId, sessionId, request.content(), chunk ->
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
            // Client disconnected or the response is already closed.
        }
    }
}

record CreateSessionRequest(String title, String contextType) {
}

record SendMessageRequest(@NotBlank String content) {
}

