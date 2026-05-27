package com.mniu.aicamp.project.domain;

import com.mniu.aicamp.shared.exception.BusinessException;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class ProjectStatusTest {
    @Test
    void activeCanCompleteOnlyWhenAllTasksDone() {
        assertThatThrownBy(() -> ProjectStatus.ACTIVE.assertCanTransitionTo(ProjectStatus.COMPLETED, 99))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("completed");

        assertThatCode(() -> ProjectStatus.ACTIVE.assertCanTransitionTo(ProjectStatus.COMPLETED, 100))
                .doesNotThrowAnyException();
    }

    @Test
    void completedCannotReactivate() {
        assertThatThrownBy(() -> ProjectStatus.COMPLETED.assertCanTransitionTo(ProjectStatus.ACTIVE, 100))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("reactivated");
    }
}
