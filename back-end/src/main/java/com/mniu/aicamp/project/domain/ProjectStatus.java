package com.mniu.aicamp.project.domain;

import com.mniu.aicamp.shared.api.ErrorCode;
import com.mniu.aicamp.shared.exception.BusinessException;

public enum ProjectStatus {
    ACTIVE,
    COMPLETED,
    ARCHIVED;

    public void assertCanTransitionTo(ProjectStatus target, int completionPercent) {
        if (this == COMPLETED && target == ACTIVE) {
            throw new BusinessException(ErrorCode.PROJECT_INVALID_STATUS_TRANSITION, "Completed project cannot be reactivated");
        }
        if (target == COMPLETED && completionPercent < 100) {
            throw new BusinessException(ErrorCode.PROJECT_COMPLETION_TOO_LOW, "All project tasks must be completed first");
        }
    }
}
