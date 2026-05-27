package com.mniu.aicamp.shared.security;

import com.mniu.aicamp.shared.api.ErrorCode;
import com.mniu.aicamp.shared.exception.BusinessException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public final class CurrentUsers {
    private CurrentUsers() {
    }

    public static CurrentUser require() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof CurrentUser user)) {
            throw new BusinessException(ErrorCode.UNAUTHORIZED, "Authentication required");
        }
        return user;
    }
}
