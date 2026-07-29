package com.mniu.aicamp.shared.security;

import com.mniu.aicamp.shared.exception.BusinessException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class CurrentUsersTest {
    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void requiresCurrentUserPrincipal() {
        assertThatThrownBy(CurrentUsers::require).isInstanceOf(BusinessException.class);

        CurrentUser currentUser = new CurrentUser(1L, "dev@example.com", "USER");
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(currentUser, null, List.of()));

        assertThat(CurrentUsers.require()).isEqualTo(currentUser);
    }
}

