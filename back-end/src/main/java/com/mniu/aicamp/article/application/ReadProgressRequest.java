package com.mniu.aicamp.article.application;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;

public record ReadProgressRequest(@DecimalMin("0.0") @DecimalMax("1.0") double scrollRatio,
                                  @Min(0) int readSeconds) {
}
