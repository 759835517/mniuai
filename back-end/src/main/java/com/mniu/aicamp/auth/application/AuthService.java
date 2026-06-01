package com.mniu.aicamp.auth.application;

import com.mniu.aicamp.growth.application.GrowthService;
import com.mniu.aicamp.notification.application.NotificationService;
import com.mniu.aicamp.shared.api.ErrorCode;
import com.mniu.aicamp.shared.exception.BusinessException;
import com.mniu.aicamp.shared.security.CurrentUser;
import com.mniu.aicamp.shared.util.SnowflakeIdGenerator;
import com.mniu.aicamp.user.application.UserAccount;
import com.mniu.aicamp.user.application.UserAccountService;
import com.mniu.aicamp.user.infrastructure.mapper.UserMapper;
import com.mniu.aicamp.user.infrastructure.po.UserPO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {
    private final PasswordEncoder passwordEncoder;
    private final StringRedisTemplate redis;
    private final UserAccountService userAccounts;
    private final GrowthService growthService;
    private final NotificationService notificationService;
    private final SnowflakeIdGenerator idGenerator;
    private final UserMapper users;
    private final Duration accessTokenTtl;
    private final Duration refreshTokenTtl;

    public AuthService(PasswordEncoder passwordEncoder,
                       StringRedisTemplate redis,
                       UserAccountService userAccounts,
                       GrowthService growthService,
                       NotificationService notificationService,
                       SnowflakeIdGenerator idGenerator,
                       UserMapper users,
                       @Value("${app.security.jwt.access-token-ttl:15m}") Duration accessTokenTtl,
                       @Value("${app.security.jwt.refresh-token-ttl:7d}") Duration refreshTokenTtl) {
        this.passwordEncoder = passwordEncoder;
        this.redis = redis;
        this.userAccounts = userAccounts;
        this.growthService = growthService;
        this.notificationService = notificationService;
        this.idGenerator = idGenerator;
        this.users = users;
        this.accessTokenTtl = accessTokenTtl;
        this.refreshTokenTtl = refreshTokenTtl;
    }

    @Transactional
    public Tokens register(String email, String password, String displayName) {
        if (password == null || password.length() < 8) {
            throw new BusinessException(ErrorCode.WEAK_PASSWORD, "Password must contain at least 8 characters");
        }
        String normalized = email.toLowerCase();
        Long userId = idGenerator.nextId();
        UserPO user = new UserPO();
        user.setId(userId);
        user.setEmail(normalized);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setDisplayName(displayName == null || displayName.isBlank() ? normalized : displayName);
        user.setSkills("");
        user.setGoal("");
        user.setWeeklyHours(0);
        try {
            users.insert(user);
        } catch (DuplicateKeyException ex) {
            throw new BusinessException(ErrorCode.EMAIL_ALREADY_EXISTS, "Email already exists");
        }
        growthService.initializeGrowth(userId);
        notificationService.addNotification(userId, "WELCOME", "Welcome to MNIU AI Camp");
        return issueTokens(userId);
    }

    public Tokens login(String email, String password) {
        UserAccount account = userAccounts.findUserByEmail(email.toLowerCase())
                .orElseThrow(() -> new BusinessException(ErrorCode.INVALID_CREDENTIALS, "Invalid email or password"));
        if (!passwordEncoder.matches(password, account.passwordHash())) {
            throw new BusinessException(ErrorCode.INVALID_CREDENTIALS, "Invalid email or password");
        }
        return issueTokens(account.id());
    }

    public Tokens refresh(String refreshToken) {
        String key = refreshKey(refreshToken);
        String value = redis.opsForValue().get(key);
        if (value == null) {
            throw new BusinessException(ErrorCode.REFRESH_TOKEN_INVALID, "Refresh token is invalid");
        }
        redis.delete(key);
        return issueTokens(Long.parseLong(value));
    }

    public Optional<CurrentUser> authenticate(String token) {
        String userId = redis.opsForValue().get(accessKey(token));
        if (userId == null) {
            return Optional.empty();
        }
        try {
            UserAccount account = userAccounts.getUser(Long.parseLong(userId));
            return Optional.of(new CurrentUser(account.id(), account.email()));
        } catch (RuntimeException ex) {
            return Optional.empty();
        }
    }

    private Tokens issueTokens(Long userId) {
        String access = "acc_" + UUID.randomUUID();
        String refresh = "ref_" + UUID.randomUUID();
        redis.opsForValue().set(accessKey(access), userId.toString(), accessTokenTtl);
        redis.opsForValue().set(refreshKey(refresh), userId.toString(), refreshTokenTtl);
        return new Tokens(access, refresh, "Bearer", accessTokenTtl.toSeconds());
    }

    private String accessKey(String token) {
        return "auth:access:" + token;
    }

    private String refreshKey(String token) {
        return "auth:refresh:" + token;
    }

    public record Tokens(String accessToken, String refreshToken, String tokenType, long expiresInSeconds) {
    }
}
