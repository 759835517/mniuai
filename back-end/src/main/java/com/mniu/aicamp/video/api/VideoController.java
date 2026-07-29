package com.mniu.aicamp.video.api;

import com.mniu.aicamp.shared.api.ApiResponse;
import com.mniu.aicamp.shared.security.CurrentUsers;
import com.mniu.aicamp.video.application.HeartbeatRequest;
import com.mniu.aicamp.video.application.PlayUrlResponse;
import com.mniu.aicamp.video.application.ProgressSnapshot;
import com.mniu.aicamp.video.application.VideoHeartbeatService;
import com.mniu.aicamp.video.application.VideoService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class VideoController {
    private final VideoService videoService;
    private final VideoHeartbeatService heartbeatService;

    public VideoController(VideoService videoService, VideoHeartbeatService heartbeatService) {
        this.videoService = videoService;
        this.heartbeatService = heartbeatService;
    }

    @GetMapping("/api/v1/lessons/{lessonId}/play-url")
    ApiResponse<PlayUrlResponse> playUrl(@PathVariable Long lessonId) {
        return ApiResponse.ok(videoService.getPlayUrl(CurrentUsers.require().id(), lessonId));
    }

    @PostMapping("/api/v1/lessons/{lessonId}/heartbeat")
    ApiResponse<ProgressSnapshot> heartbeat(@PathVariable Long lessonId,
                                            @Valid @RequestBody HeartbeatRequest request) {
        return ApiResponse.ok(heartbeatService.processHeartbeat(CurrentUsers.require().id(), lessonId, request));
    }

    @GetMapping("/api/v1/lessons/{lessonId}/progress")
    ApiResponse<ProgressSnapshot> progress(@PathVariable Long lessonId) {
        return ApiResponse.ok(videoService.getProgress(CurrentUsers.require().id(), lessonId));
    }
}
