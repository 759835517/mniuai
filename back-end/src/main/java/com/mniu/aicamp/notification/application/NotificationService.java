package com.mniu.aicamp.notification.application;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.mniu.aicamp.notification.infrastructure.mapper.NotificationMapper;
import com.mniu.aicamp.notification.infrastructure.po.NotificationPO;
import com.mniu.aicamp.shared.util.SnowflakeIdGenerator;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {
    private final NotificationMapper notifications;
    private final SnowflakeIdGenerator idGenerator;

    public NotificationService(NotificationMapper notifications, SnowflakeIdGenerator idGenerator) {
        this.notifications = notifications;
        this.idGenerator = idGenerator;
    }

    public void addNotification(Long userId, String type, String message) {
        NotificationPO notification = new NotificationPO();
        notification.setId(idGenerator.nextId());
        notification.setUserId(userId);
        notification.setType(type);
        notification.setMessage(message);
        notification.setRead(false);
        notifications.insert(notification);
    }

    public List<Notification> listNotifications(Long userId) {
        return notifications.selectList(Wrappers.<NotificationPO>lambdaQuery()
                        .eq(NotificationPO::getUserId, userId)
                        .orderByAsc(NotificationPO::getCreatedAt))
                .stream().map(this::toNotification).toList();
    }

    public long unreadNotifications(Long userId) {
        return notifications.selectCount(Wrappers.<NotificationPO>lambdaQuery()
                .eq(NotificationPO::getUserId, userId)
                .eq(NotificationPO::getRead, false));
    }

    public void markNotificationRead(Long userId, Long notificationId) {
        notifications.update(null, Wrappers.<NotificationPO>lambdaUpdate()
                .eq(NotificationPO::getUserId, userId)
                .eq(NotificationPO::getId, notificationId)
                .set(NotificationPO::getRead, true));
    }

    public void markAllNotificationsRead(Long userId) {
        notifications.update(null, Wrappers.<NotificationPO>lambdaUpdate()
                .eq(NotificationPO::getUserId, userId)
                .set(NotificationPO::getRead, true));
    }

    private Notification toNotification(NotificationPO po) {
        return new Notification(po.getId(), po.getType(), po.getMessage(),
                Boolean.TRUE.equals(po.getRead()), po.getCreatedAt());
    }
}
