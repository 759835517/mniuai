package com.mniu.aicamp.notification.api;

import com.mniu.aicamp.notification.application.Notification;
import com.mniu.aicamp.notification.application.NotificationService;
import com.mniu.aicamp.shared.api.ApiResponse;
import com.mniu.aicamp.shared.api.PageResponse;
import com.mniu.aicamp.shared.security.CurrentUsers;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/notifications")
public class NotificationController {
    private final NotificationService service;

    public NotificationController(NotificationService service) {
        this.service = service;
    }

    @GetMapping
    ApiResponse<?> list(@RequestParam(required = false) Integer page,
                        @RequestParam(required = false) Integer size,
                        @RequestParam(required = false, defaultValue = "false") boolean unreadOnly) {
        List<Notification> notifications = service.listNotifications(CurrentUsers.require().id());
        if (unreadOnly) {
            notifications = notifications.stream().filter(notification -> !notification.read()).toList();
        }
        if (page == null && size == null) {
            return ApiResponse.ok(notifications);
        }
        return ApiResponse.ok(PageResponse.of(notifications, page == null ? 0 : page, size == null ? 20 : size));
    }

    @GetMapping("/unread-count")
    ApiResponse<Map<String, Long>> unreadCount() {
        return ApiResponse.ok(Map.of("count", service.unreadNotifications(CurrentUsers.require().id())));
    }

    @PutMapping("/{notificationId}/read")
    ApiResponse<Map<String, Boolean>> read(@PathVariable Long notificationId) {
        service.markNotificationRead(CurrentUsers.require().id(), notificationId);
        return ApiResponse.ok(Map.of("read", true));
    }

    @PutMapping("/read-all")
    ApiResponse<Map<String, Boolean>> readAll() {
        service.markAllNotificationsRead(CurrentUsers.require().id());
        return ApiResponse.ok(Map.of("read", true));
    }
}

