package com.mniu.aicamp.growth.application;

import com.mniu.aicamp.growth.infrastructure.mapper.GrowthMapper;
import com.mniu.aicamp.growth.infrastructure.po.GrowthPO;
import com.mniu.aicamp.notification.application.NotificationService;
import com.mniu.aicamp.shared.api.ErrorCode;
import com.mniu.aicamp.shared.exception.BusinessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
public class GrowthService {
    private final GrowthMapper growthRows;
    private final NotificationService notifications;

    public GrowthService(GrowthMapper growthRows, NotificationService notifications) {
        this.growthRows = growthRows;
        this.notifications = notifications;
    }

    public void initializeGrowth(Long userId) {
        GrowthPO growth = new GrowthPO();
        growth.setUserId(userId);
        growth.setXp(0);
        growth.setLevel(1);
        growth.setStreakDays(0);
        growth.setAchievements("");
        growth.setActivityLog("");
        growthRows.insert(growth);
    }

    @Transactional
    public void addXp(Long userId, int amount, String reason) {
        Growth current = getGrowth(userId);
        int xp = current.xp() + amount;
        int level = xp / 100 + 1;
        List<String> achievements = new ArrayList<>(current.achievements());
        List<String> activityLog = new ArrayList<>(current.activityLog());
        activityLog.add(reason);
        if (xp >= 100 && !achievements.contains("LEVEL_2")) {
            achievements.add("LEVEL_2");
            notifications.addNotification(userId, "ACHIEVEMENT_UNLOCKED", "Level 2 unlocked");
        }
        GrowthPO update = new GrowthPO();
        update.setUserId(userId);
        update.setXp(xp);
        update.setLevel(level);
        update.setStreakDays(Math.max(1, current.streakDays()));
        update.setAchievements(join(achievements));
        update.setActivityLog(join(activityLog));
        growthRows.updateById(update);
    }

    public Growth getGrowth(Long userId) {
        GrowthPO po = growthRows.selectById(userId);
        if (po == null) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND, "Growth row not found");
        }
        return new Growth(valueOrZero(po.getXp()), valueOrOne(po.getLevel()), valueOrZero(po.getStreakDays()),
                split(po.getAchievements()), split(po.getActivityLog()));
    }

    public List<String> achievements(Long userId) {
        return getGrowth(userId).achievements();
    }

    public List<String> activityLog(Long userId) {
        return getGrowth(userId).activityLog();
    }

    private String join(List<String> values) {
        return values == null ? "" : String.join("\n", values);
    }

    private List<String> split(String value) {
        if (value == null || value.isBlank()) {
            return List.of();
        }
        return Arrays.asList(value.split("\\R"));
    }

    private int valueOrZero(Integer value) {
        return value == null ? 0 : value;
    }

    private int valueOrOne(Integer value) {
        return value == null ? 1 : value;
    }

    public record Growth(int xp, int level, int streakDays, List<String> achievements, List<String> activityLog) {
    }
}
