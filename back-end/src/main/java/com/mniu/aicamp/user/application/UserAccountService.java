package com.mniu.aicamp.user.application;

import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.mniu.aicamp.shared.api.ErrorCode;
import com.mniu.aicamp.shared.exception.BusinessException;
import com.mniu.aicamp.user.infrastructure.mapper.UserMapper;
import com.mniu.aicamp.user.infrastructure.po.UserPO;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class UserAccountService {
    private final UserMapper users;

    public UserAccountService(UserMapper users) {
        this.users = users;
    }

    public UserAccount getUser(Long userId) {
        UserPO po = users.selectById(userId);
        if (po == null) {
            throw new BusinessException(ErrorCode.USER_NOT_FOUND, "User not found");
        }
        return toUserAccount(po);
    }

    public Optional<UserAccount> findUserByEmail(String email) {
        UserPO user = users.selectOne(Wrappers.<UserPO>lambdaQuery().eq(UserPO::getEmail, email));
        return Optional.ofNullable(user).map(this::toUserAccount);
    }

    public UserAccount updateProfile(Long userId, String displayName, String goal, Integer weeklyHours) {
        UserAccount current = getUser(userId);
        UserPO update = new UserPO();
        update.setId(userId);
        update.setDisplayName(blankTo(displayName, current.displayName()));
        update.setGoal(blankTo(goal, current.goal()));
        update.setWeeklyHours(weeklyHours == null ? current.weeklyHours() : weeklyHours);
        users.updateById(update);
        return getUser(userId);
    }

    public UserAccount updateSkills(Long userId, List<String> skills) {
        getUser(userId);
        UserPO update = new UserPO();
        update.setId(userId);
        update.setSkills(join(skills));
        users.updateById(update);
        return getUser(userId);
    }

    private UserAccount toUserAccount(UserPO po) {
        return new UserAccount(po.getId(), po.getEmail(), po.getPasswordHash(), po.getDisplayName(),
                split(po.getSkills()), po.getGoal(), po.getWeeklyHours() == null ? 0 : po.getWeeklyHours());
    }

    private String blankTo(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
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
}
