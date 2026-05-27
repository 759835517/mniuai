package com.mniu.aicamp.coach.api;

import com.mniu.aicamp.shared.api.ApiResponse;
import com.mniu.aicamp.shared.api.PageResponse;
import com.mniu.aicamp.shared.security.CurrentUsers;
import com.mniu.aicamp.user.application.PlatformService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/coach/sessions")
public class CoachController {
    private final PlatformService service;

    public CoachController(PlatformService service) {
        this.service = service;
    }

    @PostMapping
    ApiResponse<PlatformService.CoachSession> create(@RequestBody CreateSessionRequest request) {
        return ApiResponse.ok(service.createSession(CurrentUsers.require().id(), request.title(), request.contextType()));
    }

    @GetMapping
    ApiResponse<?> list(@RequestParam(required = false) Integer page, @RequestParam(required = false) Integer size) {
        List<PlatformService.CoachSession> sessions = service.listSessions(CurrentUsers.require().id());
        if (page == null && size == null) {
            return ApiResponse.ok(sessions);
        }
        return ApiResponse.ok(PageResponse.of(sessions, page == null ? 0 : page, size == null ? 50 : size));
    }

    @GetMapping("/{sessionId}")
    ApiResponse<PlatformService.CoachSession> detail(@PathVariable Long sessionId) {
        return ApiResponse.ok(service.getSession(CurrentUsers.require().id(), sessionId));
    }

    @PostMapping("/{sessionId}/messages")
    ApiResponse<PlatformService.CoachSession> send(@PathVariable Long sessionId, @Valid @RequestBody SendMessageRequest request) {
        return ApiResponse.ok(service.sendMessage(CurrentUsers.require().id(), sessionId, request.content()));
    }

    @GetMapping("/{sessionId}/messages")
    ApiResponse<PageResponse<PlatformService.ChatMessage>> messages(@PathVariable Long sessionId,
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
    SseEmitter stream(@PathVariable Long sessionId, @Valid @RequestBody SendMessageRequest request) throws IOException {
        PlatformService.CoachSession session = service.sendMessage(CurrentUsers.require().id(), sessionId, request.content());
        SseEmitter emitter = new SseEmitter(120000L);
        emitter.send(SseEmitter.event().name("message").data(session.messages().get(session.messages().size() - 1).content()));
        emitter.send(SseEmitter.event().name("done").data("[DONE]"));
        emitter.complete();
        return emitter;
    }
}

record CreateSessionRequest(String title, String contextType) {
}

record SendMessageRequest(@NotBlank String content) {
}

