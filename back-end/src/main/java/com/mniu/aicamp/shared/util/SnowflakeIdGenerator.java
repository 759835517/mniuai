package com.mniu.aicamp.shared.util;

import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.function.LongSupplier;

@Component
public class SnowflakeIdGenerator {
    private static final long EPOCH = Instant.parse("2026-01-01T00:00:00Z").toEpochMilli();
    private static final long WORKER_ID_BITS = 10L;
    private static final long SEQUENCE_BITS = 12L;
    private static final long MAX_WORKER_ID = ~(-1L << WORKER_ID_BITS);
    private static final long SEQUENCE_MASK = ~(-1L << SEQUENCE_BITS);
    private static final long WORKER_ID_SHIFT = SEQUENCE_BITS;
    private static final long TIMESTAMP_SHIFT = SEQUENCE_BITS + WORKER_ID_BITS;

    private final long workerId;
    private final LongSupplier clock;
    private long lastTimestamp = -1L;
    private long sequence = 0L;

    public SnowflakeIdGenerator() {
        this(resolveWorkerId(), System::currentTimeMillis);
    }

    SnowflakeIdGenerator(long workerId, LongSupplier clock) {
        validateWorkerId(workerId);
        this.workerId = workerId;
        this.clock = clock;
    }

    public synchronized long nextId() {
        long timestamp = currentTimeMillis();
        if (timestamp < lastTimestamp) {
            throw new IllegalStateException("Clock moved backwards while generating snowflake id");
        }
        if (timestamp == lastTimestamp) {
            sequence = (sequence + 1) & SEQUENCE_MASK;
            if (sequence == 0) {
                timestamp = waitNextMillis(timestamp);
            }
        } else {
            sequence = 0L;
        }
        lastTimestamp = timestamp;
        return ((timestamp - EPOCH) << TIMESTAMP_SHIFT) | (workerId << WORKER_ID_SHIFT) | sequence;
    }

    private long waitNextMillis(long timestamp) {
        long next = currentTimeMillis();
        while (next <= timestamp) {
            next = currentTimeMillis();
        }
        return next;
    }

    private long currentTimeMillis() {
        return clock.getAsLong();
    }

    private static long resolveWorkerId() {
        String configured = System.getenv("SNOWFLAKE_WORKER_ID");
        if (configured == null || configured.isBlank()) {
            return 1L;
        }
        return validateWorkerId(Long.parseLong(configured));
    }

    private static long validateWorkerId(long workerId) {
        if (workerId < 0 || workerId > MAX_WORKER_ID) {
            throw new IllegalArgumentException("SNOWFLAKE_WORKER_ID must be between 0 and " + MAX_WORKER_ID);
        }
        return workerId;
    }
}
