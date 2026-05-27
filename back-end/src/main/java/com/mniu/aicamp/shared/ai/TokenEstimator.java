package com.mniu.aicamp.shared.ai;

import org.springframework.stereotype.Component;

@Component
public class TokenEstimator {
    public int estimate(String text) {
        if (text == null || text.isBlank()) {
            return 0;
        }
        int ascii = 0;
        int nonAscii = 0;
        for (char c : text.toCharArray()) {
            if (c <= 127) {
                ascii++;
            } else {
                nonAscii++;
            }
        }
        return Math.max(1, (int) Math.ceil(ascii / 4.0) + nonAscii);
    }
}
